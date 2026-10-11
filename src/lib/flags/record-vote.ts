import { supabase } from "@/src/lib/supabase";
import { FlagVote } from "@/src/types";

/**
 * Records an anonymous solo vote into flag_votes.
 * Upserts on conflict (user_id, statement_id).
 */
export async function recordSoloVote(
  userId: string,
  statementId: string,
  vote: FlagVote,
): Promise<void> {
  try {
    const { error } = await supabase.from("flag_votes").upsert(
      {
        user_id: userId,
        statement_id: statementId,
        vote,
      },
      { onConflict: "user_id,statement_id" },
    );

    if (error) {
      console.warn("[flags] Failed to record solo vote:", error.message);
    }
  } catch (err) {
    console.warn("[flags] Error in recordSoloVote:", err);
  }
}
