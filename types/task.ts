export type TaskPriority = 0 | 1 | 2 | 3; // none, low, medium, high

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  isComplete: boolean;
  priority: TaskPriority;
  dueDate: string | null; // ISO string
  createdAt: string;
  updatedAt: string;
}

/** Shape sent to POST /api/tasks */
export interface CreateTaskInput {
  title: string;
  notes?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

/** Shape sent to PATCH /api/tasks/[id] — all fields optional */
export interface UpdateTaskInput {
  title?: string;
  notes?: string | null;
  isComplete?: boolean;
  priority?: TaskPriority;
  dueDate?: string | null;
}