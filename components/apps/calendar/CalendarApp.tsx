"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, X } from "lucide-react";
import { MonthGrid } from "./MonthGrid";
import { EventSidebar } from "./EventSidebar";
import { useEvents } from "./useEvents";
import { toDateString } from "@/lib/calendarUtils";
import { useElementWidth } from "@/hooks/useElementWidth";

/**
 * Below this width, the sidebar has no room to sit beside the grid —
 * it becomes a slide-over drawer instead. This is measured against the
 * app's own rendered width (via ResizeObserver), not the browser
 * viewport, since this component lives inside a resizable OS window.
 */
const NARROW_BREAKPOINT = 560;

export function CalendarApp() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState(toDateString(today));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { ref, width } = useElementWidth<HTMLDivElement>();
  const isNarrow = width > 0 && width < NARROW_BREAKPOINT;

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

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    if (isNarrow) setIsDrawerOpen(true);
  };

  const sidebar = (
    <EventSidebar
      events={events}
      selectedDate={selectedDate}
      onAdd={(input) => createEvent.mutate(input)}
      onDelete={(id) => deleteEvent.mutate(id)}
      isPending={createEvent.isPending}
      isLoading={isLoading}
      isError={isError}
    />
  );

  return (
    <div ref={ref} className="relative flex h-full">
      <div className="relative flex-1 overflow-hidden">
        <MonthGrid
          year={year}
          month={month}
          events={events}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />

        {isNarrow && (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open events panel"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]"
          >
            <CalendarClock className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isNarrow && sidebar}

      {isNarrow && (
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div
                className="absolute inset-0 z-10 bg-black/40"
                onClick={() => setIsDrawerOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute right-0 top-0 z-20 h-full"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 32 }}
              >
                <div className="relative h-full bg-[var(--bg-panel)]">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Close events panel"
                    className="absolute -left-8 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--bg-panel)] text-[var(--text-3)] hover:text-[var(--text-1)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {sidebar}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
