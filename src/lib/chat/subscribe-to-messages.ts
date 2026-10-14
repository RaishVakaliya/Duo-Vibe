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

export function subscribeToNewMessages(
  coupleKey: string,
  onNewMessage: (message: ChatMessage) => void,
): () => void {
  return createRealtimeChannel({
    channelName: `chat_messages_${coupleKey}`,
    changes: {
      event: "INSERT",
      table: "chat_messages",
      filter: `couple_key=eq.${coupleKey}`,
      callback: (payload) => {
        if (payload.new) {
          try {
            onNewMessage(rowToMessage(payload.new as ChatMessageRow));
          } catch (e) {
            console.warn("[chat realtime] failed to parse payload:", e);
          }
        }
      },
    },
  });
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
