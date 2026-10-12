import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ResultCardProps } from "../types";
import { styles } from "../styles";

import { formatShortDate } from "@/src/utils/date";

export const ResultCard = React.memo(function ResultCard({
  memory,
  index,
  onPress,
  onToggleReaction,
}: ResultCardProps) {
  const rotation = index % 2 === 0 ? "1.5deg" : "-1.5deg";

  const handleHeartPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleReaction(memory);
  };

  const handleCardPress = () => {
    Haptics.selectionAsync();
    onPress(memory);
  };

  const formattedDate = formatShortDate(memory.memory_date);

  const payload = memory.payload || {};
  const score =
    payload.score !== undefined
      ? `${payload.score}%`
      : payload.overall !== undefined
      ? `${payload.overall}%`
      : payload.headline
      ? String(payload.headline)
      : null;

  const resultTypeLabel =
    payload.type === "love_match"
      ? "Love Match"
      : payload.type === "quiz"
      ? "Couple Quiz"
      : payload.type === "questions_21"
      ? "21 Questions"
      : "Milestone";

  return (
    <View style={styles.cardWrapper}>
      <Pressable
        style={[styles.resultCard, { transform: [{ rotate: rotation }] }]}
        onPress={handleCardPress}
        accessibilityRole="button"
        accessibilityLabel={`Result Memory: ${memory.title}`}
      >
        <LinearGradient
          colors={["#E11D48", "#BE123C", "#881337"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.resultCardGradient}
        >
          <View style={styles.resultHeaderRow}>
            <View style={styles.resultBadge}>
              <Ionicons name="sparkles" size={13} color="#FFFFFF" />
              <Text style={styles.resultBadgeText}>{resultTypeLabel}</Text>
            </View>
            <Text style={styles.resultDate}>{formattedDate}</Text>
          </View>

          <Text style={styles.resultTitle} numberOfLines={2}>
            {memory.title}
          </Text>

          {score && (
            <View style={styles.resultScoreBanner}>
              <Text style={styles.resultScoreText}>{score}</Text>
              <Text style={styles.resultScoreSubtext}>
                {typeof payload.headline === "string" && payload.headline !== score
                  ? payload.headline
                  : "Couple Chemistry Score"}
              </Text>
            </View>
          )}

          {memory.note ? (
            <Text
              style={{
                fontFamily: "Fredoka_400Regular",
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.85)",
                marginVertical: 4,
              }}
              numberOfLines={2}
            >
              {memory.note}
            </Text>
          ) : null}

          <View style={styles.resultFooter}>
            <Text style={styles.resultCreatorName} numberOfLines={1}>
              Saved by {memory.creator?.fullName?.split(" ")[0] || "Partner"}
            </Text>

            <Pressable
              style={styles.resultHeartButton}
              onPress={handleHeartPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="React with heart"
            >
              <Ionicons
                name={memory.has_reacted ? "heart" : "heart-outline"}
                size={16}
                color="#FFFFFF"
              />
              {memory.reactions_count > 0 && (
                <Text style={styles.resultHeartCount}>
                  {memory.reactions_count}
                </Text>
              )}
            </Pressable>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
});
