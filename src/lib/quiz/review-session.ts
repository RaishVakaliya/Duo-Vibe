import { supabase } from "@/src/lib/supabase";
import { QUIZ_QUESTION_BANK, QuizQuestion } from "@/src/data/quizQuestions";
import { QuizAnswer, QuizSession } from "@/src/types";
import { sendExpoPushNotification } from "@/src/lib/notifications";

export interface ReviewSessionData {
  session: QuizSession;
  answers: (QuizAnswer & {
    question?: QuizQuestion;
  })[];
  questions: QuizQuestion[];
}

export async function getSessionForReview(
  sessionId: string,
): Promise<ReviewSessionData> {
  const { data: sessionData, error: sessionErr } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionErr || !sessionData) {
    throw new Error(sessionErr?.message || "Quiz session not found.");
  }

  const { data: answersData, error: answersErr } = await supabase
    .from("quiz_answers")
    .select("*")
    .eq("session_id", sessionId);

  if (answersErr || !answersData) {
    throw new Error(answersErr?.message || "Failed to load quiz answers.");
  }

  const rawIds = sessionData.question_ids;
  const qIds: string[] = Array.isArray(rawIds)
    ? (rawIds as string[])
    : typeof rawIds === "string"
      ? JSON.parse(rawIds)
      : [];

  const questionsMap = new Map(QUIZ_QUESTION_BANK.map((q) => [q.id, q]));
  const fullQuestions: QuizQuestion[] = qIds
    .map((id) => questionsMap.get(id))
    .filter((q): q is QuizQuestion => q !== undefined);

  const enrichedAnswers = answersData.map((ans) => ({
    id: ans.id,
    session_id: ans.session_id,
    question_id: ans.question_id,
    guessed_option: ans.guessed_option,
    is_correct: ans.is_correct,
    question: questionsMap.get(ans.question_id),
  }));

  const session: QuizSession = {
    id: sessionData.id,
    answerer_id: sessionData.answerer_id,
    reviewer_id: sessionData.reviewer_id,
    question_ids: qIds,
    status: sessionData.status,
    score: sessionData.score,
    created_at: sessionData.created_at,
    completed_at: sessionData.completed_at,
  };

  return {
    session,
    answers: enrichedAnswers,
    questions: fullQuestions,
  };
}

export async function submitReview(
  sessionId: string,
  gradedAnswers: { answerId: string; isCorrect: boolean }[],
): Promise<number> {
  for (const grade of gradedAnswers) {
    const { error } = await supabase
      .from("quiz_answers")
      .update({ is_correct: grade.isCorrect })
      .eq("id", grade.answerId);

    if (error) {
      console.warn(`Error updating answer ${grade.answerId}:`, error);
    }
  }

  const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
  const nowIso = new Date().toISOString();

  const { error: sessionUpdateErr } = await supabase
    .from("quiz_sessions")
    .update({
      score: correctCount,
      status: "completed",
      completed_at: nowIso,
    })
    .eq("id", sessionId);

  if (sessionUpdateErr) {
    throw new Error(
      sessionUpdateErr.message || "Failed to update quiz session.",
    );
  }

  // Trigger push notification to the answerer that their quiz has been reviewed
  try {
    const { data: session } = await supabase
      .from("quiz_sessions")
      .select("answerer_id")
      .eq("id", sessionId)
      .single();

    if (session) {
      const { data: answererProfile } = await supabase
        .from("profiles")
        .select("push_token")
        .eq("id", session.answerer_id)
        .single();

      if (answererProfile?.push_token) {
        await sendExpoPushNotification({
          to: answererProfile.push_token,
          title: "Quiz Reviewed! 🎉",
          body: `Your partner graded your quiz! You scored ${correctCount}/${gradedAnswers.length} 💕`,
          data: { sessionId, type: "quiz_result" },
        });
      }
    }
  } catch (notifyErr) {
    console.warn("Review completed push notification note:", notifyErr);
  }

  return correctCount;
}
