/**
 * Computes the current streak for a habit: consecutive *scheduled* days
 * completed, walking backward from today.
 *
 * Two rules that make this "full" rather than naive calendar-day counting:
 * 1. Days NOT in targetDays are skipped entirely — they neither extend
 *    nor break the streak. A weekday-only habit isn't penalized for
 *    weekends.
 * 2. Today gets a grace period: if today is a scheduled day but hasn't
 *    been logged yet, that alone doesn't break the streak — the day
 *    isn't over. Any *other* unlogged scheduled day (yesterday or
 *    earlier) does break it.
 */
export function calculateStreak(
  targetDays: number[],
  loggedDates: Set<string> | string[],
  today: Date = new Date()
): number {
  const loggedSet = loggedDates instanceof Set ? loggedDates : new Set(loggedDates);
  const targetSet = new Set(targetDays);

  const todayNormalized = new Date(today);
  todayNormalized.setHours(0, 0, 0, 0);
  const todayStr = toDateString(todayNormalized);

  let streak = 0;
  const cursor = new Date(todayNormalized);

  // Safety cap so malformed data can't spin this into an infinite loop.
  for (let i = 0; i < 3650; i++) {
    const dayOfWeek = cursor.getDay();
    const dateStr = toDateString(cursor);

    if (!targetSet.has(dayOfWeek)) {
      // Not a scheduled day — irrelevant to the streak, skip it.
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (loggedSet.has(dateStr)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    // Unlogged scheduled day. Grace period applies only to today specifically —
    // any earlier unlogged scheduled day means the streak actually ended there.
    if (dateStr === todayStr) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    break;
  }

  return streak;
}

export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}