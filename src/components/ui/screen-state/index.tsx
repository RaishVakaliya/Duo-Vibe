import React from "react";
import { View, Text, Pressable, ActivityIndicator, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { ScreenStateProps } from "./types";
import { styles } from "./styles";


export function ScreenState({
  variant,
  title,
  message,
  icon,
  onRetry,
  retryLabel = "Try Again",
  actionLabel,
  onAction,
  onOpenSettings,
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

  const defaultIconName = () => {
    if (icon) return icon;
    switch (variant) {
      case "error":
        return "alert-circle-outline";
      case "permission_denied":
        return "shield-checkmark-outline";
      case "offline":
        return "cloud-offline-outline";
      case "empty":
      default:
        return "file-tray-outline";
    }
  };

  const defaultTitle = () => {
    if (title) return title;
    switch (variant) {
      case "error":
        return "Something Went Wrong";
      case "permission_denied":
        return "Permission Required";
      case "offline":
        return "You're Offline";
      case "empty":
      default:
        return undefined;
    }
  };

  const defaultMessage = () => {
    if (message) return message;
    switch (variant) {
      case "permission_denied":
        return "Please grant permission in device settings to use this feature.";
      case "offline":
        return "Please check your internet connection and try again.";
      default:
        return undefined;
    }
  };

  const resolvedTitle = defaultTitle();
  const resolvedMessage = defaultMessage();
  const resolvedIcon = defaultIconName();

  const getIconColor = () => {
    if (variant === "error") return COLORS.error ?? "#FF4D6D";
    if (variant === "permission_denied") return "#F59E0B";
    if (variant === "offline") return "#38BDF8";
    return isLight ? "#FF2D6C" : COLORS.primary;
  };

  const getIconWrapperStyle = () => {
    if (variant === "permission_denied") return [styles.iconWrapper, styles.iconWrapperPermission];
    if (variant === "offline") return [styles.iconWrapper, styles.iconWrapperOffline];
    return styles.iconWrapper;
  };

  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      Linking.openSettings().catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      <View style={getIconWrapperStyle()}>
        <Ionicons
          name={resolvedIcon}
          size={34}
          color={getIconColor()}
        />
      </View>

      {resolvedTitle ? (
        <Text style={[styles.title, isLight && styles.titleLight]}>
          {resolvedTitle}
        </Text>
      ) : null}

      {resolvedMessage ? (
        <Text style={[styles.message, isLight && styles.messageLight]}>
          {resolvedMessage}
        </Text>
      ) : null}

      <View style={styles.buttonRow}>
        {variant === "permission_denied" && (
          <Pressable
            style={[styles.primaryButton, isLight && styles.primaryButtonLight]}
            onPress={handleOpenSettings}
          >
            <Ionicons
              name="settings-outline"
              size={16}
              color={COLORS.white}
            />
            <Text
              style={[
                styles.primaryButtonText,
                isLight && styles.primaryButtonTextLight,
              ]}
            >
              {actionLabel ?? "Open Settings"}
            </Text>
          </Pressable>
        )}

        {(variant === "error" || variant === "offline") && onRetry ? (
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
      </View>

      {actionLabel && onAction && variant !== "permission_denied" ? (
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
