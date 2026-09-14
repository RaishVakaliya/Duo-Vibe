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
import { useAuth } from "@/src/context/auth";
import { CoupleIllustration } from "@/src/components/couple-illustration";
import {
  selectQuizQuestions,
  createQuizSession,
  getActiveAnswererSession,
  getPartnerId,
  subscribeToSessionUpdates,
} from "@/src/lib/quizSession";
import { QuizSession } from "@/src/types";

export default function CoupleQuizStartScreen() {
  const router = useRouter();
  const { user, hasPartner } = useAuth();

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

      const partnerId = await getPartnerId(user.id);
      if (!partnerId) {
        setErrorMessage(
          "Could not detect your partner. Please verify your partner connection.",
        );
        return;
      }

      const questions = selectQuizQuestions();
      const sessionId = await createQuizSession(user.id, partnerId, questions);

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
              <Ionicons name="people" size={22} color="#FF2D6C" />
              <Text style={styles.headerTitle}>Couple Quiz</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              How well do you know your partner?
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={[styles.mainCard, { paddingVertical: 48 }]}>
              <ActivityIndicator size="large" color="#FF2D6C" />
            </View>
          ) : !hasPartner ? (
            <View style={styles.blockingCard}>
              <View style={styles.blockingIconWrap}>
                <Ionicons
                  name="heart-dislike-outline"
                  size={36}
                  color="#FF2D6C"
                />
              </View>
              <Text style={styles.blockingTitle}>Link Your Partner First</Text>
              <Text style={styles.blockingText}>
                Link your partner first to play Couple Quiz together and test
                how well you know each other!
              </Text>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push(ROUTES.INVITE_PARTNER)}
              >
                <Ionicons name="link-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>
                  Invite / Connect Partner
                </Text>
              </Pressable>
            </View>
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
                Waiting for your partner to review your last quiz. We&apos;ll
                notify you as soon as they grade your answers! 💕
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

              <Text style={styles.cardTitle}>Test Your Connection 💕</Text>
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

              <Pressable
                style={[
                  styles.actionButton,
                  isStarting && styles.actionButtonDisabled,
                ]}
                onPress={handleStartQuiz}
                disabled={isStarting}
                accessibilityRole="button"
                accessibilityLabel="Start Quiz"
              >
                {isStarting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.actionButtonText}>Start Quiz</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </>
                )}
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
