import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS, COLORS } from "@/src/constants/colors";
import { GradientButtonProps } from "./types";
import { styles } from "./styles";

export function GradientButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  loadingLabel,
  colors,
  icon,
  rightIcon,
  size = "md",
  fullWidth = true,
  style,
  labelStyle,
  accessibilityLabel,
}: GradientButtonProps) {
  const isInteractive = !disabled && !loading;

  const defaultColors = isInteractive
    ? (colors ?? GRADIENTS.primaryAction)
    : GRADIENTS.buttonDisabled;

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
        styles.wrapper,
        fullWidth && styles.fullWidth,
        !isInteractive && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <LinearGradient
        colors={defaultColors as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyle]}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color={COLORS.white} />
            {loadingLabel ? (
              <Text style={[styles.label, labelSizeStyle, labelStyle]}>
                {loadingLabel}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            {icon}
            <Text style={[styles.label, labelSizeStyle, labelStyle]}>
              {label}
            </Text>
            {rightIcon}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}
