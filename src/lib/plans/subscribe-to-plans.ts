import { createRealtimeChannel } from "@/src/lib/realtime/create-realtime-channel";

export interface SubscribeToPlansParams {
  coupleKey: string;
  onPlanChange: () => void;
}

export function subscribeToPlans({
  coupleKey,
  onPlanChange,
}: SubscribeToPlansParams): () => void {
  return createRealtimeChannel({
    channelName: `couple_plans_${coupleKey}_${Date.now()}`,
    changes: {
      event: "*",
      table: "couple_plans",
      filter: `couple_key=eq.${coupleKey}`,
      callback: () => onPlanChange(),
    },
  });
}
