"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/event";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  onClick: () => void;
}

const MAX_DOTS = 3;

export function DayCell({ date, isCurrentMonth, isToday, isSelected, events, onClick }: DayCellProps) {
  const visibleEvents = events.slice(0, MAX_DOTS);
  const overflowCount = events.length - visibleEvents.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-lg p-1.5 text-left transition-colors",
        "hover:bg-white/[0.05]",
        isSelected && "bg-cyan-400/[0.08] ring-1 ring-cyan-400/30",
        !isCurrentMonth && "opacity-30"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
          isToday ? "bg-cyan-400/80 font-medium text-[#0A0E14]" : "text-white/70"
        )}
      >
        {date.getDate()}
      </span>

      {events.length > 0 && (
        <div className="flex flex-wrap gap-0.5">
          {visibleEvents.map((event) => (
            <span
              key={event.id}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: event.color }}
            />
          ))}
          {overflowCount > 0 && (
            <span className="text-[9px] leading-none text-white/40">+{overflowCount}</span>
          )}
        </div>
      )}
    </button>
  );
}
