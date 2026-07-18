"use client";

import { useGoals } from "./useGoals";
import { GoalComposer } from "./GoalComposer";
import { GoalList } from "./GoalList";

export function GoalsApp() {
  const {
    goals,
    isLoading,
    isError,
    createGoal,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
  } = useGoals();

  return (
    <div className="flex h-full flex-col">
      <GoalComposer onAdd={(input) => createGoal.mutate(input)} isPending={createGoal.isPending} />
      <GoalList
        goals={goals}
        isLoading={isLoading}
        isError={isError}
        onAddMilestone={(goalId, title) => addMilestone.mutate({ goalId, title })}
        onToggleMilestone={(goalId, milestoneId, isComplete) =>
          toggleMilestone.mutate({ goalId, milestoneId, isComplete })
        }
        onDeleteMilestone={(goalId, milestoneId) => deleteMilestone.mutate({ goalId, milestoneId })}
        onDeleteGoal={(goalId) => deleteGoal.mutate(goalId)}
      />
    </div>
  );
}
