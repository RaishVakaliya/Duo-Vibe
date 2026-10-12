import { useState, useCallback, useEffect, useRef } from "react";
import { Share } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/src/context/auth-context";
import { supabase } from "@/src/lib/supabase";
import { getPartnerId } from "@/src/lib/quiz";
import { buildCoupleKey } from "@/src/lib/challenge";
import { ROUTES } from "@/src/constants/routes";
import { FlagStatement } from "@/src/data/flagStatements";
import {
  FlagVote,
  FlagStat,
  FlagSession,
} from "@/src/types";
import {
  selectFlagStatements,
  getStatementsFromIds,
  recordSoloVote,
  getFlagStats,
  getOrCreatePartnerSession,
  submitPartnerAnswers,
  getPartnerResults,
  subscribeToSessionAnswers,
  fetchMyAnswersForSession,
} from "@/src/lib/flags";
import { createResultMemory } from "@/src/lib/memories";
import {
  RedGreenFlagStep,
  RedGreenFlagMode,
  SwipeDecision,
  SoloSummary,
  PartnerSummary,
  UseRedGreenFlagReturn,
} from "./types";

function computeSoloVerdict(redCount: number, greenCount: number): string {
  if (redCount >= 15) {
    return "Major boundary setter — you protect your peace fiercely and your standards are sky high.";
  }
  if (redCount >= 12) {
    return "Careful observer — you catch red flags before they even start waving and trust your gut.";
  }
  if (greenCount >= 15) {
    return "Rose-colored romantic — you see the best in everyone and lead with total warmth.";
  }
  if (greenCount >= 12) {
    return "Gentle optimist — you give second chances and believe small flaws make people human.";
  }
  return "Balanced realist — you take things case-by-case and value honest communication above all.";
}

