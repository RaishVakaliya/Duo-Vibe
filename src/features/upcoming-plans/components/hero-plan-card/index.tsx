import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { HeroPlanCardProps } from "./types";
import { styles } from "./styles";

import { formatCountdown, formatPlanDate } from "@/src/utils/date";

export const HeroPlanCard: React.FC<HeroPlanCardProps> = ({
  plan,
  onMarkDone,
  onDelete,
  canDelete = false,
}) => {
  const countdownLabel = formatCountdown(plan.starts_at);
  const formattedDate = formatPlanDate(plan.starts_at, plan.all_day);

  return (
    <LinearGradient
      colors={[COLORS.primary, "#FF758F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.countdownBadge}>
          <Ionicons name="time-outline" size={14} color={COLORS.white} />
          <Text style={styles.countdownText}>{countdownLabel}</Text>
        </View>

        <View style={styles.kindBadge}>
          <Ionicons
            name={
              plan.kind === "date"
                ? "wine-outline"
                : plan.kind === "trip"
                  ? "airplane-outline"
                  : plan.kind === "birthday"
                    ? "gift-outline"
                    : plan.kind === "anniversary"
                      ? "heart-outline"
                      : plan.kind === "call"
                        ? "call-outline"
                        : "calendar-outline"
            }
            size={13}
            color={COLORS.white}
          />
          <Text style={styles.kindText}>{plan.kind}</Text>
        </View>
      </View>

      <Text style={styles.title}>{plan.title}</Text>

      {Boolean(plan.note) && <Text style={styles.noteText}>{plan.note}</Text>}

      <View style={styles.dateRow}>
        <Ionicons name="calendar" size={15} color={COLORS.white} />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.actionsRow}>
        {plan.is_local_only ? (
          <View style={styles.privateBadge}>
            <Ionicons name="lock-closed" size={12} color={COLORS.white} />
            <Text style={styles.privateText}>Only you see this</Text>
          </View>
        ) : (
          <Pressable
            style={styles.markDoneButton}
            onPress={() => onMarkDone(plan.id)}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={COLORS.primaryDark}
            />
            <Text style={styles.markDoneText}>Mark as Done</Text>
          </Pressable>
        )}

        {!plan.is_local_only && canDelete && onDelete && (
          <Pressable
            style={styles.deleteButton}
            onPress={() => onDelete(plan.id)}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.white} />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
};
