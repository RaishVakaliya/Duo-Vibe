import { PlanItem } from "../../types";

export interface HeroPlanCardProps {
  plan: PlanItem;
  onMarkDone: (planId: string) => void;
  onDelete?: (planId: string) => void;
  canDelete?: boolean;
}
