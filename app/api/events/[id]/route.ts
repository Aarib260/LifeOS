import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToEvent } from "@/lib/eventMapper";
import type { UpdateEventInput } from "@/types/event";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body: UpdateEventInput = await request.json();

    const existingRows = await sql`SELECT * FROM events WHERE id = ${id}`;
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    const merged = {
      title: body.title ?? existing.title,
      description: body.description !== undefined ? body.description : existing.description,
      event_date: body.eventDate ?? existing.event_date,
      start_time: body.startTime !== undefined ? body.startTime : existing.start_time,
      end_time: body.endTime !== undefined ? body.endTime : existing.end_time,
      color: body.color ?? existing.color,
    };

    const rows = await sql`
      UPDATE events
      SET
        title = ${merged.title},
        description = ${merged.description},
        event_date = ${merged.event_date},
        start_time = ${merged.start_time},
        end_time = ${merged.end_time},
        color = ${merged.color},
        updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(mapRowToEvent(rows[0]));
  } catch (error) {
    console.error("[PATCH /api/events/:id]", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await sql`DELETE FROM events WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/events/:id]", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
