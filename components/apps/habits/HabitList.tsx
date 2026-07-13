"use client";

import { HabitCard } from "./HabitCard";
import type { Habit } from "@/types/habit";

interface HabitListProps {
  habits: Habit[];
  isLoading: boolean;
  isError: boolean;
  onToggleToday: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function HabitList({ habits, isLoading, isError, onToggleToday, onDelete }: HabitListProps) {
  if (isLoading) {
    return <p className="p-6 text-center text-xs text-white/30">Loading habits...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-center text-xs text-red-300/70">
        Couldn&apos;t load habits. Check your database connection.
      </p>
    );
  }

  if (habits.length === 0) {
    return <p className="p-6 text-center text-xs text-white/30">No habits yet — add one above.</p>;
  }

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggleToday={() => onToggleToday(habit)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </div>
  );
}