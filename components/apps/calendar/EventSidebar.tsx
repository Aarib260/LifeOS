"use client";

import { EventComposer } from "./EventComposer";
import { EventItem } from "./EventItem";
import { toDateString } from "@/lib/calendarUtils";
import type { CalendarEvent } from "@/types/event";

interface EventSidebarProps {
  events: CalendarEvent[];
  selectedDate: string;
  onAdd: (input: { title: string; eventDate: string; startTime?: string; color: string }) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function EventSidebar({
  events,
  selectedDate,
  onAdd,
  onDelete,
  isPending,
  isLoading,
  isError,
}: EventSidebarProps) {
  const todayStr = toDateString(new Date());

  const selectedDayEvents = events.filter((e) => e.eventDate === selectedDate);
  const upcoming = events
    .filter((e) => e.eventDate >= todayStr)
    .slice(0, 8);

  return (
    <div className="flex h-full w-56 shrink-0 flex-col border-l border-white/[0.06]">
      <EventComposer selectedDate={selectedDate} onAdd={onAdd} isPending={isPending} />

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading && <p className="text-center text-xs text-white/30">Loading...</p>}
        {isError && (
          <p className="text-center text-xs text-red-300/70">Couldn&apos;t load events.</p>
        )}

        {!isLoading && !isError && (
          <>
            {selectedDayEvents.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-white/30">
                  {new Date(selectedDate).toLocaleDateString([], { month: "short", day: "numeric" })}
                </p>
                {selectedDayEvents.map((event) => (
                  <EventItem key={event.id} event={event} onDelete={() => onDelete(event.id)} />
                ))}
              </div>
            )}

            <div>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-white/30">
                Upcoming
              </p>
              {upcoming.length === 0 ? (
                <p className="text-xs text-white/25">Nothing scheduled.</p>
              ) : (
                upcoming.map((event) => (
                  <EventItem key={event.id} event={event} onDelete={() => onDelete(event.id)} showDate />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
