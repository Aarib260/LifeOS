"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MilestoneItem } from "./MilestoneItem";
import type { Goal } from "@/types/goal";

interface GoalCardProps {
  goal: Goal;
  onAddMilestone: (title: string) => void;
  onToggleMilestone: (milestoneId: string, isComplete: boolean) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onDeleteGoal: () => void;
}

export function GoalCard({
  goal,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onDeleteGoal,
}: GoalCardProps) {
  const [newMilestone, setNewMilestone] = useState("");

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMilestone.trim();
    if (!trimmed) return;
    onAddMilestone(trimmed);
    setNewMilestone("");
  };

  return (
    <div className="group flex flex-col gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-sm",
              goal.isComplete ? "text-white/40 line-through" : "text-white/85"
            )}
          >
            {goal.title}
          </span>
          {goal.targetDate && (
            <span className="text-[11px] text-white/35">
              Due {new Date(goal.targetDate).toLocaleDateString([], { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs text-white/50">{goal.progress}%</span>
        <button
          type="button"
          onClick={onDeleteGoal}
          aria-label="Delete goal"
          className="shrink-0 rounded-md p-1 text-white/0 transition-colors group-hover:text-white/40 hover:!text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-cyan-400/70 transition-all"
          style={{ width: `${goal.progress}%` }}
        />
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="border-t border-white/[0.05] pt-1.5">
          {goal.milestones.map((m) => (
            <MilestoneItem
              key={m.id}
              milestone={m}
              onToggle={() => onToggleMilestone(m.id, !m.isComplete)}
              onDelete={() => onDeleteMilestone(m.id)}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleAddMilestone} className="flex items-center gap-1.5">
        <input
          type="text"
          value={newMilestone}
          onChange={(e) => setNewMilestone(e.target.value)}
          placeholder="Add a milestone..."
          className="flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-xs text-white/80 outline-none placeholder:text-white/25 focus:border-cyan-400/30"
        />
        <button
          type="submit"
          disabled={!newMilestone.trim()}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors",
            newMilestone.trim() ? "text-cyan-300 hover:bg-white/[0.06]" : "text-white/15"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}