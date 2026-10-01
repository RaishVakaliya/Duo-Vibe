import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/src/context/auth";
import { getPartnerId } from "@/src/lib/quizSession";
import {
  getOrCreateCoupleProgress,
  markDayComplete,
  subscribeToChallengeProgress,
} from "@/src/lib/challenge";
import { supabase } from "@/src/lib/supabase";
import { CoupleChallengeProgress } from "@/src/types";
import { UseCoupleChallenge, ChallengeLoadState } from "./types";

export function useCoupleChallenge(): UseCoupleChallenge {
  const { user, hasPartner } = useAuth();

  const [loadState, setLoadState] = useState<ChallengeLoadState>("loading");
  const [progress, setProgress] = useState<CoupleChallengeProgress | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [isMarkingDone, setIsMarkingDone] = useState<boolean>(false);

  // Keep unsubscribe fn in a ref so we can clean up on unmount without
  // putting it in the dependency array.
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setLoadState("loading");
      return;
    }

    if (!hasPartner) {
      setLoadState("no_partner");
      return;
    }

    setLoadState("loading");

    try {
      const partnerId = await getPartnerId(user.id);
      if (!partnerId) {
        setLoadState("no_partner");
        return;
      }

      // Fetch partner display name
      const { data: partnerProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", partnerId)
        .maybeSingle();
      setPartnerName(partnerProfile?.full_name ?? null);

      const p = await getOrCreateCoupleProgress(user.id, partnerId);
      setProgress(p);
      setLoadState("ready");

      // Set up realtime — silent fail handled inside the lib
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = subscribeToChallengeProgress(p.id, (updated) => {
        setProgress(updated);
      });
    } catch (err) {
      console.error("[useCoupleChallenge] load error:", err);
      setLoadState("error");
    }
  }, [user, hasPartner]);

  useEffect(() => {
    load();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [load]);

  const handleMarkDone = useCallback(async () => {
    if (!progress || !user || isMarkingDone) return;

    const day = progress.current_day;
    const alreadyDone = progress.completed_days.some((e) => e.day === day);
    if (alreadyDone) return;

    // Optimistic update
    const optimisticEntry = {
      day,
      completedAt: new Date().toISOString(),
      completedBy: user.id,
    };
    setProgress((prev) =>
      prev
        ? {
            ...prev,
            completed_days: [...prev.completed_days, optimisticEntry],
            current_day: Math.min(prev.current_day + 1, 30),
            last_completed_at: optimisticEntry.completedAt,
          }
        : prev,
    );

    setIsMarkingDone(true);
    try {
      const updated = await markDayComplete(progress, day, user.id);
      // Reconcile with server truth (realtime may also fire, that's fine)
      setProgress(updated);
    } catch (err) {
      console.error("[useCoupleChallenge] markDone error:", err);
      // Roll back optimistic update on failure
      setProgress(progress);
    } finally {
      setIsMarkingDone(false);
    }
  }, [progress, user, isMarkingDone]);

  return {
    loadState,
    progress,
    partnerName,
    isMarkingDone,
    handleMarkDone,
    handleRetry: load,
  };
}
