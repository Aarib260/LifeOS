import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getGoalById } from "@/lib/goalQueries";

interface RouteParams {
  params: Promise<{ id: string; milestoneId: string }>;
}

interface UpdateMilestoneInput {
  title?: string;
  isComplete?: boolean;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id: goalId, milestoneId } = await params;

  try {
    const body: UpdateMilestoneInput = await request.json();

    const existingRows = await sql`
      SELECT * FROM goal_milestones WHERE id = ${milestoneId} AND goal_id = ${goalId}
    `;
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    const merged = {
      title: body.title ?? existing.title,
      is_complete: body.isComplete ?? existing.is_complete,
    };

    await sql`
      UPDATE goal_milestones
      SET title = ${merged.title}, is_complete = ${merged.is_complete}
      WHERE id = ${milestoneId}
    `;

    const goal = await getGoalById(goalId);
    return NextResponse.json(goal);
  } catch (error) {
    console.error("[PATCH /api/goals/:id/milestones/:milestoneId]", error);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id: goalId, milestoneId } = await params;

  try {
    await sql`DELETE FROM goal_milestones WHERE id = ${milestoneId} AND goal_id = ${goalId}`;
    const goal = await getGoalById(goalId);
    return NextResponse.json(goal);
  } catch (error) {
    console.error("[DELETE /api/goals/:id/milestones/:milestoneId]", error);
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
