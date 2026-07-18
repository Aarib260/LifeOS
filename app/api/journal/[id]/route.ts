import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToEntry } from "@/lib/journalMapper";
import type { UpdateEntryInput } from "@/types/journal";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body: UpdateEntryInput = await request.json();

    const existingRows = await sql`SELECT * FROM journal_entries WHERE id = ${id}`;
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    const merged = {
      title: body.title !== undefined ? body.title : existing.title,
      content: body.content ?? existing.content,
    };

    const rows = await sql`
      UPDATE journal_entries
      SET title = ${merged.title}, content = ${merged.content}, updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(mapRowToEntry(rows[0]));
  } catch (error) {
    console.error("[PATCH /api/journal/:id]", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await sql`DELETE FROM journal_entries WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/journal/:id]", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
