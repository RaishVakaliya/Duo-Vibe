import { supabase } from "@/src/lib/supabase";
import { ChatMessage } from "@/src/types";
import { sendExpoPushNotification } from "@/src/lib/notifications";

/**
 * Insert a new chat message. Returns the persisted row so the caller can
 * reconcile any optimistic-UI entry with the real DB id/timestamp.
 * Also triggers a native push notification to the partner if they have a push_token.
 */
export async function sendMessage(
  coupleKey: string,
  senderId: string,
  content: string,
  senderName?: string,
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ couple_key: coupleKey, sender_id: senderId, content })
    .select("id, couple_key, sender_id, content, created_at, read_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to send message.");
  }

  // Trigger push notification to partner in the background (fire & forget)
  const partnerId = coupleKey.split("_").find((id) => id !== senderId);
  if (partnerId) {
    (async () => {
      try {
        const { data: pProfile } = await supabase
          .from("profiles")
          .select("push_token")
          .eq("id", partnerId)
          .maybeSingle();

        if (pProfile?.push_token) {
          await sendExpoPushNotification({
            to: pProfile.push_token,
            title: senderName || "New Message 💕",
            body: content,
            data: { route: "/chat", coupleKey },
          });
        }
      } catch (err) {
        console.warn("[chat] push notification delivery error:", err);
      }
    })();
  }

  return {
    id: data.id,
    couple_key: data.couple_key,
    sender_id: data.sender_id,
    content: data.content,
    created_at: data.created_at,
    read_at: data.read_at,
    status: "sent" as const,
  };
}
