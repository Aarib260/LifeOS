import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapRowToEvent } from "@/lib/eventMapper";
import type { CreateEventInput } from "@/types/event";

export async function GET() {
  try {
    // Fetches everything; the frontend groups by month/day itself. Fine at
    // hackathon scale — revisit with a date-range filter if the table grows large.
    const rows = await sql`
      SELECT * FROM events ORDER BY event_date ASC, start_time ASC NULLS FIRST
    `;
    return NextResponse.json(rows.map(mapRowToEvent));
  } catch (error) {
    console.error("[GET /api/events]", error);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateEventInput = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.eventDate) {
      return NextResponse.json({ error: "Event date is required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO events (title, description, event_date, start_time, end_time, color)
      VALUES (
        ${body.title.trim()},
        ${body.description ?? null},
        ${body.eventDate},
        ${body.startTime ?? null},
        ${body.endTime ?? null},
        ${body.color ?? "#22D3EE"}
      )
      RETURNING *
    `;

    return NextResponse.json(mapRowToEvent(rows[0]), { status: 201 });
  } catch (error) {
    console.error("[POST /api/events]", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
