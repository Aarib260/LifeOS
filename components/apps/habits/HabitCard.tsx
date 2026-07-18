"use client";

import { Flame, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toDateString } from "@/lib/streak";
import type { Habit } from "@/types/habit";

interface HabitCardProps {
  habit: Habit;
  onToggleToday: () => void;
  onDelete: () => void;
}

/** Last 7 calendar days, oldest first, for the weekly dot row. */
function getLastSevenDays(): Date[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export function HabitCard({ habit, onToggleToday, onDelete }: HabitCardProps) {
  const loggedSet = new Set(habit.loggedDates);
  const targetSet = new Set(habit.targetDays);
  const days = getLastSevenDays();

  return (
    <div className="group flex flex-col gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: habit.color }}
        />
        <span className="min-w-0 flex-1 truncate text-sm text-white/85">{habit.name}</span>

        <div className="flex items-center gap-1 text-xs text-white/50">
          <Flame className={cn("h-3.5 w-3.5", habit.currentStreak > 0 && "text-amber-400")} />
          {habit.currentStreak}
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete habit"
          className="rounded-md p-1 text-white/0 transition-colors group-hover:text-white/40 hover:!text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {days.map((day) => {
            const dateStr = toDateString(day);
            const isScheduled = targetSet.has(day.getDay());
            const isLogged = loggedSet.has(dateStr);

            return (
              <span
                key={dateStr}
                title={dateStr}
                className={cn(
                  "h-2 w-2 rounded-full",
                  !isScheduled && "bg-white/[0.06]",
                  isScheduled && isLogged && "",
                  isScheduled && !isLogged && "border border-white/20"
                )}
                style={isScheduled && isLogged ? { backgroundColor: habit.color } : undefined}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={onToggleToday}
          className={cn(
            "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
            habit.completedToday
              ? "bg-cyan-400/20 text-cyan-200"
              : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"
          )}
        >
          {habit.completedToday ? "Done today" : "Check in"}
        </button>
      </div>
    </div>
  );
}