import type { Goal, Milestone } from "@/types/goal";

interface GoalRow {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
  /** Already camelCase — built via json_build_object in the SQL query itself. */
  milestones: Milestone[];
}

export function mapRowToGoal(row: GoalRow): Goal {
  const milestones = row.milestones ?? [];
  const total = milestones.length;
  const completed = milestones.filter((m) => m.isComplete).length;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    targetDate: row.target_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    milestones,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    isComplete: total > 0 && completed === total,
  };
}
