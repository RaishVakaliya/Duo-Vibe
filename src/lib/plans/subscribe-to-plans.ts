import { supabase } from "@/src/lib/supabase";

export interface SubscribeToPlansParams {
  coupleKey: string;
  onPlanChange: () => void;
}

export function subscribeToPlans({
  coupleKey,
  onPlanChange,
}: SubscribeToPlansParams): () => void {
  const channelName = `couple_plans_${coupleKey}_${Date.now()}`;

  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "couple_plans",
        filter: `couple_key=eq.${coupleKey}`,
      },
      () => {
        onPlanChange();
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
