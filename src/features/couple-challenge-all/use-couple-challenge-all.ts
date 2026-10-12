import { useState, useCallback, useEffect, useRef } from "react";
import { usePartnerGuard } from "@/src/hooks/use-partner-guard";
import {
  getOrCreateCoupleProgress,
  subscribeToChallengeProgress,
} from "@/src/lib/challenge";
import { CoupleChallengeProgress } from "@/src/types";
import type { ChallengeLoadState } from "@/src/types";
import { UseCoupleChallengAll } from "./types";

export function useCoupleChallengeAll(): UseCoupleChallengAll {
  const {
    user,
    hasPartner,
    partnerId,
    isLoading: partnerLoading,
  } = usePartnerGuard();

  const [loadState, setLoadState] = useState<ChallengeLoadState>("loading");
  const [progress, setProgress] = useState<CoupleChallengeProgress | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const load = useCallback(async () => {
    if (partnerLoading) return;

    if (!user) return;

    if (!hasPartner || !partnerId) {
      setLoadState("no_partner");
      return;
    }

    setLoadState("loading");
    try {
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
  }, [user, hasPartner, partnerId, partnerLoading]);

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
