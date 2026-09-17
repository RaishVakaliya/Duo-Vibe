import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { styles } from "../styles";
import { ReviewProgressHeaderProps } from "../types";

export function ReviewProgressHeader({
  progressFraction,
  onBack,
}: ReviewProgressHeaderProps) {
  return (
    <>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={22} color="#1E1B26" />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="clipboard" size={22} color="#FF2D6C" />
            <Text style={styles.headerTitle}>Review Quiz</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Did your partner guess right?
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack}>
          <MotiView
            animate={{ width: `${progressFraction * 100}%` }}
            transition={{ type: "timing", duration: 250 }}
            style={styles.progressBarFill}
          >
            <LinearGradient
              colors={["#FF4D6D", "#FF2D6C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, borderRadius: 3 }}
            />
          </MotiView>
        </View>
      </View>
    </>
  );
}
