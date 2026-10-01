import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/src/context/auth";
import { getPartnerId } from "@/src/lib/quizSession";
import {
  getOrCreateCoupleProgress,
  subscribeToChallengeProgress,
} from "@/src/lib/challenge";
import { CoupleChallengeProgress } from "@/src/types";
import type { ChallengeLoadState } from "@/src/types";
import { UseCoupleChallengAll } from "./types";

export function useCoupleChallengeAll(): UseCoupleChallengAll {
  const { user, hasPartner } = useAuth();

  const [loadState, setLoadState] = useState<ChallengeLoadState>("loading");
  const [progress, setProgress] = useState<CoupleChallengeProgress | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const load = useCallback(async () => {
    if (!user) return;

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

      const p = await getOrCreateCoupleProgress(user.id, partnerId);
      setProgress(p);
      setLoadState("ready");

      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = subscribeToChallengeProgress(p.id, (updated) => {
        setProgress(updated);
      });
    } catch (err) {
      console.error("[useCoupleChallengeAll] load error:", err);
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

  return {
    loadState,
    progress,
    handleRetry: load,
  };
}
