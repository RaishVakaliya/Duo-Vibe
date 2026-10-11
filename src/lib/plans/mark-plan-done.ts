import { supabase } from "@/src/lib/supabase";
import { CouplePlan } from "@/src/types";
import { PlanOperationResult } from "./types";

export async function markPlanDone(
  planId: string,
  done: boolean,
): Promise<PlanOperationResult<CouplePlan>> {
  try {
    const { data, error } = await supabase
      .from("couple_plans")
      .update({
        done_at: done ? new Date().toISOString() : null,
      })
      .eq("id", planId)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as CouplePlan, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: message };
  }
}
