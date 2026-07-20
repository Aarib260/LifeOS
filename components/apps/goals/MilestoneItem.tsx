"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types/goal";

interface MilestoneItemProps {
  milestone: Milestone;
  onToggle: () => void;
  onDelete: () => void;
}

export function MilestoneItem({ milestone, onToggle, onDelete }: MilestoneItemProps) {
  return (
    <div className="group flex items-center gap-2 py-1">
      <button
        type="button"
        onClick={onToggle}
        aria-label={milestone.isComplete ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
          milestone.isComplete
            ? "border-cyan-400/60 bg-cyan-400/60"
            : "border-[var(--border-3)] hover:border-cyan-400/50"
        )}
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-xs",
          milestone.isComplete ? "text-[var(--text-4)] line-through" : "text-[var(--text-2)]"
        )}
      >
        {milestone.title}
      </span>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete milestone"
        className="shrink-0 text-white/0 transition-colors group-hover:text-[var(--text-4)] hover:!text-red-400"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
