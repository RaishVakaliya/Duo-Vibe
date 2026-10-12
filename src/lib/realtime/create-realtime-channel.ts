import { supabase } from "@/src/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface PostgresChangeConfig<
  T extends { [key: string]: unknown } = { [key: string]: unknown },
> {
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  schema?: string;
  table: string;
  filter?: string;
  callback: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export interface CreateRealtimeChannelOptions {
  channelName: string;
  changes: PostgresChangeConfig | PostgresChangeConfig[];
  onError?: (status: string) => void;
}

export function createRealtimeChannel({
  channelName,
  changes,
  onError,
}: CreateRealtimeChannelOptions): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;
  const changeList = Array.isArray(changes) ? changes : [changes];

  try {
    channel = supabase.channel(channelName);

    for (const change of changeList) {
      channel = channel.on(
        "postgres_changes",
        {
          event: change.event ?? "*",
          schema: change.schema ?? "public",
          table: change.table,
          filter: change.filter,
        },
        change.callback as (payload: unknown) => void,
      );
    }

    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        console.warn(`[realtime] Channel subscription error for ${channelName}`);
        onError?.(status);
      }
    });
  } catch (err) {
    console.warn(`[realtime] Failed to subscribe to ${channelName}:`, err);
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel).catch(() => {});
    }
  };
}
