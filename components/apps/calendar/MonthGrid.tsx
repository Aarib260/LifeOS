"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayCell } from "./DayCell";
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  getMonthGridDays,
  isSameMonth,
  isToday as checkIsToday,
  toDateString,
} from "@/lib/calendarUtils";
import type { CalendarEvent } from "@/types/event";

interface MonthGridProps {
  year: number;
  month: number; // 0-11
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthGrid({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthGridProps) {
  const days = getMonthGridDays(year, month);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const list = eventsByDate.get(event.eventDate) ?? [];
    list.push(event);
    eventsByDate.set(event.eventDate, list);
  }

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-2)]">
          {MONTH_NAMES[month]} {year}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="rounded-md p-1 text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="rounded-md p-1 text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-center text-[10px] font-medium text-[var(--text-4)]">
            {label}
          </span>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 grid-rows-6 gap-1">
        {days.map((date) => {
          const dateStr = toDateString(date);
          return (
            <DayCell
              key={dateStr}
              date={date}
              isCurrentMonth={isSameMonth(date, year, month)}
              isToday={checkIsToday(date)}
              isSelected={dateStr === selectedDate}
              events={eventsByDate.get(dateStr) ?? []}
              onClick={() => onSelectDate(dateStr)}
            />
          );
        })}
      </div>
    </div>
  );
}
