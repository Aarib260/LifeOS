import { sql } from "@/lib/db";
import { mapRowToTask } from "@/lib/taskMapper";
import { mapRowToHabit } from "@/lib/habitMapper";
import { mapRowToGoal } from "@/lib/goalMapper";
import { mapRowToEvent } from "@/lib/eventMapper";
import { toDateString } from "@/lib/streak";

/**
 * OpenAI-compatible tool schemas (OpenRouter uses the same format).
 * Kept intentionally read-only for now — the assistant can look things
 * up but can't create/modify/delete anything yet. That's a deliberate
 * scope cut, not an oversight: write access needs confirmation flows
 * (the same "confirm before acting" pattern as any agent) that are
 * worth building carefully rather than bolting on here.
 */
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

const TOOL_EXECUTORS: Record<string, () => Promise<unknown>> = {
  get_tasks: getTasks,
  get_habits: getHabits,
  get_goals: getGoals,
  get_upcoming_events: getUpcomingEvents,
};

export async function executeTool(name: string): Promise<unknown> {
  const executor = TOOL_EXECUTORS[name];
  if (!executor) return { error: `Unknown tool: ${name}` };
  try {
    return await executor();
  } catch (error) {
    console.error(`[AI tool: ${name}]`, error);
    return { error: `Failed to run ${name}` };
  }
}
