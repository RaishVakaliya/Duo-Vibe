import { supabase } from "@/src/lib/supabase";

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
  const channelName = `memories_channel_${coupleKey}_${Date.now()}`;

  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "memories",
        filter: `couple_key=eq.${coupleKey}`,
      },
      () => {
        onMemoryChange();
      },
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "memory_reactions",
      },
      () => {
        onReactionChange();
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
