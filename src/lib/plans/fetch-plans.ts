import { supabase } from "@/src/lib/supabase";
import { CouplePlan } from "@/src/types";
import { PlanOperationResult } from "./types";
import { getCache, setCache, invalidateCache, TTL } from "@/src/lib/cache";

const PLANS_CACHE_KEY = (coupleKey: string) => `couple_plans:${coupleKey}`;

export async function fetchPlans(
  coupleKey: string,
): Promise<PlanOperationResult<CouplePlan[]>> {
  try {
    const cacheKey = PLANS_CACHE_KEY(coupleKey);

    // Cache hit: plans rarely change mid-session, 3-min TTL
    const cached = await getCache<CouplePlan[]>(cacheKey);
    if (cached !== null) {
      return { data: cached, error: null };
    }

    const { data, error } = await supabase
      .from("couple_plans")
      .select("*")
      .eq("couple_key", coupleKey)
      .order("starts_at", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    const plans = (data as CouplePlan[]) || [];
    await setCache(cacheKey, plans, TTL.COUPLE_PLANS);
    return { data: plans, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: message };
  }
}

export function invalidatePlansCache(coupleKey: string): Promise<void> {
  return invalidateCache(PLANS_CACHE_KEY(coupleKey));
}
