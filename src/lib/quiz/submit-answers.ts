import { supabase } from "@/src/lib/supabase";
import { sendExpoPushNotification } from "@/src/lib/notifications";

export async function submitAnswers(
  sessionId: string,
  answers: { questionId: string; guessedOption: string }[],
): Promise<void> {
  const payload = answers.map((a) => ({
    session_id: sessionId,
    question_id: a.questionId,
    guessed_option: a.guessedOption,
    is_correct: null,
  }));

  const { error } = await supabase.from("quiz_answers").insert(payload);

  if (error) {
    throw new Error(error.message || "Failed to submit answers.");
  }

  try {
    const { data: session } = await supabase
      .from("quiz_sessions")
      .select("answerer_id, reviewer_id")
      .eq("id", sessionId)
      .single();

    if (session) {
      const { data: reviewerProfile } = await supabase
        .from("profiles")
        .select("push_token, full_name")
        .eq("id", session.reviewer_id)
        .single();

      if (reviewerProfile?.push_token) {
        await sendExpoPushNotification({
          to: reviewerProfile.push_token,
          title: "Couple Quiz 💕",
          body: "Your partner finished a Couple Quiz — come review their answers!",
          data: { sessionId, type: "quiz_review" },
        });
      }

      supabase.functions
        .invoke("notify-quiz-review", {
          body: {
            sessionId,
            answererId: session.answerer_id,
            reviewerId: session.reviewer_id,
          },
        })
        .catch(() => { });
    }
  } catch (notifyErr) {
    console.warn("Push notification send note:", notifyErr);
  }
}
