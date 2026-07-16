"use client";

import { useState } from "react";
import { MonthGrid } from "./MonthGrid";
import { EventSidebar } from "./EventSidebar";
import { useEvents } from "./useEvents";
import { toDateString } from "@/lib/calendarUtils";

export function CalendarApp() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState(toDateString(today));

  const { events, isLoading, isError, createEvent, deleteEvent } = useEvents();

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-hidden">
        <MonthGrid
          year={year}
          month={month}
          events={events}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />
      </div>

      <EventSidebar
        events={events}
        selectedDate={selectedDate}
        onAdd={(input) => createEvent.mutate(input)}
        onDelete={(id) => deleteEvent.mutate(id)}
        isPending={createEvent.isPending}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}