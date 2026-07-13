export interface Habit {
  id: string;
  name: string;
  color: string;
  /** Days of week this habit is scheduled for: 0=Sun .. 6=Sat */
  targetDays: number[];
  createdAt: string;
  /** ISO date strings (YYYY-MM-DD) this habit has been completed on */
  loggedDates: string[];
  /** Computed from loggedDates + targetDays — see lib/streak.ts */
  currentStreak: number;
  completedToday: boolean;
}

export interface CreateHabitInput {
  name: string;
  color?: string;
  targetDays?: number[];
}

export interface UpdateHabitInput {
  name?: string;
  color?: string;
  targetDays?: number[];
}