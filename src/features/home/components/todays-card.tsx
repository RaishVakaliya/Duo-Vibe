import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "../styles";
import { TodaysCardProps } from "../types";

export function TodaysCard({
  onPress,
  quote = '"What\'s one thing you secretly want your partner to understand?"',
}: TodaysCardProps) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="sparkles" size={18} color="#FF4D6D" />
        <Text style={styles.sectionTitle}>{"Today's Card"}</Text>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400, delay: 350 }}
      >
        <Pressable
          style={styles.todaysCard}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Answer Today's Prompt Card"
        >
          <View style={styles.todaysCardLeft}>
            <Text style={styles.todaysCardQuote}>{quote}</Text>
            <Text style={styles.todaysCardTapPrompt}>
              {"Tap to reveal & answer"}
            </Text>
          </View>

          <View style={styles.todaysCardRight}>
            <Ionicons name="albums" size={24} color="#FF4D6D" />
          </View>
        </Pressable>
      </MotiView>
    </View>
  );
}
