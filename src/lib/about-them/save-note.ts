import { supabase } from "@/src/lib/supabase";
import { getErrorMessage } from "@/src/utils/error-message";
import { SaveNoteResult } from "./types";

export async function savePartnerNote(
  fieldKey: string,
  value: unknown,
): Promise<SaveNoteResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase.from("partner_notes").upsert(
      {
        owner_id: user.id,
        field_key: fieldKey,
        value: value as any,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "owner_id,field_key" },
    );

    if (error) {
      return { success: false, error: getErrorMessage(error) };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}
