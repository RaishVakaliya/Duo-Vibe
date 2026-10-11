import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FlagStatement, CATEGORY_META } from "@/src/data/flagStatements";
import { styles } from "../styles";

interface CardItemProps {
  statement: FlagStatement;
  index: number;
  total: number;
}

export const CardItem = React.memo(function CardItem({
  statement,
  index,
  total,
}: CardItemProps) {
  const meta = CATEGORY_META[statement.category] || CATEGORY_META.communication;

  return (
    <LinearGradient
      colors={meta.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardGradient}
    >
      {/* Card Header: Category Chip & Card Progress */}
      <View style={styles.cardHeader}>
        <View
          style={[styles.categoryBadge, { backgroundColor: meta.badgeBg }]}
        >
          <View
            style={[
              styles.categoryBadgeDot,
              { backgroundColor: meta.accentColor },
            ]}
          />
          <Text style={styles.categoryBadgeText}>{meta.label}</Text>
        </View>

        <Text style={styles.cardNumberText}>
          {index + 1} / {total}
        </Text>
      </View>

      {/* Card Body: Statement Text */}
      <View style={styles.cardBody}>
        <Text style={styles.statementText}>{statement.text}</Text>
      </View>

      {/* Card Footer: Gentle Swipe Hints */}
      <View style={styles.cardFooterHint}>
        <View style={styles.swipeHintLeft}>
          <Ionicons name="arrow-back" size={12} color="#EF4444" />
          <Text style={styles.swipeHintTextRed}>Red Flag</Text>
        </View>
        <View style={styles.swipeHintRight}>
          <Text style={styles.swipeHintTextGreen}>Green Flag</Text>
          <Ionicons name="arrow-forward" size={12} color="#22C55E" />
        </View>
      </View>
    </LinearGradient>
  );
});
