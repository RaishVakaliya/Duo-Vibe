import { createRealtimeChannel } from "@/src/lib/realtime/create-realtime-channel";

export interface SubscribeToMemoriesParams {
  coupleKey: string;
  onMemoryChange: () => void;
  onReactionChange: () => void;
}

export function subscribeToMemories({
  coupleKey,
  onMemoryChange,
  onReactionChange,
}: SubscribeToMemoriesParams): () => void {
  return createRealtimeChannel({
    channelName: `memories_channel_${coupleKey}_${Date.now()}`,
    changes: [
      {
        event: "*",
        table: "memories",
        filter: `couple_key=eq.${coupleKey}`,
        callback: () => onMemoryChange(),
      },
      {
        event: "*",
        table: "memory_reactions",
        callback: () => onReactionChange(),
      },
    ],
  });
}
