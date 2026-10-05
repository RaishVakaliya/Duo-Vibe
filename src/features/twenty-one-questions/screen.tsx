import React, { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
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

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loadState === "loading") {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
          locations={[0, 0.5, 1]}
          style={styles.gradientBackground}
        />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#FF2D6C" />
          <Text style={styles.errorText}>Loading your shared session…</Text>
        </View>
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
                <Ionicons name="chatbubbles" size={24} color="#FF2D6C" />
                <Text style={styles.headerTitle}>21 Questions</Text>
              </View>
            </View>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.centeredContainer}>
            <View style={styles.blockingCard}>
              <View style={styles.blockingIconWrap}>
                <Ionicons name="heart-dislike-outline" size={36} color="#FF2D6C" />
              </View>
              <Text style={styles.blockingTitle}>Link Your Partner First</Text>
              <Text style={styles.blockingText}>
                21 Questions is a shared experience — connect with your partner first to play together.
              </Text>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push(ROUTES.INVITE_PARTNER)}
                accessibilityRole="button"
                accessibilityLabel="Invite or connect partner"
              >
                <Ionicons name="link-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Invite / Connect Partner</Text>
              </Pressable>
            </View>
          </View>
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
        <View style={styles.centeredContainer}>
          <Ionicons name="cloud-offline-outline" size={52} color="#CBD5E1" />
          <Text style={styles.errorText}>
            Couldn{"'"}t load your session. Check your connection and try again.
          </Text>
          <Pressable
            style={styles.actionButton}
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Retry"
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Try Again</Text>
          </Pressable>
        </View>
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
              <Ionicons name="chatbubbles" size={24} color="#FF2D6C" />
              <Text style={styles.headerTitle}>21 Questions</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Answer together — see each other's replies revealed
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

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
