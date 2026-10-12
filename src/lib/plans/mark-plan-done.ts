import { supabase } from "@/src/lib/supabase";
import { getErrorMessage } from "@/src/utils/error-message";
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
      return { data: null, error: getErrorMessage(error) };
    }

    return { data: data as CouplePlan, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}
