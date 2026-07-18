import { calculateStreak, toDateString } from "./streak";
import type { Habit } from "@/types/habit";

interface HabitRow {
  id: string;
  name: string;
  color: string;
  target_days: number[];
  created_at: string;
}

export function mapRowToHabit(row: HabitRow, loggedDates: string[]): Habit {
  const loggedSet = new Set(loggedDates);
  const todayStr = toDateString(new Date());

  return {
    id: row.id,
    name: row.name,
    color: row.color,
    targetDays: row.target_days,
    createdAt: row.created_at,
    loggedDates,
    currentStreak: calculateStreak(row.target_days, loggedSet),
    completedToday: loggedSet.has(todayStr),
  };
}
