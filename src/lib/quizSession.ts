import { supabase } from "@/src/lib/supabase";
import {
  QUIZ_QUESTION_BANK,
  QuizCategory,
  QuizQuestion,
} from "@/src/data/quizQuestions";
import { QuizAnswer, QuizSession } from "@/src/types";
import { Database } from "@/src/types/database";
import { sendExpoPushNotification } from "@/src/lib/notifications";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
  }
  return arr;
}

export function selectQuizQuestions(): QuizQuestion[] {
  const categories: QuizCategory[] = [
    "preferences",
    "habits",
    "memories",
    "future",
  ];
  const shuffledCategories = shuffleArray(categories);
  const categoryCounts = [3, 3, 2, 2];
  const selected: QuizQuestion[] = [];

  shuffledCategories.forEach((category, idx) => {
    const pool = QUIZ_QUESTION_BANK.filter((q) => q.category === category);
    const count = categoryCounts[idx] ?? 2;
    const picked = shuffleArray(pool).slice(0, count);
    selected.push(...picked);
  });

  return shuffleArray(selected);
}

export async function createQuizSession(
  answererId: string,
  reviewerId: string,
  questions: QuizQuestion[],
): Promise<string> {
  const questionIds = questions.map((q) => q.id);

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      answerer_id: answererId,
      reviewer_id: reviewerId,
      question_ids: questionIds,
      status: "awaiting_review",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create quiz session.");
  }

  return data.id;
}

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

  // Trigger push notification to reviewer
  try {
    const { data: session } = await supabase
      .from("quiz_sessions")
      .select("answerer_id, reviewer_id")
      .eq("id", sessionId)
      .single();

    if (session) {
      // 1. Fetch reviewer's stored push token from profiles
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

      // 2. Also invoke Edge function if deployed
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

export async function getPendingReviewSessions(
  userId: string,
): Promise<QuizSession[]> {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("reviewer_id", userId)
    .eq("status", "awaiting_review")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("Failed to fetch pending review sessions:", error);
    return [];
  }

  return data.map((row) => ({
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
  }));
}

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

export async function getPartnerId(userId: string): Promise<string | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("partner_id")
    .eq("id", userId)
    .single();

  if (profile?.partner_id) {
    return profile.partner_id;
  }

  const { data: couple } = await supabase
    .from("couples")
    .select("user1_id, user2_id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "connected")
    .maybeSingle();

  if (couple) {
    return couple.user1_id === userId ? couple.user2_id : couple.user1_id;
  }

  return null;
}

export async function getActiveAnswererSession(
  userId: string,
): Promise<QuizSession | null> {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("answerer_id", userId)
    .eq("status", "awaiting_review")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    answerer_id: data.answerer_id,
    reviewer_id: data.reviewer_id,
    question_ids: Array.isArray(data.question_ids)
      ? (data.question_ids as string[])
      : [],
    status: data.status,
    score: data.score,
    created_at: data.created_at,
    completed_at: data.completed_at,
  };
}

export async function getSessionById(
  sessionId: string,
): Promise<QuizSession | null> {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    answerer_id: data.answerer_id,
    reviewer_id: data.reviewer_id,
    question_ids: Array.isArray(data.question_ids)
      ? (data.question_ids as string[])
      : [],
    status: data.status,
    score: data.score,
    created_at: data.created_at,
    completed_at: data.completed_at,
  };
}
