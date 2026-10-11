import { supabase } from "@/src/lib/supabase";
import { CouplePlan } from "@/src/types";
import { PlanOperationResult } from "./types";

export async function fetchPlans(
  coupleKey: string,
): Promise<PlanOperationResult<CouplePlan[]>> {
  try {
    const { data, error } = await supabase
      .from("couple_plans")
      .select("*")
      .eq("couple_key", coupleKey)
      .order("starts_at", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as CouplePlan[]) || [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: message };
  }
}
