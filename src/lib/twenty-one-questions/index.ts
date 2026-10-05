/**
 * Library for the 21 Questions shared session feature.
 *
 * Flow:
 *  1. getOrCreateSession(coupleKey, questionIds) — fetches or creates the shared session row.
 *  2. submitAnswer(sessionId, userId, questionId, answer) — upserts the user's answer.
 *  3. fetchAnswers(sessionId) — loads all answers for the session (both partners).
 *  4. subscribeToAnswers(sessionId, onNew) — realtime listener for partner answers.
 */

import { supabase } from "@/src/lib/supabase";
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

/**
 * Fetches the shared session for a couple_key, creating one if needed.
 * If the session already exists, returns it as-is (preserving the original
 * question set so both partners always see the same questions).
 */
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

/**
 * Upserts the current user's answer for a given question in a session.
 * Idempotent: calling again with a different answer updates the existing row.
 */
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

/**
 * Fetches all answers for a session (both partners).
 */
export async function fetchAnswers(sessionId: string): Promise<TwentyOneQuestionsAnswer[]> {
  const { data, error } = await supabase
    .from("twenty_one_questions_answers")
    .select("id, session_id, user_id, question_id, answer, answered_at")
    .eq("session_id", sessionId);

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToAnswer);
}

/**
 * Subscribes to realtime INSERTs/UPDATEs on twenty_one_questions_answers
 * for a given session. Calls onNew for each new/updated answer.
 * Returns an unsubscribe function.
 */
export function subscribeToAnswers(
  sessionId: string,
  onNew: (answer: TwentyOneQuestionsAnswer) => void,
): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  try {
    channel = supabase
      .channel(`21q_answers_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "twenty_one_questions_answers",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            try {
              onNew(rowToAnswer(payload.new as Parameters<typeof rowToAnswer>[0]));
            } catch (e) {
              console.warn("[21Q realtime] failed to parse answer payload:", e);
            }
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[21Q realtime] subscription error for session", sessionId);
        }
      });
  } catch (e) {
    console.warn("[21Q realtime] failed to subscribe:", e);
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel).catch(() => { });
    }
  };
}

/**
 * Given the session question IDs and all answers for both partners,
 * builds the reveal view — one entry per question showing both answers
 * (or null if not yet answered).
 */
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
