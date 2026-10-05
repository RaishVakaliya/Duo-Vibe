import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/src/context/auth";
import { getPartnerId } from "@/src/lib/quizSession";
import {
  getOrCreateSession,
  fetchAnswers,
  submitAnswer,
  subscribeToAnswers,
  buildRevealList,
} from "@/src/lib/twenty-one-questions";
import { selectSessionQuestions } from "@/src/lib/questionSelector";
import { buildCoupleKey } from "@/src/lib/challenge";
import {
  TwentyOneQuestionsSession,
  TwentyOneQuestionsAnswer,
  TwentyOneQuestionsReveal,
} from "@/src/types";
import { UseTwentyOneQuestions, TwentyOneQLoadState } from "./types";

const TOTAL = 21;

export function useTwentyOneQuestions(): UseTwentyOneQuestions {
  const { user, hasPartner } = useAuth();

  const [loadState, setLoadState] = useState<TwentyOneQLoadState>("loading");
  const [session, setSession] = useState<TwentyOneQuestionsSession | null>(null);
  const [answers, setAnswers] = useState<TwentyOneQuestionsAnswer[]>([]);
  const [reveals, setReveals] = useState<TwentyOneQuestionsReveal[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const partnerIdRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /** Rebuild the reveal list whenever session or answers change. */
  const refreshReveals = useCallback(
    (
      s: TwentyOneQuestionsSession,
      allAnswers: TwentyOneQuestionsAnswer[],
    ) => {
      if (!user || !partnerIdRef.current) return;
      const list = buildRevealList(s.question_ids, user.id, partnerIdRef.current, allAnswers);
      setReveals(list);
    },
    [user],
  );

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

      const coupleKey = buildCoupleKey(user.id, partnerId);
      // Generate the question IDs for a new session (21 questions)
      const candidateQIds = selectSessionQuestions()
        .slice(0, TOTAL)
        .map((q) => q.id);

      const s = await getOrCreateSession(coupleKey, candidateQIds);
      setSession(s);

      const allAnswers = await fetchAnswers(s.id);
      setAnswers(allAnswers);
      refreshReveals(s, allAnswers);
      setLoadState("ready");

      // Realtime: listen for partner answers
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = subscribeToAnswers(s.id, (newAnswer) => {
        setAnswers((prev) => {
          // Upsert by (user_id, question_id)
          const idx = prev.findIndex(
            (a) => a.user_id === newAnswer.user_id && a.question_id === newAnswer.question_id,
          );
          const updated = idx >= 0
            ? prev.map((a, i) => (i === idx ? newAnswer : a))
            : [...prev, newAnswer];
          refreshReveals(s, updated);
          return updated;
        });
      });
    } catch (err) {
      console.error("[useTwentyOneQuestions] load error:", err);
      setLoadState("error");
    }
  }, [user, hasPartner, refreshReveals]);

  useEffect(() => {
    load();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [load]);

  const currentReveal = reveals[currentIndex];
  const selectedAnswer = currentReveal?.myAnswer ?? undefined;

  const handleSelectOption = useCallback(
    async (option: string) => {
      if (!session || !user || isSubmitting) return;
      const reveal = reveals[currentIndex];
      if (!reveal) return;

      // Optimistic update
      const optimistic: TwentyOneQuestionsAnswer = {
        id: `optimistic_${reveal.questionId}`,
        session_id: session.id,
        user_id: user.id,
        question_id: reveal.questionId,
        answer: option,
        answered_at: new Date().toISOString(),
      };

      setAnswers((prev) => {
        const idx = prev.findIndex(
          (a) => a.user_id === user.id && a.question_id === reveal.questionId,
        );
        const updated =
          idx >= 0 ? prev.map((a, i) => (i === idx ? optimistic : a)) : [...prev, optimistic];
        refreshReveals(session, updated);
        return updated;
      });

      setIsSubmitting(true);
      try {
        const serverAnswer = await submitAnswer(session.id, user.id, reveal.questionId, option);
        setAnswers((prev) => {
          const updated = prev.map((a) =>
            a.user_id === user.id && a.question_id === reveal.questionId ? serverAnswer : a,
          );
          refreshReveals(session, updated);
          return updated;
        });
      } catch (err) {
        console.error("[useTwentyOneQuestions] submit error:", err);
        // Roll back
        setAnswers((prev) => {
          const updated = prev.filter((a) => a.id !== optimistic.id);
          refreshReveals(session, updated);
          return updated;
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [session, user, reveals, currentIndex, isSubmitting, refreshReveals],
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < reveals.length - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, reveals.length]);

  const myAnswerCount = answers.filter((a) => a.user_id === user?.id).length;
  const partnerAnswerCount = answers.filter((a) => a.user_id === partnerIdRef.current).length;

  return {
    loadState,
    session,
    reveals,
    currentIndex,
    myAnswerCount,
    partnerAnswerCount,
    selectedAnswer,
    isSubmitting,
    handleSelectOption,
    handleNext,
    handlePrevious,
    handleRetry: load,
  };
}
