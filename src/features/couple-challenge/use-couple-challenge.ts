import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/src/context/auth";
import { getPartnerId } from "@/src/lib/quizSession";
import {
  loadChallengeState,
  markMyDayComplete,
  subscribeToCompletions,
  computeCurrentDay,
} from "@/src/lib/challenge";
import { supabase } from "@/src/lib/supabase";
import {
  CoupleChallengeState,
  CoupleChallengeDayCompletion,
} from "@/src/types";
import { UseCoupleChallenge, ChallengeLoadState } from "./types";

export function useCoupleChallenge(): UseCoupleChallenge {
  const { user, hasPartner } = useAuth();

  const [loadState, setLoadState] = useState<ChallengeLoadState>("loading");
  const [challengeState, setChallengeState] = useState<CoupleChallengeState | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [isMarkingDone, setIsMarkingDone] = useState<boolean>(false);

  const partnerIdRef = useRef<string | null>(null);
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

      partnerIdRef.current = partnerId;

      // Fetch partner display name
      const { data: partnerProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", partnerId)
        .maybeSingle();
      setPartnerName(partnerProfile?.full_name ?? null);

      // Load full state (progress + per-user completions)
      const state = await loadChallengeState(user.id, partnerId);
      setChallengeState(state);
      setLoadState("ready");

      // Real-time: any INSERT into couple_challenge_completions for this progress
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = subscribeToCompletions(
        state.progress.id,
        (newCompletion: CoupleChallengeDayCompletion) => {
          setChallengeState((prev) => {
            if (!prev) return prev;

            const isMe = newCompletion.userId === user.id;
            const isPartner = newCompletion.userId === partnerIdRef.current;

            // Avoid duplicate entries in local state
            const targetList = isMe ? prev.myCompletions : isPartner ? prev.partnerCompletions : null;
            if (!targetList) return prev;
            if (targetList.some((c) => c.id === newCompletion.id)) return prev;

            const newMy = isMe
              ? [...prev.myCompletions, newCompletion]
              : prev.myCompletions;
            const newPartner = isPartner
              ? [...prev.partnerCompletions, newCompletion]
              : prev.partnerCompletions;

            return {
              ...prev,
              myCompletions: newMy,
              partnerCompletions: newPartner,
              currentDay: computeCurrentDay(newMy, newPartner),
            };
          });
        },
      );
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
    if (!challengeState || !user || isMarkingDone) return;

    const day = challengeState.currentDay;
    if (day > 30) return; // all done

    // Check if I've already marked this day done
    const alreadyDoneByMe = challengeState.myCompletions.some((c) => c.day === day);
    if (alreadyDoneByMe) return;

    // Optimistic update — add a temporary completion for "me"
    const optimistic: CoupleChallengeDayCompletion = {
      id: `optimistic_${day}`,
      progressId: challengeState.progress.id,
      userId: user.id,
      day,
      completedAt: new Date().toISOString(),
    };

    setChallengeState((prev) => {
      if (!prev) return prev;
      const newMy = [...prev.myCompletions, optimistic];
      return {
        ...prev,
        myCompletions: newMy,
        currentDay: computeCurrentDay(newMy, prev.partnerCompletions),
      };
    });

    setIsMarkingDone(true);
    try {
      const serverCompletion = await markMyDayComplete(
        challengeState.progress.id,
        user.id,
        day,
      );
      // Replace the optimistic entry with the server-confirmed one
      setChallengeState((prev) => {
        if (!prev) return prev;
        const newMy = prev.myCompletions
          .filter((c) => c.id !== `optimistic_${day}`)
          .concat(serverCompletion);
        return {
          ...prev,
          myCompletions: newMy,
          currentDay: computeCurrentDay(newMy, prev.partnerCompletions),
        };
      });
    } catch (err) {
      console.error("[useCoupleChallenge] markDone error:", err);
      // Roll back the optimistic update
      setChallengeState((prev) => {
        if (!prev) return prev;
        const newMy = prev.myCompletions.filter((c) => c.id !== `optimistic_${day}`);
        return {
          ...prev,
          myCompletions: newMy,
          currentDay: computeCurrentDay(newMy, prev.partnerCompletions),
        };
      });
    } finally {
      setIsMarkingDone(false);
    }
  }, [challengeState, user, isMarkingDone]);

  return {
    loadState,
    challengeState,
    partnerName,
    isMarkingDone,
    handleMarkDone,
    handleRetry: load,
  };
}
