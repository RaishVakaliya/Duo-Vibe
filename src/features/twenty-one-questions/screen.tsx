import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  BackHandler,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { ROUTES } from "@/src/constants/routes";
import { GRADIENTS } from "@/src/constants/colors";
import { useTwentyOneQuestions } from "./use-twenty-one-questions";
import { TwentyOneQuestionsReveal } from "@/src/types";
import { useAuth } from "@/src/context/auth-context";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { ScreenState } from "@/src/components/ui/screen-state";
import { LinkPartnerPrompt } from "@/src/components/ui/link-partner-prompt";
import { getPartnerId } from "@/src/lib/quiz";
import { getCoupleKey } from "@/src/lib/couple/get-couple-key";
import { createResultMemory } from "@/src/lib/memories";

const TOTAL = 21;

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Shows the reveal panel for the current question when BOTH partners have answered.
 * Displays each answer side by side.
 */
function RevealPanel({
  reveal,
  partnerLabel,
}: {
  reveal: TwentyOneQuestionsReveal;
  partnerLabel: string;
}) {
  return (
    <View style={styles.revealRow}>
      {/* Me */}
      <View style={[styles.revealPill, styles.revealPillMe]}>
        <Text style={styles.revealPillLabel}>YOU</Text>
        {reveal.myAnswer ? (
          <Text style={styles.revealPillAnswer}>{reveal.myAnswer}</Text>
        ) : (
          <Text style={styles.revealPillPending}>Not answered</Text>
        )}
      </View>

      {/* Partner */}
      <View style={[styles.revealPill, styles.revealPillPartner]}>
        <Text style={styles.revealPillLabel}>{partnerLabel.toUpperCase()}</Text>
        {reveal.partnerAnswer ? (
          <Text style={styles.revealPillAnswer}>{reveal.partnerAnswer}</Text>
        ) : (
          <Text style={styles.revealPillPending}>Waiting... 💭</Text>
        )}
      </View>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function TwentyOneQuestionsScreen() {
  const router = useRouter();
  const {
    loadState,
    reveals,
    currentIndex,
    myAnswerCount,
    partnerAnswerCount,
    selectedAnswer,
    isSubmitting,
    handleSelectOption,
    handleNext,
    handlePrevious,
    handleRetry,
  } = useTwentyOneQuestions();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [router]),
  );

  const currentReveal = reveals[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === reveals.length - 1;
  const progressFraction = reveals.length > 0 ? (currentIndex + 1) / reveals.length : 0;

  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveToMemories = async (): Promise<void> => {
    if (isSaved || isSaving) return;
    if (!user) {
      showAlert({
        title: "Sign in Required",
        message: "Please sign in to save memories.",
      });
      return;
    }
    setIsSaving(true);
    try {
      const partnerId = await getPartnerId(user.id);
      if (!partnerId) {
        showAlert({
          title: "Partner Required",
          message: "Connect with a partner to save shared memories.",
        });
        setIsSaving(false);
        return;
      }
      const coupleKey = getCoupleKey(user.id, partnerId);
      await createResultMemory({
        coupleKey,
        userId: user.id,
        title: "21 Questions Completed",
        note: "Completed all 21 questions together! 🎉",
        payload: {
          type: "questions_21",
          score: 21,
          overall: 100,
          headline: "21 Questions Completed",
        },
      });
      setIsSaved(true);
    } catch (err: unknown) {
      console.warn("Save to memories error:", err);
      showAlert({
        title: "Save Failed",
        message: err instanceof Error ? err.message : "Failed to save to memories.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loadState === "loading") {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
          locations={[0, 0.5, 1]}
          style={styles.gradientBackground}
        />
        <ScreenState
          variant="loading"
          theme="light"
          message="Loading your shared session…"
        />
      </View>
    );
  }

  // ── No partner ──────────────────────────────────────────────────────────
  if (loadState === "no_partner") {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient
          colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
          locations={[0, 0.5, 1]}
          style={styles.gradientBackground}
        />
        <SafeAreaView style={styles.safeArea}>
          <ScreenHeader
            title="21 Questions"
            align="center"
            theme="light"
            titleIcon={<Ionicons name="chatbubbles" size={24} color="#FF2D6C" />}
            onBack={() => router.replace(ROUTES.HOME)}
          />
          <LinkPartnerPrompt
            theme="light"
            title="Link Your Partner First"
            description="21 Questions is a shared experience — connect with your partner first to play together."
          />
        </SafeAreaView>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (loadState === "error") {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient
          colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
          locations={[0, 0.5, 1]}
          style={styles.gradientBackground}
        />
        <ScreenState
          variant="error"
          theme="light"
          message="Couldn't load your session. Check your connection and try again."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  // ── Ready ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <ScreenHeader
          title="21 Questions"
          subtitle="Answer together — see each other's replies revealed"
          align="center"
          theme="light"
          titleIcon={<Ionicons name="chatbubbles" size={24} color="#FF2D6C" />}
          onBack={() => router.replace(ROUTES.HOME)}
        />

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <MotiView
              animate={{ width: `${progressFraction * 100}%` }}
              transition={{ type: "timing", duration: 300 }}
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

        {/* Answer count chips */}
        <View style={styles.answerCountRow}>
          <View style={styles.answerCountChip}>
            <Ionicons name="person" size={13} color="#FF2D6C" />
            <Text style={styles.answerCountText}>
              You {myAnswerCount}/{TOTAL}
            </Text>
          </View>
          <Text style={styles.answerCountDot}>·</Text>
          <View style={styles.answerCountChip}>
            <Ionicons name="heart" size={13} color="#FF2D6C" />
            <Text style={styles.answerCountText}>
              Partner {partnerAnswerCount}/{TOTAL}
            </Text>
          </View>
        </View>

        {/* Question card */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentReveal && (
            <MotiView
              key={currentReveal.questionId}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", damping: 16 }}
              style={styles.questionCard}
            >
              <Text style={styles.progressCounter}>
                {currentIndex + 1} / {reveals.length}
              </Text>
              <Text style={styles.questionText}>{currentReveal.question}</Text>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {currentReveal.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  return (
                    <Pressable
                      key={option}
                      style={[
                        styles.optionPill,
                        isSelected && styles.optionPillSelected,
                        isSubmitting && { opacity: 0.6 },
                      ]}
                      onPress={() => handleSelectOption(option)}
                      disabled={isSubmitting}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={option}
                    >
                      <View style={styles.optionIcon}>
                        <Ionicons
                          name={isSelected ? "radio-button-on" : "radio-button-off"}
                          size={18}
                          color={isSelected ? "#FF2D6C" : "#374151"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Reveal panel — show partner's answer once both have answered */}
              {currentReveal.bothAnswered && (
                <RevealPanel
                  reveal={currentReveal}
                  partnerLabel="Partner"
                />
              )}

              {/* Waiting hint — I answered but partner hasn't */}
              {currentReveal.myAnswer && !currentReveal.partnerAnswer && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 12,
                    backgroundColor: "#FFF7ED",
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#FED7AA",
                  }}
                >
                  <Ionicons name="time-outline" size={18} color="#92400E" />
                  <Text
                    style={{
                      fontFamily: "Fredoka_600SemiBold",
                      fontSize: 13,
                      color: "#92400E",
                      flex: 1,
                    }}
                  >
                    You{"'"}ve answered! Waiting for your partner{"'"}s reply to reveal both answers 💕
                  </Text>
                </View>
              )}
            </MotiView>
          )}
        </ScrollView>

        {isLast && (
          <Pressable
            style={[
              styles.saveMemoryButton,
              isSaved && styles.saveMemoryButtonSaved,
            ]}
            onPress={handleSaveToMemories}
            disabled={isSaved || isSaving}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "Saved to Memories" : "Save to Memories"}
          >
            <Ionicons
              name={isSaved ? "checkmark-circle" : "sparkles"}
              size={18}
              color={isSaved ? "#059669" : "#FF2D55"}
            />
            <Text
              style={[
                styles.saveMemoryButtonText,
                isSaved && styles.saveMemoryButtonTextSaved,
              ]}
            >
              {isSaved
                ? "Saved to Memories"
                : isSaving
                  ? "Saving to Memories..."
                  : "Save to Memories"}
            </Text>
          </Pressable>
        )}

        {/* Footer nav */}
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
              !selectedAnswer && styles.nextButtonDisabled,
            ]}
            onPress={isLast ? () => router.replace(ROUTES.HOME) : handleNext}
            disabled={!selectedAnswer}
            accessibilityRole="button"
            accessibilityLabel={isLast ? "Finish" : "Next question"}
          >
            <LinearGradient
              colors={
                selectedAnswer
                  ? [...GRADIENTS.primaryAction]
                  : [...GRADIENTS.buttonDisabled]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {isLast ? "Finish 🎉" : "Next"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
