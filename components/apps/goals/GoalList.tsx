"use client";

import { GoalCard } from "./GoalCard";
import type { Goal } from "@/types/goal";

interface GoalListProps {
  goals: Goal[];
  isLoading: boolean;
  isError: boolean;
  onAddMilestone: (goalId: string, title: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string, isComplete: boolean) => void;
  onDeleteMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export function GoalList({
  goals,
  isLoading,
  isError,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onDeleteGoal,
}: GoalListProps) {
  if (isLoading) {
    return <p className="p-6 text-center text-xs text-[var(--text-4)]">Loading goals...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-center text-xs text-red-300/70">
        Couldn&apos;t load goals. Check your database connection.
      </p>
    );
  }

  if (goals.length === 0) {
    return <p className="p-6 text-center text-xs text-[var(--text-4)]">No goals yet — add one above.</p>;
  }

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-3">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onAddMilestone={(title) => onAddMilestone(goal.id, title)}
          onToggleMilestone={(milestoneId, isComplete) =>
            onToggleMilestone(goal.id, milestoneId, isComplete)
          }
          onDeleteMilestone={(milestoneId) => onDeleteMilestone(goal.id, milestoneId)}
          onDeleteGoal={() => onDeleteGoal(goal.id)}
        />
      ))}
    </div>
  );
}
