import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { ScreenHeaderProps } from "./types";
import { styles } from "./styles";

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  hideBackButton = false,
  backIcon = "chevron-back",
  rightElement,
  titleIcon,
  align = "start",
  theme = "dark",
  style,
}: ScreenHeaderProps) {
  const router = useRouter();
  const isLight = theme === "light";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const backButton = !hideBackButton ? (
    <Pressable
      style={[styles.backButton, isLight && styles.backButtonLight]}
      onPress={handleBack}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons
        name={backIcon}
        size={22}
        color={isLight ? COLORS.textPrimary : COLORS.white}
      />
    </Pressable>
  ) : (
    <View style={styles.spacer} />
  );

  const right = rightElement ?? <View style={styles.spacer} />;

  if (align === "center") {
    return (
      <View style={[styles.container, styles.centeredContainer, style]}>
        {backButton}
        <View style={styles.centeredTitleWrapper}>
          <View style={styles.centeredTitleRow}>
            {titleIcon}
            <Text
              style={[styles.centeredTitle, isLight && styles.titleLight]}
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.2}
            >
              {title}
            </Text>
          </View>
          {subtitle ? (
            <Text
              style={[styles.centeredSubtitle, isLight && styles.subtitleLight]}
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.2}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.startContainer, style]}>
      {backButton}
      <View style={styles.startTitlesWrapper}>
        <View style={styles.startTitleRow}>
          {titleIcon}
          <Text
            style={[styles.startTitle, isLight && styles.titleLight]}
            numberOfLines={1}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={1.2}
          >
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text
            style={[styles.startSubtitle, isLight && styles.subtitleLight]}
            numberOfLines={1}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={1.2}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement}
    </View>
  );

}
