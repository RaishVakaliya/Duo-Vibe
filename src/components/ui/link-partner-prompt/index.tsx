import React from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ROUTES } from "@/src/constants/routes";
import { COLORS, GRADIENTS } from "@/src/constants/colors";
import { LinkPartnerPromptProps } from "./types";
import { styles } from "./styles";

export function LinkPartnerPrompt({
  title = "Link your partner",
  description = "Connect with your partner to unlock this feature together.",
  buttonLabel = "Link Partner Now",
  icon = "people-outline",
  source,
  onPress,
  theme = "dark",
  style,
}: LinkPartnerPromptProps) {
  const router = useRouter();
  const isLight = theme === "light";

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push({
      pathname: ROUTES.INVITE_PARTNER,
      ...(source ? { params: { source } } : {}),
    });
  };

  if (isLight) {
    return (
      <View style={[styles.container, styles.containerLight, style]}>
        <View style={styles.cardLight}>
          <View style={[styles.iconWrapper, styles.iconWrapperLight]}>
            <Ionicons name={icon as any} size={34} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, styles.titleLight]}>{title}</Text>
          <Text style={[styles.description, styles.descriptionLight]}>
            {description}
          </Text>
          <Pressable onPress={handlePress} style={styles.buttonWrapper}>
            <LinearGradient
              colors={GRADIENTS.primary as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Ionicons name="heart" size={16} color={COLORS.white} />
              <Text style={styles.buttonText}>{buttonLabel}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon as any} size={34} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Pressable onPress={handlePress} style={styles.buttonWrapper}>
        <LinearGradient
          colors={GRADIENTS.primary as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Ionicons name="heart" size={16} color={COLORS.white} />
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
