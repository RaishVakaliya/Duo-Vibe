import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { COLORS } from "@/src/constants/colors";
import { OutlinedButtonProps } from "./types";
import { styles } from "./styles";

export function OutlinedButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  color = COLORS.primary,
  size = "md",
  fullWidth = true,
  style,
  labelStyle,
  accessibilityLabel,
}: OutlinedButtonProps) {
  const isInteractive = !disabled && !loading;

  const sizeStyle =
    size === "sm"
      ? styles.sizeSm
      : size === "lg"
      ? styles.sizeLg
      : styles.sizeMd;

  const labelSizeStyle =
    size === "sm"
      ? styles.labelSm
      : size === "lg"
      ? styles.labelLg
      : styles.labelMd;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={[
        styles.button,
        sizeStyle,
        { borderColor: color },
        fullWidth && styles.fullWidth,
        !isInteractive && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              labelSizeStyle,
              { color },
              labelStyle,
            ]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
          >
            {label}
          </Text>

        </>
      )}
    </Pressable>
  );
}
