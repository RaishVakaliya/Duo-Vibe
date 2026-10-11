import { supabase } from "@/src/lib/supabase";
import { SaveNoteResult } from "./types";

export async function clearPartnerNote(fieldKey: string): Promise<SaveNoteResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("partner_notes")
      .delete()
      .eq("owner_id", user.id)
      .eq("field_key", fieldKey);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
