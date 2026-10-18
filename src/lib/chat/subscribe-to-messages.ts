import { supabase } from "@/src/lib/supabase";
import { createRealtimeChannel } from "@/src/lib/realtime/create-realtime-channel";
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

export function broadcastMessagesRead(
  coupleKey: string,
  readerId: string,
): void {
  const channel = supabase.channel(`chat_messages_${coupleKey}`);
  channel
    .send({
      type: "broadcast",
      event: "messages_read",
      payload: { readerId, readAt: new Date().toISOString() },
    })
    .catch(() => {});
}

export function subscribeToNewMessages(
  coupleKey: string,
  onNewMessage: (message: ChatMessage) => void,
  onMessageUpdated?: (message: ChatMessage) => void,
  onMessagesRead?: (readerId: string, readAt: string) => void,
): () => void {
  const channelName = `chat_messages_${coupleKey}`;
  const channel = supabase.channel(channelName);

  channel
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `couple_key=eq.${coupleKey}`,
      },
      (payload) => {
        if (payload.new) {
          try {
            onNewMessage(rowToMessage(payload.new as ChatMessageRow));
          } catch (e) {
            console.warn("[chat realtime] failed to parse insert payload:", e);
          }
        }
      },
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "chat_messages",
        filter: `couple_key=eq.${coupleKey}`,
      },
      (payload) => {
        if (payload.new) {
          try {
            onMessageUpdated?.(rowToMessage(payload.new as ChatMessageRow));
          } catch (e) {
            console.warn("[chat realtime] failed to parse update payload:", e);
          }
        }
      },
    )
    .on(
      "broadcast",
      { event: "messages_read" },
      (msg: { payload?: { readerId?: string; readAt?: string } }) => {
        if (msg.payload?.readerId && msg.payload?.readAt) {
          onMessagesRead?.(msg.payload.readerId, msg.payload.readAt);
        }
      },
    )
    .subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        console.warn(`[chat realtime] Channel subscription error for ${channelName}`);
      }
    });

  return () => {
    supabase.removeChannel(channel).catch(() => {});
  };
}

export function subscribeToUnreadBadge(
  coupleKey: string,
  onNewMessage: () => void,
): () => void {
  return createRealtimeChannel({
    channelName: `chat_badge_${coupleKey}`,
    changes: {
      event: "*",
      table: "chat_messages",
      filter: `couple_key=eq.${coupleKey}`,
      callback: () => {
        try {
          onNewMessage();
        } catch (e) {
          console.warn("[chat badge realtime] callback error:", e);
        }
      },
    },
  });
}
