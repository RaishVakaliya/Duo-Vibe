import {
  createRealtimeChannel,
  PostgresChangeConfig,
} from "@/src/lib/realtime/create-realtime-channel";

export interface SubscribeToMemoriesParams {
  coupleKey: string;
  userId?: string;
  onMemoryChange: () => void;
  onReactionChange: () => void;
  onAnniversaryChange?: (anniversaryDate: string | null) => void;
}

export function subscribeToMemories({
  coupleKey,
  userId,
  onMemoryChange,
  onReactionChange,
  onAnniversaryChange,
}: SubscribeToMemoriesParams): () => void {
  const changes: PostgresChangeConfig[] = [
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
  ];

  if (userId && onAnniversaryChange) {
    changes.push({
      event: "*",
      table: "couples",
      callback: (payload) => {
        const row = (
          payload as {
            new?: {
              user1_id?: string;
              user2_id?: string;
              anniversary_date?: string | null;
            };
          }
        ).new;
        if (row && (row.user1_id === userId || row.user2_id === userId)) {
          onAnniversaryChange(row.anniversary_date ?? null);
        }
      },
    });
  }

  return createRealtimeChannel({
    channelName: `memories_channel_${coupleKey}_${Date.now()}`,
    changes,
  });
}
