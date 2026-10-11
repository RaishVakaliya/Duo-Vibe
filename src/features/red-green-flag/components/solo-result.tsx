import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { GRADIENTS } from "@/src/constants/colors";
import { styles } from "../styles";
import { SoloResultProps } from "../types";

export const SoloResult = React.memo(function SoloResult({
  summary,
  onShare,
  onPlayAgain,
  onBackToHome,
}: SoloResultProps) {
  return (
    <View style={{ flex: 1 }}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <Pressable
          style={styles.headerBackButton}
          onPress={onBackToHome}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Solo Results</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.resultScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Verdict Card */}
        <View style={styles.resultHeaderCard}>
          {/* Counts */}
          <View style={styles.resultCountsRow}>
            <View style={styles.resultCountBoxGreen}>
              <Ionicons name="flag" size={22} color="#22C55E" />
              <Text style={styles.resultCountNumber}>{summary.greenCount}</Text>
              <Text style={styles.resultCountLabel}>Green Flags</Text>
            </View>

            <View style={styles.resultCountBoxRed}>
              <Ionicons name="flag" size={22} color="#EF4444" />
              <Text style={styles.resultCountNumber}>{summary.redCount}</Text>
              <Text style={styles.resultCountLabel}>Red Flags</Text>
            </View>
          </View>

          {/* Ratio Verdict */}
          <View style={styles.resultVerdictCard}>
            <Text style={styles.resultVerdictLabel}>Your Relationship Lens</Text>
            <Text style={styles.resultVerdictText}>{summary.verdict}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.resultActionsContainer}>
          <Pressable
            style={styles.primaryActionButton}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share your result"
          >
            <LinearGradient
              colors={GRADIENTS.primaryAction}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryActionGradient}
            >
              <Ionicons name="share-social" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Share Result</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={onPlayAgain}
            accessibilityRole="button"
            accessibilityLabel="Play again"
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.secondaryButtonText}>Play Again</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
});
