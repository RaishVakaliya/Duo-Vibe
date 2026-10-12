import React, { useState, useEffect, useCallback } from "react";
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
import { styles } from "./styles";
import { ROUTES } from "@/src/constants/routes";
import { usePartnerGuard } from "@/src/hooks/use-partner-guard";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { LinkPartnerPrompt } from "@/src/components/ui/link-partner-prompt";
import { GradientButton } from "@/src/components/ui/gradient-button";
import { CoupleIllustration } from "@/src/components/couple-illustration";
import {
  selectQuizQuestions,
  createQuizSession,
  getActiveAnswererSession,
  subscribeToSessionUpdates,
} from "@/src/lib/quiz";
import { QuizSession } from "@/src/types";

export default function CoupleQuizStartScreen() {
  const router = useRouter();
  const { user, hasPartner, partnerId } = usePartnerGuard();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const loadSessionState = useCallback(async () => {
    if (!user || !hasPartner) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const pending = await getActiveAnswererSession(user.id);
      setActiveSession(pending);
    } catch (err: unknown) {
      console.warn("Failed to check active quiz session:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, hasPartner]);

  useEffect(() => {
    loadSessionState();
  }, [loadSessionState]);

  useEffect(() => {
    if (!activeSession) return;

    const unsubscribe = subscribeToSessionUpdates(
      activeSession.id,
      (updatedSession) => {
        if (updatedSession.status === "completed") {
          router.replace({
            pathname: ROUTES.COUPLE_QUIZ_RESULT,
            params: { sessionId: updatedSession.id },
          });
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [activeSession, router]);

  const handleStartQuiz = async () => {
    if (!user) return;
    try {
      setIsStarting(true);
      setErrorMessage(null);

      const targetPartnerId = partnerId;
      if (!targetPartnerId) {
        setErrorMessage(
          "Could not detect your partner. Please verify your partner connection.",
        );
        return;
      }

      const questions = selectQuizQuestions();
      const sessionId = await createQuizSession(user.id, targetPartnerId, questions);

      router.replace({
        pathname: ROUTES.COUPLE_QUIZ_PLAY,
        params: {
          sessionId,
          questions: JSON.stringify(questions),
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start quiz.";
      setErrorMessage(message);
    } finally {
      setIsStarting(false);
    }
  };

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
          title="Couple Quiz"
          subtitle="How well do you know your partner?"
          align="center"
          theme="light"
          titleIcon={<Ionicons name="people" size={22} color="#FF2D6C" />}
          onBack={() => router.replace(ROUTES.HOME)}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={[styles.mainCard, { paddingVertical: 48 }]}>
              <ActivityIndicator size="large" color="#FF2D6C" />
            </View>
          ) : !hasPartner ? (
            <LinkPartnerPrompt
              theme="light"
              style={{ paddingHorizontal: 0 }}
              title="Link Your Partner First"
              description="Link your partner first to play Couple Quiz together and test how well you know each other!"
            />
          ) : activeSession ? (
            <View style={styles.blockingCard}>
              <View style={styles.pendingPulseBadge}>
                <Ionicons name="time" size={14} color="#FF2D6C" />
                <Text style={styles.pendingPulseText}>Review Pending</Text>
              </View>

              <View style={styles.blockingIconWrap}>
                <Ionicons name="hourglass-outline" size={36} color="#FF2D6C" />
              </View>

              <Text style={styles.blockingTitle}>
                Waiting for Partner Review
              </Text>
              <Text style={styles.blockingText}>
                Waiting for your partner to review your quiz. You will receive
                a notification as soon as they finish grading your answers.
              </Text>

              <Pressable
                style={[styles.actionButton, { backgroundColor: "#1E1B26" }]}
                onPress={() => router.replace(ROUTES.HOME)}
              >
                <Ionicons name="home-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Return to Home</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.mainCard}>
              <View style={styles.illustrationWrap}>
                <CoupleIllustration width={280} height={145} />
              </View>

              <Text style={styles.cardTitle}>Couple Connection Quiz</Text>
              <Text style={styles.cardDescription}>
                Answer 10 multiple-choice questions about your partner. When you
                finish, your partner will review your answers to reveal your
                score!
              </Text>

              {errorMessage && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={18} color="#B91C1C" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              <View style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name="sparkles" size={18} color="#FF2D6C" />
                </View>
                <Text style={styles.featureText}>
                  10 curated questions across habits, preferences & dreams
                </Text>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name="checkmark-done" size={18} color="#FF2D6C" />
                </View>
                <Text style={styles.featureText}>
                  Interactive partner review & scored results
                </Text>
              </View>

              <GradientButton
                label="Start Quiz"
                loading={isStarting}
                disabled={isStarting}
                rightIcon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
                onPress={handleStartQuiz}
                accessibilityLabel="Start Quiz"
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
