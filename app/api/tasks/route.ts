import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToTask } from "@/lib/taskMapper";
import type { CreateTaskInput } from "@/types/task";

export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM tasks
      ORDER BY is_complete ASC, created_at DESC
    `;
    return NextResponse.json(rows.map(mapRowToTask));
  } catch (error) {
    console.error("[GET /api/tasks]", error);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateTaskInput = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO tasks (title, notes, priority, due_date)
      VALUES (
        ${body.title.trim()},
        ${body.notes ?? null},
        ${body.priority ?? 0},
        ${body.dueDate ?? null}
      )
      RETURNING *
    `;

    return NextResponse.json(mapRowToTask(rows[0]), { status: 201 });
  } catch (error) {
    console.error("[POST /api/tasks]", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}