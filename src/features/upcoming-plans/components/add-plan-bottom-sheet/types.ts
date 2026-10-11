import { PlanKind } from "@/src/types";

export interface AddPlanFormData {
  title: string;
  kind: PlanKind;
  date: Date;
  allDay: boolean;
  note: string;
}

export interface AddPlanBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AddPlanFormData) => void;
}
