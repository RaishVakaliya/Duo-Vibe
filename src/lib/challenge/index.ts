import { supabase } from "@/src/lib/supabase";
import {
  CoupleChallengeProgress,
  CoupleChallengeDayEntry,
} from "@/src/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Deterministically build a couple_key from two user IDs.
 * Always sorts them alphabetically so the key is identical regardless of
 * which partner initiates.
 */
export function buildCoupleKey(userId: string, partnerId: string): string {
  return [userId, partnerId].sort().join("_");
}

/**
 * Safely parse completed_days from raw JSONB. Defaults to [] on any error
 * so a malformed/legacy row never crashes callers.
 */
export function safeParseCompletedDays(raw: unknown): CoupleChallengeDayEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is CoupleChallengeDayEntry =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as CoupleChallengeDayEntry).day === "number" &&
      typeof (item as CoupleChallengeDayEntry).completedAt === "string" &&
      typeof (item as CoupleChallengeDayEntry).completedBy === "string",
  );
}

/** Map a raw Supabase row into the typed domain model. */
function rowToProgress(row: {
  id: string;
  couple_key: string;
  user_a_id: string;
  user_b_id: string;
  current_day: number;
  completed_days: unknown;
  last_completed_at: string | null;
  started_at: string;
}): CoupleChallengeProgress {
  return {
    id: row.id,
    couple_key: row.couple_key,
    user_a_id: row.user_a_id,
    user_b_id: row.user_b_id,
    current_day: row.current_day,
    completed_days: safeParseCompletedDays(row.completed_days),
    last_completed_at: row.last_completed_at,
    started_at: row.started_at,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches the shared couple_challenge_progress row for this user pair,
 * creating one via upsert (on conflict: couple_key) if it doesn't exist yet.
 * The upsert prevents duplicate rows even if both partners hit this
 * simultaneously for the first time.
 */
export async function getOrCreateCoupleProgress(
  userId: string,
  partnerId: string,
): Promise<CoupleChallengeProgress> {
  const coupleKey = buildCoupleKey(userId, partnerId);

  // Sort so user_a is always the lexicographically smaller id
  const sorted = [userId, partnerId].sort();
  const userAId: string = sorted[0]!;
  const userBId: string = sorted[1]!;

  const { data, error } = await supabase
    .from("couple_challenge_progress")
    .upsert(
      {
        couple_key: coupleKey,
        user_a_id: userAId,
        user_b_id: userBId,
        current_day: 1,
        completed_days: [],
      },
      { onConflict: "couple_key", ignoreDuplicates: true },
    )
    .select(
      "id, couple_key, user_a_id, user_b_id, current_day, completed_days, last_completed_at, started_at",
    )
    .maybeSingle();

  if (error) throw new Error(error.message);

  // ignoreDuplicates: true means upsert returns null on conflict; re-fetch.
  if (!data) {
    const { data: existing, error: fetchError } = await supabase
      .from("couple_challenge_progress")
      .select(
        "id, couple_key, user_a_id, user_b_id, current_day, completed_days, last_completed_at, started_at",
      )
      .eq("couple_key", coupleKey)
      .single();

    if (fetchError || !existing) {
      throw new Error(fetchError?.message ?? "Failed to load challenge progress.");
    }
    return rowToProgress(existing);
  }

  return rowToProgress(data);
}

/**
 * Returns true if the given day is unlocked.
 * Day 1 is always unlocked. Any subsequent day unlocks only after the
 * previous day's completedAt is at least 24 hours in the past.
 */
export function isDayUnlocked(
  progress: CoupleChallengeProgress,
  day: number,
): boolean {
  if (day <= 1) return true;

  const prevEntry = progress.completed_days.find((e) => e.day === day - 1);
  if (!prevEntry) return false;

  const completedAt = new Date(prevEntry.completedAt).getTime();
  const msIn24Hours = 24 * 60 * 60 * 1000;
  return Date.now() - completedAt >= msIn24Hours;
}

/**
 * Marks a day as complete for the given user.
 * Appends to completed_days and advances current_day when this was the
 * active day. Safe to call even if the day was already completed
 * (idempotent: checks before appending).
 */
export async function markDayComplete(
  progress: CoupleChallengeProgress,
  day: number,
  completedByUserId: string,
): Promise<CoupleChallengeProgress> {
  const alreadyDone = progress.completed_days.some((e) => e.day === day);
  if (alreadyDone) return progress;

  const newEntry: CoupleChallengeDayEntry = {
    day,
    completedAt: new Date().toISOString(),
    completedBy: completedByUserId,
  };

  const updatedCompletedDays = [...progress.completed_days, newEntry];
  const newCurrentDay =
    day === progress.current_day
      ? Math.min(progress.current_day + 1, 30)
      : progress.current_day;

  const { data, error } = await supabase
    .from("couple_challenge_progress")
    .update({
      completed_days: updatedCompletedDays as unknown as import("@/src/types/database").Json,
      current_day: newCurrentDay,
      last_completed_at: newEntry.completedAt,
    })
    .eq("id", progress.id)
    .select(
      "id, couple_key, user_a_id, user_b_id, current_day, completed_days, last_completed_at, started_at",
    )
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to mark day complete.");
  }

  return rowToProgress(data);
}

/**
 * Subscribes to real-time updates on a couple_challenge_progress row.
 * If the subscription channel fails it logs a warning but never throws —
 * the UI degrades gracefully to manual refresh.
 * Returns an unsubscribe function.
 */
export function subscribeToChallengeProgress(
  progressId: string,
  onUpdate: (progress: CoupleChallengeProgress) => void,
): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  try {
    channel = supabase
      .channel(`challenge_progress_${progressId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "couple_challenge_progress",
          filter: `id=eq.${progressId}`,
        },
        (payload) => {
          if (payload.new) {
            try {
              onUpdate(rowToProgress(payload.new as Parameters<typeof rowToProgress>[0]));
            } catch (e) {
              console.warn("[challenge realtime] failed to parse update payload:", e);
            }
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[challenge realtime] subscription error for", progressId);
        }
      });
  } catch (e) {
    console.warn("[challenge realtime] failed to subscribe:", e);
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel).catch(() => { });
    }
  };
}
