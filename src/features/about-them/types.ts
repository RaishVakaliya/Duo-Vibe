import { PartnerNoteFieldDef } from "@/src/data/partnerNoteFields";

export interface AboutThemFieldRowProps {
  field: PartnerNoteFieldDef;
  value: unknown;
  onPress: () => void;
}

export interface AboutThemState {
  notes: Record<string, unknown>;
  loading: boolean;
  savingKey: string | null;
  savedKey: string | null;
  error: string | null;
  activeField: PartnerNoteFieldDef | null;
}
