import { useState, useEffect, useCallback } from "react";
import { BackHandler, Alert } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { ROUTES } from "@/src/constants/routes";
import {
  getSessionForReview,
  submitReview,
  ReviewSessionData,
} from "@/src/lib/quizSession";
import { GradedAnswerMap } from "./types";

export function useQuizReview() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const sessionId = params.sessionId ?? "";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<ReviewSessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [grades, setGrades] = useState<GradedAnswerMap>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };
      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => sub.remove();
    }, [router]),
  );

  const loadReviewData = useCallback(async () => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getSessionForReview(sessionId);
      setSessionData(data);

      const initialGrades: GradedAnswerMap = {};
      data.answers.forEach((ans) => {
        if (ans.is_correct !== null && ans.is_correct !== undefined) {
          initialGrades[ans.id] = ans.is_correct;
        }
      });
      setGrades(initialGrades);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load review.";
      Alert.alert("Error", msg, [
        { text: "OK", onPress: () => router.replace(ROUTES.HOME) },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, router]);

  useEffect(() => {
    loadReviewData();
  }, [loadReviewData]);

  const answersList = sessionData?.answers ?? [];
  const total = answersList.length;
  const currentAnswer = answersList[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const currentGrade = currentAnswer ? grades[currentAnswer.id] : undefined;

  const handleGrade = (isCorrect: boolean) => {
    if (!currentAnswer) return;
    setGrades((prev) => ({ ...prev, [currentAnswer.id]: isCorrect }));
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextOrSubmit = async () => {
    if (currentGrade === undefined) return;

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      const gradedPayload = answersList.map((ans) => ({
        answerId: ans.id,
        isCorrect: grades[ans.id] ?? false,
      }));

      await submitReview(sessionId, gradedPayload);

      router.replace({
        pathname: ROUTES.COUPLE_QUIZ_RESULT,
        params: { sessionId },
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit review.";
      Alert.alert("Submission Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressFraction = total > 0 ? (currentIndex + 1) / total : 0;

  const handleBack = () => {
    router.replace(ROUTES.HOME);
  };

  return {
    isLoading,
    isSubmitting,
    currentIndex,
    total,
    currentAnswer,
    isFirst,
    isLast,
    currentGrade,
    progressFraction,
    handleGrade,
    handlePrevious,
    handleNextOrSubmit,
    handleBack,
  };
}
