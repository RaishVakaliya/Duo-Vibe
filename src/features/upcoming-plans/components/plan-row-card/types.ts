import { PlanItem } from "../../types";

export interface PlanRowCardProps {
  plan: PlanItem;
  currentUserId?: string;
  onToggleDone: (planId: string, currentDone: boolean) => void;
  onDelete?: (planId: string) => void;
  onSaveToMemories?: (plan: PlanItem) => void;
}
