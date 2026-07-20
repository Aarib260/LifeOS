"use client";

import { X } from "lucide-react";
import type { CalendarEvent } from "@/types/event";

interface EventItemProps {
  event: CalendarEvent;
  onDelete: () => void;
  /** Show the date (used in the "Upcoming" list, where day isn't otherwise implied) */
  showDate?: boolean;
}

export function EventItem({ event, onDelete, showDate }: EventItemProps) {
  return (
    <div className="group flex items-start gap-2 py-1.5">
      <span
        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: event.color }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-[var(--text-2)]">{event.title}</p>
        <p className="text-[10px] text-[var(--text-4)]">
          {showDate &&
            new Date(event.eventDate).toLocaleDateString([], { month: "short", day: "numeric" })}
          {showDate && event.startTime && " · "}
          {event.startTime}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete event"
        className="shrink-0 text-white/0 transition-colors group-hover:text-[var(--text-4)] hover:!text-red-400"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
