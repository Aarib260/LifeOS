import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToGoal } from "@/lib/goalMapper";
import { getGoalById } from "@/lib/goalQueries";
import type { CreateGoalInput } from "@/types/goal";

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        g.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', m.id,
              'title', m.title,
              'isComplete', m.is_complete,
              'position', m.position
            )
            ORDER BY m.position
          ) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) AS milestones
      FROM goals g
      LEFT JOIN goal_milestones m ON m.goal_id = g.id
      GROUP BY g.id
      ORDER BY g.created_at ASC
    `;

    return NextResponse.json(rows.map(mapRowToGoal));
  } catch (error) {
    console.error("[GET /api/goals]", error);
    return NextResponse.json({ error: "Failed to load goals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateGoalInput = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO goals (title, description, target_date)
      VALUES (${body.title.trim()}, ${body.description ?? null}, ${body.targetDate ?? null})
      RETURNING id
    `;

    const goal = await getGoalById(rows[0].id);
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("[POST /api/goals]", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
