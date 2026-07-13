"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calculateStreak, toDateString } from "@/lib/streak";
import type { CreateHabitInput, Habit, UpdateHabitInput } from "@/types/habit";

const HABITS_KEY = ["habits"] as const;

async function fetchHabits(): Promise<Habit[]> {
  const res = await fetch("/api/habits");
  if (!res.ok) throw new Error("Failed to load habits");
  return res.json();
}

async function createHabitRequest(input: CreateHabitInput): Promise<Habit> {
  const res = await fetch("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create habit");
  return res.json();
}

async function toggleTodayRequest(id: string): Promise<Habit> {
  const res = await fetch(`/api/habits/${id}/toggle`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to toggle habit");
  return res.json();
}

async function updateHabitRequest(id: string, input: UpdateHabitInput): Promise<Habit> {
  const res = await fetch(`/api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update habit");
  return res.json();
}

async function deleteHabitRequest(id: string): Promise<void> {
  const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete habit");
}

export function useHabits() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: HABITS_KEY, queryFn: fetchHabits });

  const createHabit = useMutation({
    mutationFn: createHabitRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });

  // Optimistic toggle — recomputes streak/completedToday client-side using
  // the same calculateStreak used on the server, so the UI updates instantly
  // instead of waiting on a round trip for the most frequent interaction.
  const toggleToday = useMutation({
    mutationFn: (habit: Habit) => toggleTodayRequest(habit.id),
    onMutate: async (habit) => {
      await queryClient.cancelQueries({ queryKey: HABITS_KEY });
      const previous = queryClient.getQueryData<Habit[]>(HABITS_KEY);

      const todayStr = toDateString(new Date());
      const willComplete = !habit.completedToday;
      const newLoggedDates = willComplete
        ? [...habit.loggedDates, todayStr]
        : habit.loggedDates.filter((d) => d !== todayStr);

      queryClient.setQueryData<Habit[]>(HABITS_KEY, (old) =>
        old?.map((h) =>
          h.id === habit.id
            ? {
                ...h,
                loggedDates: newLoggedDates,
                completedToday: willComplete,
                currentStreak: calculateStreak(h.targetDays, newLoggedDates),
              }
            : h
        )
      );

      return { previous };
    },
    onError: (_err, _habit, context) => {
      if (context?.previous) queryClient.setQueryData(HABITS_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });

  const updateHabit = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateHabitInput }) =>
      updateHabitRequest(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });

  const deleteHabit = useMutation({
    mutationFn: deleteHabitRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });

  return {
    habits: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    createHabit,
    toggleToday,
    updateHabit,
    deleteHabit,
  };
}