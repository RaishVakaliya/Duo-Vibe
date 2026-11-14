import { supabase } from "@/src/lib/supabase";
import { QuizSession } from "@/src/types";
import { getCache, setCache, invalidateCache, TTL } from "@/src/lib/cache";

const PENDING_SESSIONS_CACHE_KEY = (userId: string) =>
  `quiz_sessions:pending:${userId}`;

export async function getPendingReviewSessions(
  userId: string,
): Promise<QuizSession[]> {
  const cacheKey = PENDING_SESSIONS_CACHE_KEY(userId);

  const cached = await getCache<QuizSession[]>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, answerer_id, reviewer_id, question_ids, status, score, created_at, completed_at")
    .eq("reviewer_id", userId)
    .eq("status", "awaiting_review")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("Failed to fetch pending review sessions:", error);
    return [];
  }

  const sessions = data.map((row) => ({
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

  await setCache(cacheKey, sessions, TTL.QUIZ_SESSIONS);
  return sessions;
}

export function invalidatePendingSessionsCache(userId: string): Promise<void> {
  return invalidateCache(PENDING_SESSIONS_CACHE_KEY(userId));
}

const PARTNER_ID_CACHE_KEY = (userId: string) => `partner_id:${userId}`;

export async function getPartnerId(userId: string): Promise<string | null> {
  const cacheKey = PARTNER_ID_CACHE_KEY(userId);

  const cached = await getCache<string | null>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("partner_id")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.partner_id) {
    await setCache(cacheKey, profile.partner_id, TTL.COUPLE);
    return profile.partner_id;
  }

  const { data: couple } = await supabase
    .from("couples")
    .select("user1_id, user2_id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "connected")
    .maybeSingle();

  if (couple) {
    const partnerId =
      couple.user1_id === userId ? couple.user2_id : couple.user1_id;
    await setCache(cacheKey, partnerId, TTL.COUPLE);
    return partnerId;
  }

  return null;
}

export function invalidatePartnerIdCache(userId: string): Promise<void> {
  return invalidateCache(PARTNER_ID_CACHE_KEY(userId));
}

export async function getActiveAnswererSession(
  userId: string,
): Promise<QuizSession | null> {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, answerer_id, reviewer_id, question_ids, status, score, created_at, completed_at")
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
    .select("id, answerer_id, reviewer_id, question_ids, status, score, created_at, completed_at")
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
