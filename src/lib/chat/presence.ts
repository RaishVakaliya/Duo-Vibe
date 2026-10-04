import { supabase } from "@/src/lib/supabase";

export interface PresencePayload {
  user_id: string;
  online_at: string;
}

export function subscribeToPartnerPresence(
  coupleKey: string,
  userId: string,
  partnerId: string,
  onStatusChange: (isOnline: boolean, lastSeen?: string) => void,
): () => void {
  const channelName = `chat_presence_${coupleKey}`;
  const channel = supabase.channel(channelName, {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  channel
    .on("presence", { event: "sync" }, () => {
      try {
        const state = channel.presenceState();
        const partnerPresences = state[partnerId];
        const isOnline = Boolean(partnerPresences && partnerPresences.length > 0);
        onStatusChange(isOnline);
      } catch (err) {
        console.warn("[presence sync error]:", err);
      }
    })
    .on("presence", { event: "join" }, ({ key }) => {
      if (key === partnerId) {
        onStatusChange(true);
      }
    })
    .on("presence", { event: "leave" }, ({ key }) => {
      if (key === partnerId) {
        onStatusChange(false, new Date().toISOString());
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        try {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        } catch (err) {
          console.warn("[presence track error]:", err);
        }
      }
    });

  return () => {
    channel.untrack().catch(() => { });
    supabase.removeChannel(channel).catch(() => { });
  };
}
