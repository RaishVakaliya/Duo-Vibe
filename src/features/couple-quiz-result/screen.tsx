import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { ScreenState } from "@/src/components/ui/screen-state";
import { withTimeout } from "@/src/utils/async";
import { styles } from "./styles";
import { ROUTES } from "@/src/constants/routes";

import { GRADIENTS } from "@/src/constants/colors";
import {
  getSessionForReview,
  subscribeToSessionUpdates,
  ReviewSessionData,
  getScoreHeadline,
  getPartnerId,
} from "@/src/lib/quiz";
import { useAuth } from "@/src/context/auth-context";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { buildCoupleKey } from "@/src/lib/challenge";
import { createResultMemory } from "@/src/lib/memories";

export default function CoupleQuizResultScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const params = useLocalSearchParams<{ sessionId?: string; score?: string }>();
  const sessionId = params.sessionId ?? "";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<ReviewSessionData | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace(ROUTES.HOME);
        }
        return true;
      };
      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => sub.remove();
    }, [router]),
  );

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    const cleanId = typeof sessionId === "string" ? sessionId.trim() : "";
    if (!cleanId) {
      if (isMountedRef.current) setIsLoading(false);
      return;
    }
    try {
      if (isMountedRef.current) setIsLoading(true);
      const data = await withTimeout(getSessionForReview(cleanId), 15000);
      if (isMountedRef.current) setSessionData(data);
    } catch (err) {
      console.warn("Error loading result session:", err);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [sessionId]);


  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!sessionId) return;
    if (sessionData && sessionData.session.status === "completed") return;

    const unsubscribe = subscribeToSessionUpdates(sessionId, (updated) => {
      if (updated.status === "completed") {
        loadData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [sessionId, sessionData, loadData]);

  const answers = sessionData?.answers ?? [];
  const total = answers.length || 10;
  const isCompleted = sessionData?.session.status === "completed";

  const correctCount = answers.filter((a) => a.is_correct === true).length;
  const score = sessionData?.session.score ?? correctCount;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const headline = getScoreHeadline(percentage);

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
      const coupleKey = buildCoupleKey(user.id, partnerId);
      await createResultMemory({
        coupleKey,
        userId: user.id,
        title: "Couple Quiz Result",
        note: `Scored ${score}/${total} (${percentage}%) - ${headline}`,
        payload: {
          type: "quiz",
          score,
          overall: percentage,
          headline: `${score}/${total} (${percentage}%)`,
        },
      });
      setIsSaved(true);
    } catch (err: unknown) {
      console.warn("Save to memories error:", err);
      showAlert({
        title: "Save Failed",
        message: err instanceof Error ? err.message : "Failed to save quiz result.",
      });
    } finally {
      setIsSaving(false);
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
          title="Quiz Results"
          subtitle={
            isCompleted
              ? "Here is how you scored!"
              : "Awaiting partner review"
          }
          align="center"
          theme="light"
          titleIcon={<Ionicons name="trophy" size={22} color="#FF2D6C" />}
          onBack={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace(ROUTES.HOME);
            }
          }}
        />

        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#FF2D6C" />
          </View>
        ) : !sessionId || !sessionData ? (
          <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <ScreenState
              variant="empty"
              title="Quiz Session Not Found"
              message="We couldn't find this quiz session. It may have expired or was removed."
              actionLabel="Go to Home"
              onAction={() => router.replace(ROUTES.HOME)}
              theme="light"
            />
          </View>
        ) : !isCompleted ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.waitingCard}>
              <ActivityIndicator size="large" color="#FF2D6C" />
              <Text style={styles.waitingTitle} maxFontSizeMultiplier={1.2}>
                Waiting for Partner Review 💕
              </Text>
              <Text style={styles.waitingText} maxFontSizeMultiplier={1.2}>
                Your partner hasn&apos;t graded the quiz yet. This screen will
                automatically update as soon as they finish!
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.scoreHeroCard}>
              <View style={styles.trophyIconWrap}>
                <Ionicons name="heart" size={42} color="#FF2D6C" />
              </View>

              <Text style={styles.scoreFraction}>
                {score} / {total}
              </Text>
              <Text style={styles.scorePercentage}>{percentage}% Match</Text>

              <Text style={styles.scoreHeadline}>{headline.title}</Text>
              <Text style={styles.scoreDescription}>{headline.desc}</Text>
            </View>

            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Question Breakdown</Text>

              <View style={styles.breakdownList}>
                {answers.map((item, idx) => {
                  const isCorrect = item.is_correct === true;
                  const matchingOption = item.question?.options.find(
                    (o) => o.label === item.guessed_option,
                  );

                  return (
                    <View key={item.id || idx} style={styles.breakdownItem}>
                      <View
                        style={[
                          styles.statusBadge,
                          isCorrect
                            ? styles.statusBadgeCorrect
                            : styles.statusBadgeWrong,
                        ]}
                      >
                        <Ionicons
                          name={isCorrect ? "checkmark" : "close"}
                          size={18}
                          color={isCorrect ? "#10B981" : "#EF4444"}
                        />
                      </View>

                      <View style={styles.breakdownItemContent}>
                        <Text style={styles.breakdownItemQuestion}>
                          {item.question?.question ?? `Question ${idx + 1}`}
                        </Text>
                        <View style={styles.breakdownItemGuessRow}>
                          <Text style={styles.breakdownItemGuessLabel}>
                            Guessed:
                          </Text>
                          <Text style={styles.breakdownItemGuessText}>
                            {matchingOption?.emoji
                              ? `${matchingOption.emoji} `
                              : ""}
                            {item.guessed_option}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}

        <View style={styles.footer}>
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

          <Pressable
            style={styles.doneButton}
            onPress={() => router.replace(ROUTES.HOME)}
            accessibilityRole="button"
            accessibilityLabel="Done"
          >
            <LinearGradient
              colors={[...GRADIENTS.primaryAction]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.doneButtonGradient}
            >
              <Text style={styles.doneButtonText}>Done</Text>
              <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
