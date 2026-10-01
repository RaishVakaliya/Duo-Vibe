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
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useCoupleChallenge } from "./use-couple-challenge";
import { COUPLE_CHALLENGE_BANK } from "@/src/data/coupleChallenges";
import { isDayUnlocked } from "@/src/lib/challenge";
import { CoupleChallengeProgress } from "@/src/types";

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ progress }: { progress: CoupleChallengeProgress }) {
  const completedCount = progress.completed_days.length;
  const fillPercent = Math.min((completedCount / 30) * 100, 100);
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressLabel}>Your 30-Day Journey</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${fillPercent}%` }]} />
      </View>
      <Text style={styles.progressNumbers}>{completedCount} / 30 days done</Text>
    </View>
  );
}

function TodayCard({
  progress,
  partnerName,
  isMarkingDone,
  onMarkDone,
}: {
  progress: CoupleChallengeProgress;
  partnerName: string | null;
  isMarkingDone: boolean;
  onMarkDone: () => void;
}) {
  const day = progress.current_day;
  const challenge = COUPLE_CHALLENGE_BANK[day - 1];
  if (!challenge) return null;

  const myEntry = progress.completed_days.find((e) => e.day === day);
  const isDoneByMe = !!myEntry;
  const isDoneByPartner = isDoneByMe && partnerName
    ? myEntry.completedBy !== myEntry.completedBy // always false — checked below
    : false;

  // More accurate: if day is in completed_days, it's done by whoever pressed it.
  // Since only one row exists per day, we just show "done" state.
  const isDone = isDoneByMe;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 14 }}
      style={styles.todayCard}
    >
      <View style={styles.todayCardTopRow}>
        <View style={styles.todayDayBadge}>
          <Ionicons name="calendar" size={13} color="#FF2D6C" />
          <Text style={styles.todayDayBadgeText}>Day {day} · Today</Text>
        </View>
        <View style={styles.todayHeartIcon}>
          <Ionicons name="heart" size={16} color="#FF2D6C" />
        </View>
      </View>

      <Text style={styles.todayCardTitle}>{challenge.title}</Text>
      <Text style={styles.todayCardDescription}>{challenge.description}</Text>

      {isDone ? (
        <View style={styles.alreadyDoneCard}>
          <Ionicons name="checkmark-circle" size={22} color="#10B981" />
          <Text style={styles.alreadyDoneText}>
            {partnerName
              ? `Completed! ${partnerName} can see this too 💕`
              : "Challenge completed! 🎉"}
          </Text>
        </View>
      ) : (
        <Pressable
          style={[styles.doneButton, isMarkingDone && styles.doneButtonDisabled]}
          onPress={onMarkDone}
          disabled={isMarkingDone}
          accessibilityRole="button"
          accessibilityLabel={`Mark Day ${day} as done`}
        >
          <LinearGradient
            colors={["#FF2D6C", "#FF4D6D", "#FF758C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneGradient}
          >
            {isMarkingDone ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.doneButtonText}>Done ✓</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      )}
    </MotiView>
  );
}

function UpcomingRow({
  day,
  delay,
}: {
  day: number;
  delay: number;
}) {
  const challenge = COUPLE_CHALLENGE_BANK[day - 1];
  if (!challenge) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300, delay }}
      style={styles.upcomingCard}
    >
      <View style={styles.upcomingLeft}>
        <Text style={styles.upcomingDayLabel}>Day {day}</Text>
        <Text style={styles.upcomingDescription} numberOfLines={2}>
          {challenge.description}
        </Text>
      </View>
      <View style={styles.radioCircle} />
    </MotiView>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function CoupleChallengeScreen() {
  const router = useRouter();
  const { loadState, progress, partnerName, isMarkingDone, handleMarkDone, handleRetry } =
    useCoupleChallenge();

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        router.replace(ROUTES.HOME);
        return true;
      });
      return () => sub.remove();
    }, [router]),
  );

  // Upcoming days: next 3 after current_day (capped at 30)
  const upcomingDays =
    progress
      ? [1, 2, 3]
          .map((offset) => progress.current_day + offset)
          .filter((d) => d <= 30)
      : [];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* ── Header ─────────────────────────────────────────────────── */}
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
              <Ionicons name="calendar" size={22} color="#10B981" />
              <Text style={styles.headerTitle}>Couple Challenge</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Daily challenges to strengthen your bond
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* ── Content ────────────────────────────────────────────────── */}
        {loadState === "loading" && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#FF2D6C" />
          </View>
        )}

        {loadState === "error" && (
          <View style={styles.centeredContainer}>
            <Ionicons name="cloud-offline-outline" size={52} color="#CBD5E1" />
            <Text style={styles.errorText}>
              Couldn{"'"}t load your challenge progress. Check your connection and try again.
            </Text>
            <Pressable
              style={styles.actionButton}
              onPress={handleRetry}
              accessibilityRole="button"
              accessibilityLabel="Retry loading challenges"
            >
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {loadState === "no_partner" && (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingTop: 20 }]}
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 14 }}
              style={styles.blockingCard}
            >
              <View style={styles.blockingIconWrap}>
                <Ionicons name="heart-dislike-outline" size={36} color="#FF2D6C" />
              </View>
              <Text style={styles.blockingTitle}>Link Your Partner First</Text>
              <Text style={styles.blockingText}>
                Couple Challenges are a shared journey — you need your partner linked to start the 30-day experience together.
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
            </MotiView>
          </ScrollView>
        )}

        {loadState === "ready" && progress && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Progress bar */}
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 350 }}
            >
              <ProgressBar progress={progress} />
            </MotiView>

            {/* Today's challenge */}
            {progress.current_day <= 30 ? (
              <TodayCard
                progress={progress}
                partnerName={partnerName}
                isMarkingDone={isMarkingDone}
                onMarkDone={handleMarkDone}
              />
            ) : (
              /* All 30 days complete */
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 14 }}
                style={styles.alreadyDoneCard}
              >
                <Ionicons name="trophy" size={28} color="#10B981" />
                <Text style={styles.alreadyDoneText}>
                  🎉 You{"'"}ve completed all 30 days together! Incredible.
                </Text>
              </MotiView>
            )}

            {/* Upcoming locked rows */}
            {upcomingDays.map((day, idx) => (
              <UpcomingRow key={day} day={day} delay={idx * 60} />
            ))}

            {/* View all button */}
            <Pressable
              style={styles.viewAllButton}
              onPress={() => router.push(ROUTES.COUPLE_CHALLENGE_ALL)}
              accessibilityRole="button"
              accessibilityLabel="View all 30 challenges"
            >
              <Ionicons name="list" size={18} color="#FF2D6C" />
              <Text style={styles.viewAllText}>View All Challenges</Text>
              <Ionicons name="chevron-forward" size={16} color="#FF2D6C" />
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
