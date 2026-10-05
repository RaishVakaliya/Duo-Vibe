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
import { CoupleChallengeState } from "@/src/types";

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ state }: { state: CoupleChallengeState }) {
  // Count days where BOTH partners have completed
  const myDays = new Set(state.myCompletions.map((c) => c.day));
  const partnerDays = new Set(state.partnerCompletions.map((c) => c.day));
  const bothCompletedCount = Array.from({ length: 30 }, (_, i) => i + 1).filter(
    (d) => myDays.has(d) && partnerDays.has(d),
  ).length;
  const fillPercent = Math.min((bothCompletedCount / 30) * 100, 100);

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressLabel}>Your 30-Day Journey Together</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${fillPercent}%` }]} />
      </View>
      <Text style={styles.progressNumbers}>{bothCompletedCount} / 30 days both done</Text>
    </View>
  );
}

function DualStatusRow({
  state,
  partnerName,
  day,
}: {
  state: CoupleChallengeState;
  partnerName: string | null;
  day: number;
}) {
  const myDone = state.myCompletions.some((c) => c.day === day);
  const partnerDone = state.partnerCompletions.some((c) => c.day === day);

  return (
    <View style={styles.dualStatusRow}>
      {/* Me */}
      <View
        style={[
          styles.dualStatusPill,
          myDone ? styles.dualStatusPillDone : styles.dualStatusPillPending,
        ]}
      >
        <Ionicons
          name={myDone ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={myDone ? "#10B981" : "#94A3B8"}
        />
        <Text style={styles.dualStatusLabel}>YOU</Text>
        <Text style={myDone ? styles.dualStatusValueDone : styles.dualStatusValuePending}>
          {myDone ? "Done ✓" : "Pending"}
        </Text>
      </View>

      {/* Partner */}
      <View
        style={[
          styles.dualStatusPill,
          partnerDone ? styles.dualStatusPillDone : styles.dualStatusPillPending,
        ]}
      >
        <Ionicons
          name={partnerDone ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={partnerDone ? "#10B981" : "#94A3B8"}
        />
        <Text style={styles.dualStatusLabel}>{partnerName?.toUpperCase() ?? "PARTNER"}</Text>
        <Text style={partnerDone ? styles.dualStatusValueDone : styles.dualStatusValuePending}>
          {partnerDone ? "Done ✓" : "Pending"}
        </Text>
      </View>
    </View>
  );
}

function TodayCard({
  state,
  partnerName,
  isMarkingDone,
  onMarkDone,
}: {
  state: CoupleChallengeState;
  partnerName: string | null;
  isMarkingDone: boolean;
  onMarkDone: () => void;
}) {
  const day = state.currentDay;
  const challenge = COUPLE_CHALLENGE_BANK[day - 1];
  if (!challenge) return null;

  const myDone = state.myCompletions.some((c) => c.day === day);
  const partnerDone = state.partnerCompletions.some((c) => c.day === day);
  const bothDone = myDone && partnerDone;

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

      {/* Dual status pills */}
      <DualStatusRow state={state} partnerName={partnerName} day={day} />

      {/* Action area */}
      {bothDone ? (
        /* Both done — day fully complete */
        <View style={styles.alreadyDoneCard}>
          <Ionicons name="checkmark-circle" size={22} color="#10B981" />
          <Text style={styles.alreadyDoneText}>
            Both of you completed this! 🎉 Next day unlocked.
          </Text>
        </View>
      ) : myDone ? (
        /* I'm done, waiting for partner */
        <View style={styles.waitingBanner}>
          <Ionicons name="time-outline" size={20} color="#92400E" />
          <Text style={styles.waitingBannerText}>
            You're done! Waiting for{" "}
            {partnerName ?? "your partner"} to complete this challenge too 💕
          </Text>
        </View>
      ) : (
        /* Not done yet — show button */
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
                <Text style={styles.doneButtonText}>I did it! ✓</Text>
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
  const { loadState, challengeState, partnerName, isMarkingDone, handleMarkDone, handleRetry } =
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
  const upcomingDays = challengeState
    ? [1, 2, 3]
      .map((offset) => challengeState.currentDay + offset)
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

        {loadState === "ready" && challengeState && (
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
              <ProgressBar state={challengeState} />
            </MotiView>

            {/* Today's challenge */}
            {challengeState.currentDay <= 30 ? (
              <TodayCard
                state={challengeState}
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
                  🎉 You{"'"}ve both completed all 30 days together! Incredible.
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
