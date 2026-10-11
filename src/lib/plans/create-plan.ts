import { supabase } from "@/src/lib/supabase";
import { CouplePlan } from "@/src/types";
import { CreatePlanInput, PlanOperationResult } from "./types";

export async function createPlan(
  input: CreatePlanInput,
): Promise<PlanOperationResult<CouplePlan>> {
  try {
    const { data, error } = await supabase
      .from("couple_plans")
      .insert({
        couple_key: input.coupleKey,
        created_by: input.userId,
        title: input.title.trim().slice(0, 60),
        kind: input.kind,
        starts_at: input.startsAt,
        all_day: Boolean(input.allDay),
        note: input.note ? input.note.trim().slice(0, 200) : null,
      })
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
