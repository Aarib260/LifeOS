"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  0: "bg-transparent",
  1: "bg-cyan-400/70",
  2: "bg-amber-400/70",
  3: "bg-red-400/70",
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 hover:bg-[var(--surface-1)]">
      <button
        type="button"
        onClick={onToggle}
        aria-label={task.isComplete ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          task.isComplete ? "border-cyan-400/60 bg-cyan-400/60" : "border-[var(--border-3)] hover:border-cyan-400/50"
        )}
      />

      {task.priority > 0 && (
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", PRIORITY_COLOR[task.priority])} />
      )}

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          task.isComplete ? "text-[var(--text-4)] line-through" : "text-[var(--text-2)]"
        )}
      >
        {task.title}
      </span>

      {task.dueDate && (
        <span className="shrink-0 text-[11px] text-[var(--text-4)]">
          {new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })}
        </span>
      )}

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
        className="shrink-0 rounded-md p-1 text-white/0 transition-colors group-hover:text-[var(--text-4)] hover:!text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
