"use client";

import { useHabits } from "./useHabits";
import { HabitComposer } from "./HabitComposer";
import { HabitList } from "./HabitList";

export function HabitsApp() {
  const { habits, isLoading, isError, createHabit, toggleToday, deleteHabit } = useHabits();

  return (
    <div className="flex h-full flex-col">
      <HabitComposer
        onAdd={(input) => createHabit.mutate(input)}
        isPending={createHabit.isPending}
      />
      <HabitList
        habits={habits}
        isLoading={isLoading}
        isError={isError}
        onToggleToday={(habit) => toggleToday.mutate(habit)}
        onDelete={(id) => deleteHabit.mutate(id)}
      />
    </div>
  );
}
