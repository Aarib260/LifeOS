import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToHabit } from "@/lib/habitMapper";
import type { CreateHabitInput } from "@/types/habit";

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        h.*,
        COALESCE(
          array_agg(hl.logged_date::text) FILTER (WHERE hl.logged_date IS NOT NULL),
          '{}'
        ) AS logged_dates
      FROM habits h
      LEFT JOIN habit_logs hl ON hl.habit_id = h.id
      GROUP BY h.id
      ORDER BY h.created_at ASC
    `;

    return NextResponse.json(rows.map((row) => mapRowToHabit(row, row.logged_dates)));
  } catch (error) {
    console.error("[GET /api/habits]", error);
    return NextResponse.json({ error: "Failed to load habits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateHabitInput = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO habits (name, color, target_days)
      VALUES (
        ${body.name.trim()},
        ${body.color ?? "#22D3EE"},
        ${body.targetDays ?? [0, 1, 2, 3, 4, 5, 6]}
      )
      RETURNING *
    `;

    return NextResponse.json(mapRowToHabit(rows[0], []), { status: 201 });
  } catch (error) {
    console.error("[POST /api/habits]", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}