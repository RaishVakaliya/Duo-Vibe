import { supabase } from "@/src/lib/supabase";
import {
  CoupleChallengeProgress,
  CoupleChallengeDayEntry,
  CoupleChallengeDayCompletion,
  CoupleChallengeState,
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
 * @deprecated Use the new couple_challenge_completions table queries instead.
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

/** Map a raw Supabase row into the typed progress domain model. */
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

/** Map a raw completions row into the typed domain model. */
function rowToCompletion(row: {
  id: string;
  progress_id: string;
  user_id: string;
  day: number;
  completed_at: string;
}): CoupleChallengeDayCompletion {
  return {
    id: row.id,
    progressId: row.progress_id,
    userId: row.user_id,
    day: row.day,
    completedAt: row.completed_at,
  };
}

/**
 * Compute the active current_day from per-user completion rows.
 * current_day = first day 1–30 where BOTH partners have NOT yet completed it.
 * Returns 31 when all 30 days are finished by both.
 */
export function computeCurrentDay(
  myCompletions: CoupleChallengeDayCompletion[],
  partnerCompletions: CoupleChallengeDayCompletion[],
): number {
  const myDays = new Set(myCompletions.map((c) => c.day));
  const partnerDays = new Set(partnerCompletions.map((c) => c.day));
  for (let d = 1; d <= 30; d++) {
    if (!myDays.has(d) || !partnerDays.has(d)) return d;
  }
  return 31; // all done
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches the shared couple_challenge_progress row for this user pair,
 * creating one via upsert (on conflict: couple_key) if it doesn't exist yet.
 */
export async function getOrCreateCoupleProgress(
  userId: string,
  partnerId: string,
): Promise<CoupleChallengeProgress> {
  const coupleKey = buildCoupleKey(userId, partnerId);

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
 * Fetches all completion rows for a given progress record.
 * Returns both arrays so the caller can distinguish "my" vs "partner" completions.
 */
export async function fetchCompletions(progressId: string): Promise<CoupleChallengeDayCompletion[]> {
  const { data, error } = await supabase
    .from("couple_challenge_completions")
    .select("id, progress_id, user_id, day, completed_at")
    .eq("progress_id", progressId)
    .order("day", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToCompletion);
}

/**
 * Loads the full CoupleChallengeState for a given user pair.
 * Creates the progress row if it doesn't exist, then fetches all completions.
 */
export async function loadChallengeState(
  userId: string,
  partnerId: string,
): Promise<CoupleChallengeState> {
  const progress = await getOrCreateCoupleProgress(userId, partnerId);
  const allCompletions = await fetchCompletions(progress.id);

  const myCompletions = allCompletions.filter((c) => c.userId === userId);
  const partnerCompletions = allCompletions.filter((c) => c.userId === partnerId);
  const currentDay = computeCurrentDay(myCompletions, partnerCompletions);

  return { progress, myCompletions, partnerCompletions, currentDay };
}

/**
 * Returns true if the given day is unlocked for the current user.
 * Day 1 is always unlocked.
 * Day N+1 unlocks only after BOTH partners have completed day N.
 */
export function isDayUnlocked(
  state: CoupleChallengeState,
  day: number,
): boolean {
  if (day <= 1) return true;
  const prevDay = day - 1;
  const myDone = state.myCompletions.some((c) => c.day === prevDay);
  const partnerDone = state.partnerCompletions.some((c) => c.day === prevDay);
  return myDone && partnerDone;
}

/**
 * Marks a specific day as complete for the current user.
 * Inserts a new row into couple_challenge_completions (unique constraint prevents duplicates).
 * Returns the updated completion that was inserted, or the existing one if already done.
 */
export async function markMyDayComplete(
  progressId: string,
  userId: string,
  day: number,
): Promise<CoupleChallengeDayCompletion> {
  const { data, error } = await supabase
    .from("couple_challenge_completions")
    .upsert(
      { progress_id: progressId, user_id: userId, day },
      { onConflict: "progress_id,user_id,day", ignoreDuplicates: true },
    )
    .select("id, progress_id, user_id, day, completed_at")
    .maybeSingle();

  if (error) throw new Error(error.message);

  // ignoreDuplicates returns null if row already existed — re-fetch it
  if (!data) {
    const { data: existing, error: fetchErr } = await supabase
      .from("couple_challenge_completions")
      .select("id, progress_id, user_id, day, completed_at")
      .eq("progress_id", progressId)
      .eq("user_id", userId)
      .eq("day", day)
      .single();

    if (fetchErr || !existing) throw new Error(fetchErr?.message ?? "Failed to mark day complete.");
    return rowToCompletion(existing);
  }

  return rowToCompletion(data);
}

/**
 * Subscribes to real-time INSERT events on couple_challenge_completions
 * for a given progress row. Calls onNew whenever any partner marks a day done.
 * Returns an unsubscribe function.
 */
export function subscribeToCompletions(
  progressId: string,
  onNew: (completion: CoupleChallengeDayCompletion) => void,
): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  try {
    channel = supabase
      .channel(`challenge_completions_${progressId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "couple_challenge_completions",
          filter: `progress_id=eq.${progressId}`,
        },
        (payload) => {
          if (payload.new) {
            try {
              onNew(rowToCompletion(payload.new as Parameters<typeof rowToCompletion>[0]));
            } catch (e) {
              console.warn("[challenge completions realtime] failed to parse payload:", e);
            }
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[challenge completions realtime] subscription error for", progressId);
        }
      });
  } catch (e) {
    console.warn("[challenge completions realtime] failed to subscribe:", e);
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel).catch(() => { });
    }
  };
}

// ─── Legacy (kept for backward-compat, do not use in new code) ────────────────

/** @deprecated Use markMyDayComplete + subscribeToCompletions instead */
export async function markDayComplete(
  progress: CoupleChallengeProgress,
  day: number,
  completedByUserId: string,
): Promise<CoupleChallengeProgress> {
  // Delegate to the new per-user completion
  await markMyDayComplete(progress.id, completedByUserId, day);
  // Return the progress unchanged — current_day is now computed client-side
  return progress;
}

/** @deprecated Use subscribeToCompletions instead */
export function subscribeToChallengeProgress(
  progressId: string,
  onUpdate: (progress: CoupleChallengeProgress) => void,
): () => void {
  // No-op bridge — callers should migrate to subscribeToCompletions
  console.warn("[challenge] subscribeToChallengeProgress is deprecated. Use subscribeToCompletions.");
  return () => { };
}
