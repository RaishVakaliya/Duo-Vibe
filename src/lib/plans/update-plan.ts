import { supabase } from "@/src/lib/supabase";
import { getErrorMessage } from "@/src/utils/error-message";
import { CouplePlan } from "@/src/types";
import { Database } from "@/src/types/database";
import { PlanOperationResult, UpdatePlanInput } from "./types";

type CouplePlanUpdate = Database["public"]["Tables"]["couple_plans"]["Update"];

export async function updatePlan(
  planId: string,
  updates: UpdatePlanInput,
): Promise<PlanOperationResult<CouplePlan>> {
  try {
    const payload: CouplePlanUpdate = {};
    if (updates.title !== undefined) payload.title = updates.title.trim().slice(0, 60);
    if (updates.kind !== undefined) payload.kind = updates.kind;
    if (updates.startsAt !== undefined) payload.starts_at = updates.startsAt;
    if (updates.allDay !== undefined) payload.all_day = updates.allDay;
    if (updates.note !== undefined) {
      payload.note = updates.note ? updates.note.trim().slice(0, 200) : null;
    }

    const { data, error } = await supabase
      .from("couple_plans")
      .update(payload)
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
