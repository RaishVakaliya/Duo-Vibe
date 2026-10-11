import { supabase } from "@/src/lib/supabase";
import { PlanOperationResult } from "./types";

export async function deletePlan(
  planId: string,
): Promise<PlanOperationResult<boolean>> {
  try {
    const { error } = await supabase
      .from("couple_plans")
      .delete()
      .eq("id", planId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: message };
  }
}
