"use client";

import { useTasks } from "./useTasks";
import { TaskComposer } from "./TaskComposer";
import { TaskList } from "./TaskList";

export function TasksApp() {
  const { tasks, isLoading, isError, createTask, toggleComplete, deleteTask } = useTasks();

  return (
    <div className="flex h-full flex-col">
      <TaskComposer
        onAdd={(title) => createTask.mutate({ title })}
        isPending={createTask.isPending}
      />
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        isError={isError}
        onToggle={(task) => toggleComplete.mutate(task)}
        onDelete={(id) => deleteTask.mutate(id)}
      />
    </div>
  );
}
