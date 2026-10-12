import { supabase } from "@/src/lib/supabase";
import { createRealtimeChannel } from "@/src/lib/realtime/create-realtime-channel";
import {
  TwentyOneQuestionsSession,
  TwentyOneQuestionsAnswer,
  TwentyOneQuestionsReveal,
} from "@/src/types";
import { QUESTION_BANK, Question } from "@/src/data/questions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToSession(row: {
  id: string;
  couple_key: string;
  question_ids: unknown;
  created_at: string;
  reset_at: string | null;
}): TwentyOneQuestionsSession {
  const ids = Array.isArray(row.question_ids)
    ? (row.question_ids as string[])
    : [];
  return {
    id: row.id,
    couple_key: row.couple_key,
    question_ids: ids,
    created_at: row.created_at,
    reset_at: row.reset_at,
  };
}

function rowToAnswer(row: {
  id: string;
  session_id: string;
  user_id: string;
  question_id: string;
  answer: string;
  answered_at: string;
}): TwentyOneQuestionsAnswer {
  return {
    id: row.id,
    session_id: row.session_id,
    user_id: row.user_id,
    question_id: row.question_id,
    answer: row.answer,
    answered_at: row.answered_at,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getOrCreateSession(
  coupleKey: string,
  questionIds: string[],
): Promise<TwentyOneQuestionsSession> {
  // Try to fetch existing first
  const { data: existing } = await supabase
    .from("twenty_one_questions_sessions")
    .select("id, couple_key, question_ids, created_at, reset_at")
    .eq("couple_key", coupleKey)
    .maybeSingle();

  if (existing) return rowToSession(existing);

  // Create new session
  const { data, error } = await supabase
    .from("twenty_one_questions_sessions")
    .insert({ couple_key: coupleKey, question_ids: questionIds })
    .select("id, couple_key, question_ids, created_at, reset_at")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create 21Q session.");
  return rowToSession(data);
}

export async function submitAnswer(
  sessionId: string,
  userId: string,
  questionId: string,
  answer: string,
): Promise<TwentyOneQuestionsAnswer> {
  const { data, error } = await supabase
    .from("twenty_one_questions_answers")
    .upsert(
      { session_id: sessionId, user_id: userId, question_id: questionId, answer },
      { onConflict: "session_id,user_id,question_id" },
    )
    .select("id, session_id, user_id, question_id, answer, answered_at")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to submit answer.");
  return rowToAnswer(data);
}

export async function fetchAnswers(sessionId: string): Promise<TwentyOneQuestionsAnswer[]> {
  const { data, error } = await supabase
    .from("twenty_one_questions_answers")
    .select("id, session_id, user_id, question_id, answer, answered_at")
    .eq("session_id", sessionId);

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToAnswer);
}

export function subscribeToAnswers(
  sessionId: string,
  onNew: (answer: TwentyOneQuestionsAnswer) => void,
): () => void {
  return createRealtimeChannel({
    channelName: `21q_answers_${sessionId}`,
    changes: {
      event: "*",
      table: "twenty_one_questions_answers",
      filter: `session_id=eq.${sessionId}`,
      callback: (payload: { new?: unknown }) => {
        if (payload.new) {
          try {
            onNew(rowToAnswer(payload.new as Parameters<typeof rowToAnswer>[0]));
          } catch (e) {
            console.warn("[21Q realtime] failed to parse answer payload:", e);
          }
        }
      },
    },
  });
}

export function buildRevealList(
  questionIds: string[],
  myUserId: string,
  partnerUserId: string,
  answers: TwentyOneQuestionsAnswer[],
): TwentyOneQuestionsReveal[] {
  const questionMap = new Map<string, Question>(QUESTION_BANK.map((q) => [q.id, q]));

  return questionIds.map((qId) => {
    const q = questionMap.get(qId);
    const myAnswer = answers.find((a) => a.question_id === qId && a.user_id === myUserId);
    const partnerAnswer = answers.find(
      (a) => a.question_id === qId && a.user_id === partnerUserId,
    );

    return {
      questionId: qId,
      question: q?.question ?? qId,
      options: q?.options ?? [],
      myAnswer: myAnswer?.answer ?? null,
      partnerAnswer: partnerAnswer?.answer ?? null,
      bothAnswered: !!myAnswer && !!partnerAnswer,
    };
  });
}
