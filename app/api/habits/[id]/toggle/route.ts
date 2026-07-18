import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToHabit } from "@/lib/habitMapper";
import { toDateString } from "@/lib/streak";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Toggles today's check-in for a habit: inserts a log row if today isn't
 * logged yet, deletes it if it is. Returns the full habit with its streak
 * recomputed, so the client doesn't need to duplicate the streak logic
 * to reflect the change immediately (it also does an optimistic update —
 * this is what confirms/corrects it).
 */
export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const todayStr = toDateString(new Date());

    const existingLog = await sql`
      SELECT 1 FROM habit_logs WHERE habit_id = ${id} AND logged_date = ${todayStr}
    `;

    if (existingLog.length > 0) {
      await sql`DELETE FROM habit_logs WHERE habit_id = ${id} AND logged_date = ${todayStr}`;
    } else {
      await sql`
        INSERT INTO habit_logs (habit_id, logged_date)
        VALUES (${id}, ${todayStr})
        ON CONFLICT (habit_id, logged_date) DO NOTHING
      `;
    }

    const habitRows = await sql`SELECT * FROM habits WHERE id = ${id}`;
    if (habitRows.length === 0) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const logRows = await sql`
      SELECT logged_date::text FROM habit_logs WHERE habit_id = ${id}
    `;

    return NextResponse.json(
      mapRowToHabit(habitRows[0], logRows.map((r) => r.logged_date))
    );
  } catch (error) {
    console.error("[POST /api/habits/:id/toggle]", error);
    return NextResponse.json({ error: "Failed to toggle habit" }, { status: 500 });
  }
}
