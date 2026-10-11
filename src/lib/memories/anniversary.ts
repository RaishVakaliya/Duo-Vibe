import { supabase } from "@/src/lib/supabase";

export async function getAnniversaryDate(
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("couples")
    .select("anniversary_date")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "connected")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.anniversary_date;
}

export async function setAnniversaryDate(
  userId: string,
  anniversaryDate: string, // YYYY-MM-DD
): Promise<void> {
  const { error } = await supabase
    .from("couples")
    .update({ anniversary_date: anniversaryDate })
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "connected");

  if (error) {
    throw new Error(`Failed to update anniversary date: ${error.message}`);
  }
}

/**
 * Compute the number of days together from an anniversary date (YYYY-MM-DD).
 * Day 1 is the anniversary date itself.
 */
export function computeDaysTogether(anniversaryDate: string): number {
  if (!anniversaryDate) return 0;
  try {
    const parts = anniversaryDate.split("-").map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    if (year === undefined || month === undefined || day === undefined) {
      return 0;
    }
    const start = new Date(year, month - 1, day);
    const now = new Date();
    // Normalize both to start of day
    const startMidnight = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    ).getTime();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    const diffMs = todayMidnight - startMidnight;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  } catch {
    return 1;
  }
}
