import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { PlanRowCardProps } from "./types";
import { styles } from "./styles";

export const PlanRowCard: React.FC<PlanRowCardProps> = ({
  plan,
  currentUserId,
  onToggleDone,
  onDelete,
  onSaveToMemories,
}) => {
  const isDone = Boolean(plan.done_at);
  const canDelete = !plan.is_local_only && plan.created_by === currentUserId;

  const startsAt = new Date(plan.starts_at);
  const formattedDate = startsAt.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(plan.all_day
      ? {}
      : { hour: "numeric", minute: "2-digit" }),
  });

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.mainRow}>
        <View style={styles.leftCol}>
          {plan.is_local_only ? (
            <View style={styles.checkCircle}>
              <Ionicons
                name="lock-closed"
                size={12}
                color="rgba(255, 255, 255, 0.4)"
              />
            </View>
          ) : (
            <Pressable
              style={[styles.checkCircle, isDone && styles.checkCircleDone]}
              onPress={() => onToggleDone(plan.id, isDone)}
            >
              {isDone && (
                <Ionicons name="checkmark" size={14} color={COLORS.white} />
              )}
            </Pressable>
          )}

          <View style={styles.textContent}>
            <Text style={[styles.titleText, isDone && styles.titleTextDone]}>
              {plan.title}
            </Text>
            <Text style={styles.dateTimeText}>{formattedDate}</Text>
            {Boolean(plan.note) && (
              <Text style={styles.noteText} numberOfLines={2}>
                {plan.note}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightCol}>
          {plan.is_local_only ? (
            <View style={styles.privateBadge}>
              <Ionicons
                name="lock-closed"
                size={10}
                color="rgba(255, 255, 255, 0.6)"
              />
              <Text style={styles.privateText}>Only you see this</Text>
            </View>
          ) : (
            <View style={styles.kindBadge}>
              <Text style={styles.kindBadgeText}>{plan.kind}</Text>
            </View>
          )}

          {canDelete && onDelete && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => onDelete(plan.id)}
              hitSlop={8}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color="rgba(255, 255, 255, 0.35)"
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* When a plan is done: offer Save to Memories */}
      {isDone && !plan.is_local_only && onSaveToMemories && (
        <View style={styles.memoriesCtaRow}>
          <Pressable
            style={styles.memoriesButton}
            onPress={() => onSaveToMemories(plan)}
          >
            <Ionicons name="images-outline" size={14} color={COLORS.primary} />
            <Text style={styles.memoriesButtonText}>Save to Memories</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
