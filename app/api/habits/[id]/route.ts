import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToHabit } from "@/lib/habitMapper";
import type { UpdateHabitInput } from "@/types/habit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body: UpdateHabitInput = await request.json();

    const existingRows = await sql`SELECT * FROM habits WHERE id = ${id}`;
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    const merged = {
      name: body.name ?? existing.name,
      color: body.color ?? existing.color,
      target_days: body.targetDays ?? existing.target_days,
    };

    const rows = await sql`
      UPDATE habits
      SET name = ${merged.name}, color = ${merged.color}, target_days = ${merged.target_days}
      WHERE id = ${id}
      RETURNING *
    `;

    const logRows = await sql`
      SELECT logged_date::text FROM habit_logs WHERE habit_id = ${id}
    `;

    return NextResponse.json(
      mapRowToHabit(rows[0], logRows.map((r) => r.logged_date))
    );
  } catch (error) {
    console.error("[PATCH /api/habits/:id]", error);
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    // habit_logs rows are removed automatically via ON DELETE CASCADE
    await sql`DELETE FROM habits WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/habits/:id]", error);
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}