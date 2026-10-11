import { supabase } from "@/src/lib/supabase";
import { PartnerNotesMap, PartnerNoteRecord } from "./types";

export async function fetchPartnerNotes(): Promise<{
  data: PartnerNotesMap;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: {}, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("partner_notes")
      .select("owner_id, field_key, value, updated_at")
      .eq("owner_id", user.id);

    if (error) {
      return { data: {}, error: error.message };
    }

    const notesMap: PartnerNotesMap = {};
    if (data) {
      (data as unknown as PartnerNoteRecord[]).forEach((row) => {
        notesMap[row.field_key] = row.value;
      });
    }

    return { data: notesMap, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: {}, error: message };
  }
}
