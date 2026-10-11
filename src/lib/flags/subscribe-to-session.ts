import { supabase } from "@/src/lib/supabase";

/**
 * Subscribes to realtime answer events for a given session.
 * Used by the live waiting screen so when the partner finishes,
 * the UI instantly transitions to the results view.
 */
export function subscribeToSessionAnswers(
  sessionId: string,
  onAnswersChanged: () => void,
): () => void {
  const channelName = `flag_session_${sessionId}_${Date.now()}`;

  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "flag_answers",
        filter: `session_id=eq.${sessionId}`,
      },
      () => {
        onAnswersChanged();
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
