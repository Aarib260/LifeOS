"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";

const TASKS_KEY = ["tasks"] as const;

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to load tasks");
  return res.json();
}

async function createTaskRequest(input: CreateTaskInput): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

async function updateTaskRequest(id: string, input: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

async function deleteTaskRequest(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}

export function useTasks() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: TASKS_KEY, queryFn: fetchTasks });

  const createTask = useMutation({
    mutationFn: createTaskRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });

  // Optimistic update for the highest-frequency interaction (checking a box) —
  // waiting on a round trip for something this small feels sluggish.
  const toggleComplete = useMutation({
    mutationFn: (task: Task) => updateTaskRequest(task.id, { isComplete: !task.isComplete }),
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);
      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) =>
        old?.map((t) => (t.id === task.id ? { ...t, isComplete: !t.isComplete } : t))
      );
      return { previous };
    },
    onError: (_err, _task, context) => {
      if (context?.previous) queryClient.setQueryData(TASKS_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTaskRequest(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });

  const deleteTask = useMutation({
    mutationFn: deleteTaskRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    createTask,
    toggleComplete,
    updateTask,
    deleteTask,
  };
}