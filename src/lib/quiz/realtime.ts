import { supabase } from "@/src/lib/supabase";
import { QuizSession } from "@/src/types";
import { Database } from "@/src/types/database";

export function subscribeToSessionUpdates(
  sessionId: string,
  onUpdate: (session: QuizSession) => void,
): () => void {
  const channel = supabase
    .channel(`quiz_session_${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "quiz_sessions",
        filter: `id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.new) {
          const row =
            payload.new as Database["public"]["Tables"]["quiz_sessions"]["Row"];
          onUpdate({
            id: row.id,
            answerer_id: row.answerer_id,
            reviewer_id: row.reviewer_id,
            question_ids: Array.isArray(row.question_ids)
              ? (row.question_ids as string[])
              : [],
            status: row.status,
            score: row.score,
            created_at: row.created_at,
            completed_at: row.completed_at,
          });
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
