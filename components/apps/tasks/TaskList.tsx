"use client";

import { TaskItem } from "./TaskItem";
import type { Task } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, isLoading, isError, onToggle, onDelete }: TaskListProps) {
  if (isLoading) {
    return <p className="p-6 text-center text-xs text-[var(--text-4)]">Loading tasks...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-center text-xs text-red-300/70">
        Couldn&apos;t load tasks. Check your database connection.
      </p>
    );
  }

  if (tasks.length === 0) {
    return <p className="p-6 text-center text-xs text-[var(--text-4)]">No tasks yet — add one above.</p>;
  }

  const incomplete = tasks.filter((t) => !t.isComplete);
  const complete = tasks.filter((t) => t.isComplete);

  return (
    <div className="flex-1 overflow-y-auto">
      {incomplete.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}

      {complete.length > 0 && (
        <>
          <div className="px-3 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-4)]">
            Completed
          </div>
          {complete.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggle(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}
