import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { styles } from "../styles";
import { ReviewProgressHeaderProps } from "../types";

export function ReviewProgressHeader({
  progressFraction,
  onBack,
}: ReviewProgressHeaderProps) {
  return (
    <>
      <ScreenHeader
        title="Review Quiz"
        subtitle="Did your partner guess right?"
        align="center"
        theme="light"
        titleIcon={<Ionicons name="clipboard" size={22} color="#FF2D6C" />}
        onBack={onBack}
      />

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
