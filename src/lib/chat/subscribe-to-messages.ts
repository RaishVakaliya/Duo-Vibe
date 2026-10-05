import { supabase } from "@/src/lib/supabase";
import { ChatMessage } from "@/src/types";
import { Database } from "@/src/types/database";

type ChatMessageRow = Database["public"]["Tables"]["chat_messages"]["Row"];

function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    couple_key: row.couple_key,
    sender_id: row.sender_id,
    content: row.content,
    created_at: row.created_at,
    read_at: row.read_at,
    status: "sent" as const,
  };
}

/**
 * Subscribe to new INSERT events on chat_messages filtered by couple_key.
 * Calls onNewMessage whenever a partner (or the current user from another device)
 * inserts a message. Fails silently on channel errors — the screen still works
 * via optimistic updates + manual fetch.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToNewMessages(
  coupleKey: string,
  onNewMessage: (message: ChatMessage) => void,
): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  try {
    channel = supabase
      .channel(`chat_messages_${coupleKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `couple_key=eq.${coupleKey}`,
        },
        (payload) => {
          if (payload.new) {
            try {
              onNewMessage(rowToMessage(payload.new as ChatMessageRow));
            } catch (e) {
              console.warn("[chat realtime] failed to parse payload:", e);
            }
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[chat realtime] subscription error for couple_key:", coupleKey);
        }
      });
  } catch (e) {
    console.warn("[chat realtime] failed to subscribe:", e);
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel).catch(() => { });
    }
  };
}

/**
 * Subscribe to INSERT and UPDATE events for unread count badge.
 * Fires callback on both new incoming messages (INSERT) and read status changes (UPDATE).
 * Returns an unsubscribe function.
 */
export function subscribeToUnreadBadge(
  coupleKey: string,
  onNewMessage: () => void,
): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  try {
    channel = supabase
      .channel(`chat_badge_${coupleKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `couple_key=eq.${coupleKey}`,
        },
        () => {
          try {
            onNewMessage();
          } catch (e) {
            console.warn("[chat badge realtime] callback error:", e);
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[chat badge realtime] error for couple_key:", coupleKey);
        }
      });
  } catch (e) {
    console.warn("[chat badge realtime] failed to subscribe:", e);
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel).catch(() => { });
    }
  };
}
