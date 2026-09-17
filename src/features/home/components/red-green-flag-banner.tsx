import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "../styles";
import { RedGreenFlagBannerProps } from "../types";

export function RedGreenFlagBanner({ onPress }: RedGreenFlagBannerProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 450, delay: 100 }}
      style={styles.heroCard}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Red flag or green flag couple game"
      >
        <LinearGradient
          colors={["#E11D48", "#BE123C", "#881337"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroFlagsRow}>
            <View style={styles.heroFlagBadgeLeft}>
              <Ionicons name="flag" size={14} color="#FF6B81" />
              <Text style={styles.heroFlagText}>Red Flag</Text>
            </View>
            <View style={styles.heroFlagBadgeRight}>
              <Ionicons name="flag" size={14} color="#4ADE80" />
              <Text style={styles.heroFlagText}>Green Flag</Text>
            </View>
          </View>

          <View style={styles.heroCenterContent}>
            <Text style={styles.heroTitle}>
              {"Red Flag\nor\nGreen Flag?"}
            </Text>
            <Text style={styles.heroSubtitle}>
              {"Is it a red flag or a green flag?\nFind out now.."}
            </Text>
          </View>

          <View style={styles.heroFooter}>
            <View style={styles.heroPlayBadge}>
              <Ionicons name="play" size={14} color="#E11D48" />
              <Text style={styles.heroPlayText}>Play now</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </MotiView>
  );
}
