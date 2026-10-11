import React from "react";
import { Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnniversaryChipProps } from "../types";
import { styles } from "../styles";

export function AnniversaryChip({
  daysTogether,
  onPress,
}: AnniversaryChipProps) {
  if (daysTogether === null || daysTogether <= 0) {
    return null;
  }

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      style={styles.anniversaryChip}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Day ${daysTogether} together. Tap to change anniversary date.`}
    >
      <Ionicons name="heart" size={14} color="#FF2D55" />
      <Text style={styles.anniversaryChipText}>Day {daysTogether} together</Text>
    </Pressable>
  );
}
