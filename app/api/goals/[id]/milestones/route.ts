import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getGoalById } from "@/lib/goalQueries";
import type { CreateMilestoneInput } from "@/types/goal";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id: goalId } = await params;

  try {
    const body: CreateMilestoneInput = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const countRows = await sql`
      SELECT COUNT(*)::int AS count FROM goal_milestones WHERE goal_id = ${goalId}
    `;
    const nextPosition = countRows[0].count;

    await sql`
      INSERT INTO goal_milestones (goal_id, title, position)
      VALUES (${goalId}, ${body.title.trim()}, ${nextPosition})
    `;

    const goal = await getGoalById(goalId);
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("[POST /api/goals/:id/milestones]", error);
    return NextResponse.json({ error: "Failed to add milestone" }, { status: 500 });
  }
}