export function useRedGreenFlag(): UseRedGreenFlagReturn {
  const router = useRouter();
  const { user, hasPartner } = useAuth();

  const [step, setStep] = useState<RedGreenFlagStep>("mode_select");
  const [mode, setMode] = useState<RedGreenFlagMode>("solo");
  const [partnerName, setPartnerName] = useState<string>("your partner");
  const [coupleKey, setCoupleKey] = useState<string | null>(null);

  const [activeSession, setActiveSession] = useState<FlagSession | null>(null);
  const [partnerSessionStatus, setPartnerSessionStatus] = useState<
    "none" | "waiting_for_partner" | "partner_finished" | "both_finished"
  >("none");

  // Deck state
  const [statements, setStatements] = useState<FlagStatement[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [decisions, setDecisions] = useState<SwipeDecision[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Stats
  const [statsMap, setStatsMap] = useState<Map<string, FlagStat>>(new Map());
  const [currentStatToast, setCurrentStatToast] = useState<string | null>(null);
  const statToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Submission & Retry
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Results
  const [soloSummary, setSoloSummary] = useState<SoloSummary | null>(null);
  const [partnerSummary, setPartnerSummary] = useState<PartnerSummary | null>(
    null,
  );
  const [isSavedToMemories, setIsSavedToMemories] = useState<boolean>(false);
  const [isSavingMemory, setIsSavingMemory] = useState<boolean>(false);

  const unsubscribeRealtimeRef = useRef<(() => void) | null>(null);

  // ── Initial Partner & Active Session Discovery ─────────────────────────────
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function loadPartnerInfo() {
      if (!user) return;
      if (!hasPartner) {
        if (isMounted) setPartnerSessionStatus("none");
        return;
      }

      try {
        const pId = await getPartnerId(user.id);
        if (!pId || !isMounted) return;

        const cKey = buildCoupleKey(user.id, pId);
        setCoupleKey(cKey);

        const { data: pProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", pId)
          .maybeSingle();

        if (pProfile?.full_name && isMounted) {
          setPartnerName(pProfile.full_name.trim());
        }

        // Check if an in-progress or finished session already exists
        const { data: latest } = await supabase
          .from("flag_sessions")
          .select("id, couple_key, created_by, statement_ids, created_at")
          .eq("couple_key", cKey)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latest && isMounted) {
          const ids = Array.isArray(latest.statement_ids)
            ? (latest.statement_ids as string[])
            : [];
          const sessionObj: FlagSession = {
            id: latest.id,
            couple_key: latest.couple_key,
            created_by: latest.created_by,
            statement_ids: ids,
            created_at: latest.created_at,
          };
          setActiveSession(sessionObj);

          // Check answers for both partners
          const [myAnswers, partnerRes] = await Promise.all([
            fetchMyAnswersForSession(latest.id, user.id),
            getPartnerResults(latest.id),
          ]);

          if (partnerRes.isReady) {
            setPartnerSessionStatus("both_finished");
            setPartnerSummary(partnerRes);
          } else if (myAnswers.length >= ids.length && ids.length > 0) {
            setPartnerSessionStatus("waiting_for_partner");
          } else {
            // Check if partner answered
            const { count: partnerAnsCount } = await supabase
              .from("flag_answers")
              .select("statement_id", { count: "exact", head: true })
              .eq("session_id", latest.id)
              .eq("user_id", pId);

            if ((partnerAnsCount ?? 0) >= ids.length && ids.length > 0) {
              setPartnerSessionStatus("partner_finished");
            } else {
              setPartnerSessionStatus("none");
            }
          }
        }
      } catch (err) {
        console.warn("[flags] Error loading partner info:", err);
      }
    }

    loadPartnerInfo();

    return () => {
      isMounted = false;
    };
  }, [user, hasPartner]);

  // ── Realtime listener when on waiting screen ───────────────────────────────
  const checkPartnerStatusLive = useCallback(async () => {
    if (!activeSession) return;
    try {
      const partnerRes = await getPartnerResults(activeSession.id);
      if (partnerRes.isReady) {
        setPartnerSummary(partnerRes);
        setStep("partner_result");
        setPartnerSessionStatus("both_finished");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.warn("[flags] Error checking live partner status:", err);
    }
  }, [activeSession]);

  useEffect(() => {
    if (step === "waiting" && activeSession) {
      if (unsubscribeRealtimeRef.current) {
        unsubscribeRealtimeRef.current();
      }
      unsubscribeRealtimeRef.current = subscribeToSessionAnswers(
        activeSession.id,
        () => {
          checkPartnerStatusLive();
        },
      );
    }

    return () => {
      if (unsubscribeRealtimeRef.current) {
        unsubscribeRealtimeRef.current();
        unsubscribeRealtimeRef.current = null;
      }
    };
  }, [step, activeSession, checkPartnerStatusLive]);

  // ── Mode Selection ─────────────────────────────────────────────────────────
  const handleSelectMode = useCallback(
    async (selectedMode: RedGreenFlagMode) => {
      setMode(selectedMode);
      setCurrentIndex(0);
      setDecisions([]);
      setSubmitError(null);
      setCurrentStatToast(null);

      if (selectedMode === "solo") {
        const selected = selectFlagStatements();
        setStatements(selected);
        setStep("swiping");

        // Fetch stats in background
        getFlagStats(selected.map((s) => s.id)).then(setStatsMap).catch(() => {});
      } else {
        // Partner mode
        if (!user || !hasPartner || !coupleKey) {
          router.push(ROUTES.INVITE_PARTNER);
          return;
        }

        // If session was already completed, open results directly
        if (partnerSessionStatus === "both_finished" && partnerSummary) {
          setStep("partner_result");
          return;
        }

        // If I already answered and waiting for partner, open waiting screen directly
        if (partnerSessionStatus === "waiting_for_partner") {
          setStep("waiting");
          return;
        }

        try {
          const session = await getOrCreatePartnerSession(
            coupleKey,
            user.id,
            false,
          );
          setActiveSession(session);
          const stmts = getStatementsFromIds(session.statement_ids);
          setStatements(stmts);

          // Preload stats
          getFlagStats(session.statement_ids).then(setStatsMap).catch(() => {});

          setStep("swiping");
        } catch (err) {
          console.warn("[flags] Error starting partner session:", err);
        }
      }
    },
    [
      user,
      hasPartner,
      coupleKey,
      partnerSessionStatus,
      partnerSummary,
      router,
    ],
  );

  // ── Handling Answers Submission for Partner Mode ───────────────────────────
  const submitCompletedPartnerRound = useCallback(
    async (answersToSubmit: SwipeDecision[], session: FlagSession) => {
      if (!user) return;
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await submitPartnerAnswers(
          session.id,
          user.id,
          answersToSubmit.map((d) => ({
            statementId: d.statementId,
            vote: d.vote,
          })),
        );

        // Check if both have finished
        const res = await getPartnerResults(session.id);
        if (res.isReady) {
          setPartnerSummary(res);
          setPartnerSessionStatus("both_finished");
          setStep("partner_result");
        } else {
          setPartnerSessionStatus("waiting_for_partner");
          setStep("waiting");
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to submit answers. Please check your internet connection.";
        setSubmitError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user],
  );

  // ── Vote & Swipe Trigger ───────────────────────────────────────────────────
  const handleVote = useCallback(
    (vote: FlagVote) => {
      if (isAnimating || isSubmitting || currentIndex >= statements.length) {
        return;
      }

      setIsAnimating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const st = statements[currentIndex];
      if (!st) {
        setIsAnimating(false);
        return;
      }

      const newDecision: SwipeDecision = {
        index: currentIndex,
        statementId: st.id,
        vote,
      };
      const updatedDecisions = [...decisions, newDecision];
      setDecisions(updatedDecisions);

      // In Solo mode: record vote anonymously & show community percentage toast if available
      if (mode === "solo" && user) {
        recordSoloVote(user.id, st.id, vote).catch(() => {});

        const stat = statsMap.get(st.id);
        if (stat) {
          if (statToastTimeoutRef.current) {
            clearTimeout(statToastTimeoutRef.current);
          }
          setCurrentStatToast(
            `${stat.red_percentage}% of people called this a red flag`,
          );
          statToastTimeoutRef.current = setTimeout(() => {
            setCurrentStatToast(null);
          }, 2400);
        }
      }

      const isLastCard = currentIndex >= statements.length - 1;

      // Finish or advance deck
      setTimeout(() => {
        if (isLastCard) {
          if (mode === "solo") {
            const redCount = updatedDecisions.filter(
              (d) => d.vote === "red",
            ).length;
            const greenCount = updatedDecisions.filter(
              (d) => d.vote === "green",
            ).length;
            const verdict = computeSoloVerdict(redCount, greenCount);

            setSoloSummary({
              redCount,
              greenCount,
              verdict,
              answers: updatedDecisions,
            });
            setStep("solo_result");
          } else {
            // Partner Mode: Submit all 20 answers
            if (activeSession) {
              setStep("submitting");
              submitCompletedPartnerRound(updatedDecisions, activeSession);
            }
          }
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
        setIsAnimating(false);
      }, 280);
    },
    [
      isAnimating,
      isSubmitting,
      currentIndex,
      statements,
      decisions,
      mode,
      user,
      statsMap,
      activeSession,
      submitCompletedPartnerRound,
    ],
  );

  // ── Undo ───────────────────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (currentIndex <= 0 || isAnimating || isSubmitting) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setDecisions((prev) => prev.slice(0, prev.length - 1));
    setCurrentStatToast(null);
  }, [currentIndex, isAnimating, isSubmitting]);

  // ── Retry Submission ───────────────────────────────────────────────────────
  const handleRetrySubmit = useCallback(() => {
    if (activeSession && decisions.length >= 20) {
      submitCompletedPartnerRound(decisions, activeSession);
    }
  }, [activeSession, decisions, submitCompletedPartnerRound]);

  // ── Navigation Back & Reset ────────────────────────────────────────────────
  const handleBackToModeSelect = useCallback(() => {
    setStep("mode_select");
    setCurrentIndex(0);
    setDecisions([]);
    setSubmitError(null);
    setCurrentStatToast(null);
  }, []);

  const handlePlayAgain = useCallback(async () => {
    if (mode === "solo") {
      const fresh = selectFlagStatements();
      setStatements(fresh);
      setCurrentIndex(0);
      setDecisions([]);
      setSoloSummary(null);
      setStep("swiping");
      getFlagStats(fresh.map((s) => s.id)).then(setStatsMap).catch(() => {});
    } else {
      // Create new session for partner mode
      if (!user || !coupleKey) return;
      try {
        const newSession = await getOrCreatePartnerSession(
          coupleKey,
          user.id,
          true,
        );
        setActiveSession(newSession);
        const stmts = getStatementsFromIds(newSession.statement_ids);
        setStatements(stmts);
        setCurrentIndex(0);
        setDecisions([]);
        setPartnerSummary(null);
        setPartnerSessionStatus("none");
        setIsSavedToMemories(false);
        setStep("swiping");
        getFlagStats(newSession.statement_ids).then(setStatsMap).catch(() => {});
      } catch (err) {
        console.warn("[flags] Failed to start new partner session:", err);
      }
    }
  }, [mode, user, coupleKey]);

  // ── Share Solo Result ──────────────────────────────────────────────────────
  const handleShareSoloResult = useCallback(async () => {
    if (!soloSummary) return;
    try {
      const text = `I just played Red Flag or Green Flag on Duo Vibe! 🚩💚\nMy score: ${soloSummary.greenCount} Green Flags, ${soloSummary.redCount} Red Flags.\n"${soloSummary.verdict}"`;
      await Share.share({ message: text });
    } catch (err) {
      console.warn("[flags] Share error:", err);
    }
  }, [soloSummary]);

  // ── Save to Memories ───────────────────────────────────────────────────────
  const handleSaveToMemories = useCallback(async () => {
    if (
      !user ||
      !coupleKey ||
      !partnerSummary ||
      isSavedToMemories ||
      isSavingMemory
    ) {
      return;
    }

    setIsSavingMemory(true);
    try {
      const agreements = partnerSummary.agreementsCount;
      const total = partnerSummary.totalCount || 20;
      const overall = Math.round((agreements / total) * 100);

      await createResultMemory({
        coupleKey,
        userId: user.id,
        title: "Red Flag or Green Flag",
        note: `Agreed on ${agreements} of ${total} relationship statements with ${partnerName}! 🚩✨`,
        payload: {
          type: "red_green_flag",
          score: agreements,
          overall,
          headline: `${agreements}/${total} Agreements`,
        },
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSavedToMemories(true);
    } catch (err) {
      console.warn("[flags] Save memory error:", err);
    } finally {
      setIsSavingMemory(false);
    }
  }, [
    user,
    coupleKey,
    partnerSummary,
    partnerName,
    isSavedToMemories,
    isSavingMemory,
  ]);

  const handleInvitePartner = useCallback(() => {
    router.push({
      pathname: ROUTES.INVITE_PARTNER,
      params: { source: "red_green_flag" },
    });
  }, [router]);

  return {
    step,
    mode,
    partnerName,
    hasPartner,
    activeSession,
    partnerSessionStatus,

    statements,
    currentIndex,
    currentStatement: statements[currentIndex],
    decisions,
    canUndo: currentIndex > 0,
    isAnimating,

    statsMap,
    currentStatToast,

    isSubmitting,
    submitError,

    soloSummary,
    partnerSummary,
    isSavedToMemories,
    isSavingMemory,

    handleSelectMode,
    handleVote,
    handleUndo,
    handleRetrySubmit,
    handlePlayAgain,
    handleBackToModeSelect,
    handleSaveToMemories,
    handleShareSoloResult,
    handleInvitePartner,
  };
}
