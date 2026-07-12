import type { Task } from "@/types/task";

/** Raw shape returned by the `tasks` table (snake_case, as Postgres returns it) */
interface TaskRow {
  id: string;
  title: string;
  notes: string | null;
  is_complete: boolean;
  priority: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    isComplete: row.is_complete,
    priority: row.priority as Task["priority"],
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}