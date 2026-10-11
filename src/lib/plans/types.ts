import { CouplePlan, PlanKind } from "@/src/types";

export interface CreatePlanInput {
  coupleKey: string;
  userId: string;
  title: string;
  kind: PlanKind;
  startsAt: string;
  allDay?: boolean;
  note?: string;
}

export interface UpdatePlanInput {
  title?: string;
  kind?: PlanKind;
  startsAt?: string;
  allDay?: boolean;
  note?: string | null;
}

export interface PlanOperationResult<T = CouplePlan> {
  data: T | null;
  error: string | null;
}
