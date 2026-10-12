import { supabase } from "@/src/lib/supabase";
import { FlagVote, FlagAnswer } from "@/src/types";
import { getPartnerId } from "@/src/lib/quiz";
import { sendExpoPushNotification } from "@/src/lib/notifications";

export interface SubmitAnswerItem {
  statementId: string;
  vote: FlagVote;
}

/**
 * Submits all answers for a user in a partner session.
 * Upserts to allow safe retries without duplicate errors.
 */
export async function submitPartnerAnswers(
  sessionId: string,
  userId: string,
  answers: SubmitAnswerItem[],
): Promise<void> {
  const payload = answers.map((a) => ({
    session_id: sessionId,
    user_id: userId,
    statement_id: a.statementId,
    vote: a.vote,
  }));

  const { error } = await supabase
    .from("flag_answers")
    .upsert(payload, { onConflict: "session_id,user_id,statement_id" });

  if (error) {
    throw new Error(`Failed to submit answers: ${error.message}`);
  }

  // Also contribute votes to global solo votes table anonymously
  try {
    const votesPayload = answers.map((a) => ({
      user_id: userId,
      statement_id: a.statementId,
      vote: a.vote,
    }));
    await supabase
      .from("flag_votes")
      .upsert(votesPayload, { onConflict: "user_id,statement_id" });
  } catch {
    // Non-blocking for global stats
  }

  // Notify partner
  notifyPartnerFinishedFlags(userId, sessionId).catch(() => {});
}

/**
 * Fetches the current user's submitted answers for a given session.
 */
export async function fetchMyAnswersForSession(
  sessionId: string,
  userId: string,
): Promise<FlagAnswer[]> {
  const { data, error } = await supabase
    .from("flag_answers")
    .select("session_id, user_id, statement_id, vote, created_at")
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (error || !data) return [];
  return data as FlagAnswer[];
}

/**
 * Send push notification to partner that user finished Red Flag or Green Flag
 */
async function notifyPartnerFinishedFlags(
  userId: string,
  sessionId: string,
): Promise<void> {
  try {
    const partnerId = await getPartnerId(userId);
    if (!partnerId) return;

    const [{ data: userProfile }, { data: partnerProfile }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("push_token")
          .eq("id", partnerId)
          .maybeSingle(),
      ]);

    const userName = userProfile?.full_name?.trim() || "Your partner";

    if (partnerProfile?.push_token) {
      await sendExpoPushNotification({
        to: partnerProfile.push_token,
        title: "Red Flag or Green Flag 🚩",
        body: `${userName} finished Red Flag or Green Flag. Your turn!`,
        data: { type: "red_green_flag", sessionId },
      });
    }

    supabase.functions
      .invoke("notify-flag", {
        body: {
          sessionId,
          userId,
          partnerId,
          userName,
        },
      })
      .catch(() => {});
  } catch (err) {
    console.warn("[flags] Push notification error:", err);
  }
}
