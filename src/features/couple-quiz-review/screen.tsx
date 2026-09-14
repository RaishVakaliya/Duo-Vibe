import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { ROUTES } from "@/src/constants/routes";
import {
  getSessionForReview,
  submitReview,
  ReviewSessionData,
} from "@/src/lib/quizSession";

export default function CoupleQuizReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const sessionId = params.sessionId ?? "";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<ReviewSessionData | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [grades, setGrades] = useState<Record<string, boolean>>({});
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

      const initialGrades: Record<string, boolean> = {};
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace(ROUTES.HOME)}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1B26" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="clipboard" size={22} color="#FF2D6C" />
              <Text style={styles.headerTitle}>Review Quiz</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Did your partner guess right?
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF2D6C" />
          </View>
        ) : (
          <>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarTrack}>
                <MotiView
                  animate={{ width: `${progressFraction * 100}%` }}
                  transition={{ type: "timing", duration: 250 }}
                  style={styles.progressBarFill}
                >
                  <LinearGradient
                    colors={["#FF4D6D", "#FF2D6C"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1, borderRadius: 3 }}
                  />
                </MotiView>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.card}>
                <Text style={styles.progressCounter}>
                  Question {currentIndex + 1} of {total}
                </Text>

                <Text style={styles.questionText}>
                  {currentAnswer?.question?.question ?? "Question"}
                </Text>

                <View style={styles.optionsContainer}>
                  {currentAnswer?.question?.options.map((option) => {
                    const isGuessed =
                      option.label === currentAnswer.guessed_option;

                    return (
                      <View
                        key={option.label}
                        style={[
                          styles.optionPill,
                          isGuessed && styles.optionPillGuessed,
                        ]}
                      >
                        <View style={styles.optionEmojiWrap}>
                          <Text style={styles.optionEmoji}>{option.emoji}</Text>
                        </View>

                        <Text
                          style={[
                            styles.optionText,
                            isGuessed && styles.optionTextGuessed,
                          ]}
                        >
                          {option.label}
                        </Text>

                        {isGuessed && (
                          <View style={styles.partnerGuessBadge}>
                            <Ionicons name="heart" size={12} color="#FFFFFF" />
                            <Text style={styles.partnerGuessBadgeText}>
                              Their Guess
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                <Text style={styles.gradingTitle}>
                  Is this correct about you?
                </Text>

                <View style={styles.gradingButtonsRow}>
                  <Pressable
                    style={[
                      styles.gradeButton,
                      currentGrade === true
                        ? styles.correctButtonActive
                        : styles.correctButtonInactive,
                    ]}
                    onPress={() => handleGrade(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Mark as correct"
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={currentGrade === true ? "#FFFFFF" : "#059669"}
                    />
                    <Text
                      style={[
                        styles.gradeButtonText,
                        currentGrade === true
                          ? styles.gradeButtonTextActive
                          : styles.gradeButtonTextInactiveCorrect,
                      ]}
                    >
                      Correct
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.gradeButton,
                      currentGrade === false
                        ? styles.wrongButtonActive
                        : styles.wrongButtonInactive,
                    ]}
                    onPress={() => handleGrade(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Mark as wrong"
                  >
                    <Ionicons
                      name="close-circle"
                      size={22}
                      color={currentGrade === false ? "#FFFFFF" : "#DC2626"}
                    />
                    <Text
                      style={[
                        styles.gradeButtonText,
                        currentGrade === false
                          ? styles.gradeButtonTextActive
                          : styles.gradeButtonTextInactiveWrong,
                      ]}
                    >
                      Wrong
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.prevButton,
                  isFirst && styles.prevButtonDisabled,
                ]}
                onPress={handlePrevious}
                disabled={isFirst}
                accessibilityRole="button"
                accessibilityLabel="Previous question"
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={isFirst ? "#CBD5E1" : "#1E1B26"}
                />
                <Text
                  style={[
                    styles.prevButtonText,
                    isFirst && styles.prevButtonTextDisabled,
                  ]}
                >
                  Previous
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.nextButton,
                  (currentGrade === undefined || isSubmitting) &&
                  styles.nextButtonDisabled,
                ]}
                onPress={handleNextOrSubmit}
                disabled={currentGrade === undefined || isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={isLast ? "Submit Review" : "Next question"}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.nextButtonText}>
                    {isLast ? "Submit Review 🎉" : "Next"}
                  </Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
