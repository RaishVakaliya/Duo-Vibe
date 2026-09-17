import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";
import { DobInputProps } from "../types";
import { formatDateDisplay } from "@/src/lib/loveMatch";

export function DobInput({
  label,
  dob,
  onPress,
  accessibilityLabel,
}: DobInputProps) {
  return (
    <Pressable
      style={styles.dateCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.dateIconBox}>
        <Ionicons name="calendar-outline" size={18} color="#64748B" />
      </View>
      <View style={styles.dateTextBox}>
        <Text style={styles.dateLabel}>{label}</Text>
        <Text style={styles.dateValue}>{formatDateDisplay(dob)}</Text>
      </View>
    </Pressable>
  );
}
