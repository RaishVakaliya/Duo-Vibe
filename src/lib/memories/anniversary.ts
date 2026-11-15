import { supabase } from "@/src/lib/supabase";
import { getCache, setCache, invalidateCache, TTL } from "@/src/lib/cache";

const ANNIVERSARY_CACHE_KEY = (userId: string) =>
  `couple_anniversary:${userId}`;

export async function getAnniversaryDate(
  userId: string,
): Promise<string | null> {
  const cacheKey = ANNIVERSARY_CACHE_KEY(userId);

  // Cache hit: anniversary date changes extremely rarely, 15-min TTL
  const cached = await getCache<string | null>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const { data, error } = await supabase
    .from("couples")
    .select("anniversary_date")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "connected")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  // Cache even null so we don't re-query on every mount if no date is set yet
  await setCache(cacheKey, data.anniversary_date ?? null, TTL.COUPLE);
  return data.anniversary_date;
}

export async function setAnniversaryDate(
  userId: string,
  anniversaryDate: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("couples")
    .update({ anniversary_date: anniversaryDate })
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "connected")
    .select("user1_id, user2_id")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update anniversary date: ${error.message}`);
  }

  await invalidateCache(ANNIVERSARY_CACHE_KEY(userId));
  if (data?.user1_id) {
    await invalidateCache(ANNIVERSARY_CACHE_KEY(data.user1_id));
  }
  if (data?.user2_id) {
    await invalidateCache(ANNIVERSARY_CACHE_KEY(data.user2_id));
  }
}

export async function invalidateAnniversaryCache(
  userId: string,
): Promise<void> {
  await invalidateCache(ANNIVERSARY_CACHE_KEY(userId));
}

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
