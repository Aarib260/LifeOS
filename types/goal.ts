export interface Milestone {
  id: string;
  title: string;
  isComplete: boolean;
  position: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null; // ISO date string
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  /** 0-100, derived from completed / total milestones. 0 if no milestones yet. */
  progress: number;
  /** True only if there's at least one milestone and all are complete. */
  isComplete: boolean;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  targetDate?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string | null;
  targetDate?: string | null;
}

export interface CreateMilestoneInput {
  title: string;
}
