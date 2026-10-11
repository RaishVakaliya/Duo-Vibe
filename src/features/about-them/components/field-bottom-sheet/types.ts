import { PartnerNoteFieldDef } from "@/src/data/partnerNoteFields";

export interface FieldBottomSheetProps {
  visible: boolean;
  field: PartnerNoteFieldDef | null;
  currentValue: unknown;
  onClose: () => void;
  onSave: (fieldKey: string, value: unknown) => void;
  onClear: (fieldKey: string) => void;
}
