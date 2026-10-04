import { supabase } from "@/src/lib/supabase";
import { ChatMessage } from "@/src/types";

/**
 * Fetch the most recent `limit` messages for this couple.
 * Optionally pass a `before` ISO timestamp for cursor-based pagination
 * (load older messages when scrolling up in an inverted FlatList).
 */
export async function fetchMessages(
  coupleKey: string,
  limit: number = 50,
  before?: string,
): Promise<ChatMessage[]> {
  let query = supabase
    .from("chat_messages")
    .select("id, couple_key, sender_id, content, created_at, read_at")
    .eq("couple_key", coupleKey)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (before) {
    query = query.lt("created_at", before);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    couple_key: row.couple_key,
    sender_id: row.sender_id,
    content: row.content,
    created_at: row.created_at,
    read_at: row.read_at,
    status: "sent" as const,
  }));
}
