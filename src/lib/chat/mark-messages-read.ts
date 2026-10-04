import { supabase } from "@/src/lib/supabase";

/**
 * Mark all unread messages in this couple_key that were NOT sent by the reader
 * as read (sets read_at = now()).
 * Safe to call on every focus — only updates rows where read_at IS NULL.
 */
export async function markMessagesRead(
  coupleKey: string,
  readerId: string,
): Promise<void> {
  const { error } = await supabase
    .from("chat_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("couple_key", coupleKey)
    .neq("sender_id", readerId)
    .is("read_at", null);

  if (error) {
    console.warn("[chat] markMessagesRead error:", error.message);
  }
}

/**
 * Returns the count of unread messages sent by the partner (not the current user).
 * Used for the unread badge on the tab bar.
 */
export async function getUnreadCount(
  coupleKey: string,
  readerId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("couple_key", coupleKey)
    .neq("sender_id", readerId)
    .is("read_at", null);

  if (error) {
    console.warn("[chat] getUnreadCount error:", error.message);
    return 0;
  }

  return count ?? 0;
}
