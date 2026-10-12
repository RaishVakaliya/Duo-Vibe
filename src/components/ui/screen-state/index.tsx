import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { ScreenStateProps } from "./types";
import { styles } from "./styles";

/**
 * Standardized loading / error / empty state renderer.
 * Eliminates the repeated inline loading spinners and error blocks
 * across screens.
 *
 * ```tsx
 * <ScreenState variant="loading" message="Loading memories…" />
 * <ScreenState variant="error" message="Something went wrong." onRetry={retry} />
 * <ScreenState variant="empty" icon="images-outline" title="No memories yet" message="Add your first memory!" />
 * ```
 */
export function ScreenState({
  variant,
  title,
  message,
  icon,
  onRetry,
  retryLabel = "Try Again",
  actionLabel,
  onAction,
  theme = "dark",
}: ScreenStateProps) {
  const isLight = theme === "light";

  if (variant === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={isLight ? "#FF2D6C" : COLORS.primary}
        />
        {message ? (
          <Text
            style={[
              styles.loadingMessage,
              isLight && styles.loadingMessageLight,
            ]}
          >
            {message}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {icon ? (
        <View style={styles.iconWrapper}>
          <Ionicons
            name={icon as any}
            size={34}
            color={variant === "error" ? COLORS.error ?? "#FF4D6D" : COLORS.primary}
          />
        </View>
      ) : null}

      {title ? (
        <Text style={[styles.title, isLight && styles.titleLight]}>{title}</Text>
      ) : null}
      {message ? (
        <Text style={[styles.message, isLight && styles.messageLight]}>
          {message}
        </Text>
      ) : null}

      {variant === "error" && onRetry ? (
        <Pressable
          style={[styles.retryButton, isLight && styles.retryButtonLight]}
          onPress={onRetry}
        >
          <Ionicons
            name="refresh"
            size={16}
            color={isLight ? "#FF2D55" : COLORS.white}
          />
          <Text
            style={[styles.retryText, isLight && styles.retryTextLight]}
          >
            {retryLabel}
          </Text>
        </Pressable>
      ) : null}

      {actionLabel && onAction ? (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text
            style={[styles.actionText, isLight && styles.actionTextLight]}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
