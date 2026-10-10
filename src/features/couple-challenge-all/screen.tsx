import React, { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { ROUTES } from "@/src/constants/routes";
import { useCoupleChallengeAll } from "./use-couple-challenge-all";
import { COUPLE_CHALLENGE_BANK, CoupleChallenge } from "@/src/data/coupleChallenges";
import { CoupleChallengeProgress } from "@/src/types";

// ─── Row item ─────────────────────────────────────────────────────────────────

interface RowData extends CoupleChallenge {
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

function ChallengeRow({ item }: { item: RowData }) {
  const { day, title, description, isCompleted, isCurrent, isLocked } = item;

  const rowStyle = [
    styles.rowItem,
    isCompleted && styles.rowItemCompleted,
    isCurrent && styles.rowItemCurrent,
    isLocked && styles.rowItemLocked,
  ];

  const circleStyle = [
    styles.dayCircle,
    isCompleted && styles.dayCircleCompleted,
    isCurrent && styles.dayCircleCurrent,
    isLocked && styles.dayCircleLocked,
  ];

  const numberStyle = [
    styles.dayNumber,
    isCompleted && styles.dayNumberCompleted,
    isCurrent && styles.dayNumberCurrent,
    isLocked && styles.dayNumberLocked,
  ];

  return (
    <View style={rowStyle} accessibilityLabel={`Day ${day}: ${title}`}>
      {/* Day circle */}
      <View style={circleStyle}>
        {isCompleted ? (
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        ) : isLocked ? (
          <Ionicons name="lock-closed" size={14} color="#94A3B8" />
        ) : (
          <Text style={numberStyle}>{day}</Text>
        )}
      </View>

      {/* Text group */}
      <View style={styles.rowTextGroup}>
        <Text style={[styles.rowTitle, isLocked && styles.rowTitleLocked]}>
          {title}
        </Text>
        <Text
          style={[styles.rowDescription, isLocked && styles.rowDescriptionLocked]}
          numberOfLines={isLocked ? 1 : 3}
        >
          {isLocked ? "Unlocks after completing Day " + (day - 1) : description}
        </Text>
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Today</Text>
          </View>
        )}
      </View>

      {/* Status icon */}
      <View style={styles.statusIcon}>
        {isCompleted && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
        {isCurrent && <Ionicons name="ellipse" size={14} color="#FF2D6C" />}
        {isLocked && <Ionicons name="lock-closed-outline" size={18} color="#CBD5E1" />}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

function buildRowData(
  progress: CoupleChallengeProgress | null,
): RowData[] {
  return COUPLE_CHALLENGE_BANK.map((challenge) => {
    if (!progress) {
      return { ...challenge, isCompleted: false, isCurrent: false, isLocked: true };
    }
    const isCompleted = progress.completed_days.some((e) => e.day === challenge.day);
    const isCurrent = challenge.day === progress.current_day;
    const unlocked = challenge.day <= progress.current_day;
    const isLocked = !isCompleted && !isCurrent && !unlocked;
    return { ...challenge, isCompleted, isCurrent, isLocked };
  });
}

export default function CoupleChallengeAllScreen() {
  const router = useRouter();
  const { loadState, progress, handleRetry } = useCoupleChallengeAll();

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        router.back();
        return true;
      });
      return () => sub.remove();
    }, [router]),
  );

  const rows = buildRowData(progress);

  const handleRowPress = (item: RowData) => {
    if (item.isLocked) {
      Alert.alert(
        "Locked 🔒",
        `This challenge unlocks 24 hours after you complete Day ${item.day - 1}.`,
        [{ text: "Got it" }],
      );
    }
    // Completed and current rows are informational — no navigation needed
  };

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
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1B26" />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>All Challenges</Text>
            <Text style={styles.headerSubtitle}>30-day couple journey</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* ── States ─────────────────────────────────────────────────── */}
        {loadState === "loading" && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#FF2D6C" />
          </View>
        )}

        {loadState === "error" && (
          <View style={styles.centeredContainer}>
            <Ionicons name="cloud-offline-outline" size={52} color="#CBD5E1" />
            <Text style={styles.errorText}>
              Couldn{"'"}t load challenge data. Check your connection.
            </Text>
            <Pressable
              style={styles.retryButton}
              onPress={handleRetry}
              accessibilityRole="button"
              accessibilityLabel="Retry"
            >
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {(loadState === "ready" || loadState === "no_partner") && (
          <FlatList
            data={rows}
            keyExtractor={(item) => String(item.day)}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleRowPress(item)}>
                <ChallengeRow item={item} />
              </Pressable>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
