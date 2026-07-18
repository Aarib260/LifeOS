import type { CalendarEvent } from "@/types/event";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null; // Postgres returns TIME as "HH:MM:SS"
  end_time: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

/** Postgres TIME comes back as "HH:MM:SS" — trim to "HH:MM" for the UI. */
function trimSeconds(time: string | null): string | null {
  return time ? time.slice(0, 5) : null;
}

export function mapRowToEvent(row: EventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    eventDate: row.event_date,
    startTime: trimSeconds(row.start_time),
    endTime: trimSeconds(row.end_time),
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
