import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToEntry } from "@/lib/journalMapper";
import type { CreateEntryInput } from "@/types/journal";

export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM journal_entries
      ORDER BY entry_date DESC, created_at DESC
    `;
    return NextResponse.json(rows.map(mapRowToEntry));
  } catch (error) {
    console.error("[GET /api/journal]", error);
    return NextResponse.json({ error: "Failed to load journal entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateEntryInput = await request.json();

    const rows = await sql`
      INSERT INTO journal_entries (title, content, entry_date)
      VALUES (
        ${body.title ?? null},
        ${body.content ?? ""},
        ${body.entryDate ?? new Date().toISOString().slice(0, 10)}
      )
      RETURNING *
    `;

    return NextResponse.json(mapRowToEntry(rows[0]), { status: 201 });
  } catch (error) {
    console.error("[POST /api/journal]", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
