import { CouplePlan } from "@/src/types";

export interface PlanItem extends CouplePlan {
  is_local_only?: boolean;
}

export type PlanTimeGroup = "today" | "this_week" | "later" | "done";

export interface GroupedPlans {
  nextPlan: PlanItem | null;
  today: PlanItem[];
  thisWeek: PlanItem[];
  later: PlanItem[];
  done: PlanItem[];
}
