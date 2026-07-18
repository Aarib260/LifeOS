"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateGoalInput, Goal } from "@/types/goal";

const GOALS_KEY = ["goals"] as const;

async function fetchGoals(): Promise<Goal[]> {
  const res = await fetch("/api/goals");
  if (!res.ok) throw new Error("Failed to load goals");
  return res.json();
}

async function createGoalRequest(input: CreateGoalInput): Promise<Goal> {
  const res = await fetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  return res.json();
}

async function deleteGoalRequest(id: string): Promise<void> {
  const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete goal");
}

async function addMilestoneRequest(goalId: string, title: string): Promise<Goal> {
  const res = await fetch(`/api/goals/${goalId}/milestones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to add milestone");
  return res.json();
}

async function toggleMilestoneRequest(
  goalId: string,
  milestoneId: string,
  isComplete: boolean
): Promise<Goal> {
  const res = await fetch(`/api/goals/${goalId}/milestones/${milestoneId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isComplete }),
  });
  if (!res.ok) throw new Error("Failed to update milestone");
  return res.json();
}

async function deleteMilestoneRequest(goalId: string, milestoneId: string): Promise<Goal> {
  const res = await fetch(`/api/goals/${goalId}/milestones/${milestoneId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete milestone");
  return res.json();
}

export function useGoals() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: GOALS_KEY, queryFn: fetchGoals });

  const createGoal = useMutation({
    mutationFn: createGoalRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });

  const deleteGoal = useMutation({
    mutationFn: deleteGoalRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });

  const addMilestone = useMutation({
    mutationFn: ({ goalId, title }: { goalId: string; title: string }) =>
      addMilestoneRequest(goalId, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });

  // Optimistic — checking off a milestone is the most frequent interaction,
  // recompute progress client-side so it doesn't wait on a round trip.
  const toggleMilestone = useMutation({
    mutationFn: ({
      goalId,
      milestoneId,
      isComplete,
    }: {
      goalId: string;
      milestoneId: string;
      isComplete: boolean;
    }) => toggleMilestoneRequest(goalId, milestoneId, isComplete),
    onMutate: async ({ goalId, milestoneId, isComplete }) => {
      await queryClient.cancelQueries({ queryKey: GOALS_KEY });
      const previous = queryClient.getQueryData<Goal[]>(GOALS_KEY);

      queryClient.setQueryData<Goal[]>(GOALS_KEY, (old) =>
        old?.map((goal) => {
          if (goal.id !== goalId) return goal;
          const milestones = goal.milestones.map((m) =>
            m.id === milestoneId ? { ...m, isComplete } : m
          );
          const total = milestones.length;
          const completed = milestones.filter((m) => m.isComplete).length;
          return {
            ...goal,
            milestones,
            progress: total === 0 ? 0 : Math.round((completed / total) * 100),
            isComplete: total > 0 && completed === total,
          };
        })
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(GOALS_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });

  const deleteMilestone = useMutation({
    mutationFn: ({ goalId, milestoneId }: { goalId: string; milestoneId: string }) =>
      deleteMilestoneRequest(goalId, milestoneId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });

  return {
    goals: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    createGoal,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
  };
}
