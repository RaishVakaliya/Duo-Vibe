import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";
import { ProfileMenuItemProps } from "../types";

export function ProfileMenuItem({
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  hasBorder = false,
  isDestructive = false,
  disabled = false,
  rightComponent,
}: ProfileMenuItemProps) {
  return (
    <Pressable
      style={[styles.settingsRow, hasBorder && styles.settingsRowBorder]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.settingsRowContent}>
        <Text
          style={[
            styles.settingsRowTitle,
            isDestructive && styles.destructiveText,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingsRowSubtitle}>{subtitle}</Text>
        )}
      </View>

      {rightComponent ?? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={
            isDestructive
              ? "rgba(239, 68, 68, 0.5)"
              : "rgba(255, 255, 255, 0.3)"
          }
        />
      )}
    </Pressable>
  );
}
