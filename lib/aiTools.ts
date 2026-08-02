import { sql } from "@/lib/db";
import { mapRowToTask } from "@/lib/taskMapper";
import { mapRowToHabit } from "@/lib/habitMapper";
import { mapRowToGoal } from "@/lib/goalMapper";
import { mapRowToEvent } from "@/lib/eventMapper";
import { toDateString } from "@/lib/streak";

/**
 * OpenAI-compatible tool schemas (OpenRouter uses the same format).
 * Data access stays read-only — the assistant can look up tasks, habits,
 * goals, and events, but still can't create/edit/delete any of them.
 * That's a deliberate scope cut, not an oversight: write access needs a
 * confirm-before-acting flow (the same pattern any tool-using agent
 * should have) that's worth building carefully rather than bolting on.
 * open_app is the one exception: it's non-destructive (worst case it
 * opens the wrong window) so it doesn't need that same confirmation gate.
 */
/**
 * Apps the assistant can launch on the user's behalf. Deliberately
 * excludes "file-viewer" (needs a specific file id as context — "just
 * open it" doesn't mean anything) and "ai-assistant" (it's already open,
 * asking it to open itself is a no-op at best).
 */
export const LAUNCHABLE_APP_IDS = [
  "tasks",
  "habits",
  "goals",
  "calendar",
  "journal",
  "settings",
  "terminal",
  "file-explorer",
  "app-store",
  "performance-monitor",
] as const;

export const AI_TOOLS = [
  {
    type: "function",
    function: {
      name: "get_tasks",
      description: "Get the user's incomplete tasks, most recent first.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_habits",
      description: "Get the user's habits with current streak and whether they're completed today.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_goals",
      description: "Get the user's goals with milestone progress percentage.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_upcoming_events",
      description: "Get the user's upcoming calendar events, soonest first.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "open_app",
      description:
        "Open or switch to one of the user's apps as a window on the desktop. Use this when the user asks to open, launch, or switch to a specific app by name.",
      parameters: {
        type: "object",
        properties: {
          appId: {
            type: "string",
            enum: LAUNCHABLE_APP_IDS,
            description: "The app to open.",
          },
        },
        required: ["appId"],
      },
    },
  },
] as const;

async function getTasks() {
  const rows = await sql`
    SELECT * FROM tasks WHERE is_complete = false ORDER BY created_at DESC LIMIT 20
  `;
  return rows.map(mapRowToTask).map((t) => ({
    title: t.title,
    priority: t.priority,
    dueDate: t.dueDate,
  }));
}

async function getHabits() {
  const rows = await sql`
    SELECT
      h.*,
      COALESCE(array_agg(hl.logged_date::text) FILTER (WHERE hl.logged_date IS NOT NULL), '{}') AS logged_dates
    FROM habits h
    LEFT JOIN habit_logs hl ON hl.habit_id = h.id
    GROUP BY h.id
  `;
  return rows
    .map((row) => mapRowToHabit(row, row.logged_dates))
    .map((h) => ({
      name: h.name,
      currentStreak: h.currentStreak,
      completedToday: h.completedToday,
    }));
}

async function getGoals() {
  const rows = await sql`
    SELECT
      g.*,
      COALESCE(
        json_agg(
          json_build_object('id', m.id, 'title', m.title, 'isComplete', m.is_complete, 'position', m.position)
          ORDER BY m.position
        ) FILTER (WHERE m.id IS NOT NULL),
        '[]'
      ) AS milestones
    FROM goals g
    LEFT JOIN goal_milestones m ON m.goal_id = g.id
    GROUP BY g.id
  `;
  return rows.map(mapRowToGoal).map((g) => ({
    title: g.title,
    progress: g.progress,
    targetDate: g.targetDate,
  }));
}

async function getUpcomingEvents() {
  const todayStr = toDateString(new Date());
  const rows = await sql`
    SELECT * FROM events WHERE event_date >= ${todayStr}
    ORDER BY event_date ASC, start_time ASC NULLS FIRST LIMIT 10
  `;
  return rows.map(mapRowToEvent).map((e) => ({
    title: e.title,
    date: e.eventDate,
    time: e.startTime,
  }));
}

function openApp(args: Record<string, unknown>) {
  const appId = args.appId;
  if (typeof appId !== "string" || !LAUNCHABLE_APP_IDS.includes(appId as (typeof LAUNCHABLE_APP_IDS)[number])) {
    return Promise.resolve({ error: `Not a launchable app id: ${String(appId)}` });
  }
  // No DB write, no window actually opens here — this just confirms the
  // request is valid. The route handler surfaces this as an `action` in
  // its response, and the client (useChat) is what actually calls the
  // window store's openApp, since that's client-only Zustand state a
  // server route has no way to reach.
  return Promise.resolve({ opened: appId });
}

const TOOL_EXECUTORS: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  get_tasks: getTasks,
  get_habits: getHabits,
  get_goals: getGoals,
  get_upcoming_events: getUpcomingEvents,
  open_app: openApp,
};

export async function executeTool(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
  const executor = TOOL_EXECUTORS[name];
  if (!executor) return { error: `Unknown tool: ${name}` };
  try {
    return await executor(args);
  } catch (error) {
    console.error(`[AI tool: ${name}]`, error);
    return { error: `Failed to run ${name}` };
  }
}
