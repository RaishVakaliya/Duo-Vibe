export interface PartnerNoteRecord {
  owner_id: string;
  field_key: string;
  value: unknown;
  updated_at: string;
}

export type PartnerNotesMap = Record<string, unknown>;

export interface SaveNoteResult {
  success: boolean;
  error?: string;
}
