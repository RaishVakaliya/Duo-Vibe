import React, { useState, useCallback, useMemo } from "react";
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
import { CoupleIllustration } from "@/src/components/couple-illustration";
import { submitAnswers, selectQuizQuestions } from "@/src/lib/quizSession";
import { QuizQuestion } from "@/data/quizQuestions";

export default function CoupleQuizPlayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    sessionId?: string;
    questions?: string;
  }>();
  const sessionId = params.sessionId ?? "";

  const questions: QuizQuestion[] = useMemo(() => {
    if (params.questions) {
      try {
        return JSON.parse(params.questions);
      } catch (e) {
        console.warn("Failed to parse questions param:", e);
      }
    }
    return selectQuizQuestions();
  }, [params.questions]);

  const total = questions.length || 10;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Leave Quiz?",
          "Your current quiz answers won't be saved if you leave now.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Leave",
              style: "destructive",
              onPress: () => router.replace(ROUTES.HOME),
            },
          ],
        );
        return true;
      };
      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => sub.remove();
    }, [router]),
  );

  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const handleSelectOption = (label: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: label }));
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextOrSubmit = async () => {
    if (!selectedAnswer) return;

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      const answerPayload = questions.map((q) => ({
        questionId: q.id,
        guessedOption: answers[q.id] ?? "",
      }));

      await submitAnswers(sessionId, answerPayload);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit answers.";
      Alert.alert("Submission Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressFraction = (currentIndex + 1) / total;

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
            onPress={() => {
              Alert.alert(
                "Leave Quiz?",
                "Your current quiz answers won't be saved if you leave now.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Leave",
                    style: "destructive",
                    onPress: () => router.replace(ROUTES.HOME),
                  },
                ],
              );
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1B26" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="people" size={22} color="#FF2D6C" />
              <Text style={styles.headerTitle}>Couple Quiz</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              How well do you know your partner?
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.questionCard}>
            <Text style={styles.progressCounter}>
              {currentIndex + 1} / {total}
            </Text>

            <View style={styles.illustrationContainer}>
              <CoupleIllustration width={260} height={130} />
            </View>

            <Text style={styles.questionText}>{currentQuestion?.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedAnswer === option.label;

                return (
                  <Pressable
                    key={option.label}
                    style={[
                      styles.optionPill,
                      isSelected && styles.optionPillSelected,
                    ]}
                    onPress={() => handleSelectOption(option.label)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={option.label}
                  >
                    <View style={styles.optionEmojiWrap}>
                      <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#FF2D6C"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.prevButton, isFirst && styles.prevButtonDisabled]}
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
              (!selectedAnswer || isSubmitting) && styles.nextButtonDisabled,
            ]}
            onPress={handleNextOrSubmit}
            disabled={!selectedAnswer || isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={isLast ? "Submit quiz" : "Next question"}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.nextButtonText}>
                {isLast ? "Submit 💕" : "Next"}
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

      {isSubmitted && (
        <View style={styles.submittedOverlay}>
          <View style={styles.submittedCard}>
            <View style={styles.submittedIconWrap}>
              <Ionicons name="heart" size={38} color="#FF2D6C" />
            </View>
            <Text style={styles.submittedTitle}>Quiz Sent! 💕</Text>
            <Text style={styles.submittedSubtitle}>
              We&apos;ll notify you once your partner reviews your answers!
            </Text>
            <Pressable
              style={styles.submittedButton}
              onPress={() => router.replace(ROUTES.HOME)}
            >
              <Text style={styles.submittedButtonText}>Back to Home</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
