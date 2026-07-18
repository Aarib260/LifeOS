import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToTask } from "@/lib/taskMapper";
import type { UpdateTaskInput } from "@/types/task";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body: UpdateTaskInput = await request.json();

    const existingRows = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    // Fetch-merge-update rather than building a dynamic SET clause —
    // simpler and safer than assembling raw SQL fragments for a partial update.
    const merged = {
      title: body.title ?? existing.title,
      notes: body.notes !== undefined ? body.notes : existing.notes,
      is_complete: body.isComplete ?? existing.is_complete,
      priority: body.priority ?? existing.priority,
      due_date: body.dueDate !== undefined ? body.dueDate : existing.due_date,
    };

    const rows = await sql`
      UPDATE tasks
      SET
        title = ${merged.title},
        notes = ${merged.notes},
        is_complete = ${merged.is_complete},
        priority = ${merged.priority},
        due_date = ${merged.due_date},
        updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(mapRowToTask(rows[0]));
  } catch (error) {
    console.error("[PATCH /api/tasks/:id]", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/tasks/:id]", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
