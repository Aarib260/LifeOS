import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getGoalById } from "@/lib/goalQueries";
import type { UpdateGoalInput } from "@/types/goal";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body: UpdateGoalInput = await request.json();

    const existing = await getGoalById(id);
    if (!existing) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const merged = {
      title: body.title ?? existing.title,
      description: body.description !== undefined ? body.description : existing.description,
      target_date: body.targetDate !== undefined ? body.targetDate : existing.targetDate,
    };

    await sql`
      UPDATE goals
      SET title = ${merged.title}, description = ${merged.description}, target_date = ${merged.target_date}, updated_at = now()
      WHERE id = ${id}
    `;

    const goal = await getGoalById(id);
    return NextResponse.json(goal);
  } catch (error) {
    console.error("[PATCH /api/goals/:id]", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    // goal_milestones rows are removed automatically via ON DELETE CASCADE
    await sql`DELETE FROM goals WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/goals/:id]", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}