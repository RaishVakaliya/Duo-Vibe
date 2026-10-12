import { createRealtimeChannel } from "@/src/lib/realtime/create-realtime-channel";

export function subscribeToSessionAnswers(
  sessionId: string,
  onAnswersChanged: () => void,
): () => void {
  return createRealtimeChannel({
    channelName: `flag_session_${sessionId}_${Date.now()}`,
    changes: {
      event: "*",
      table: "flag_answers",
      filter: `session_id=eq.${sessionId}`,
      callback: () => onAnswersChanged(),
    },
  });
}
