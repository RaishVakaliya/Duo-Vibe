import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { ConnectGridCardProps } from "./types";
import { styles } from "./styles";

export const ConnectGridCard: React.FC<ConnectGridCardProps> = ({
  title,
  subtitle,
  iconName,
  isGradient = false,
  gradientColors = [COLORS.primary, "#FF758F"],
  isComingSoon = false,
  needsPartner = false,
  hasPartner = true,
  onPress,
  onLinkPartnerPress,
}) => {
  const isDimmed = needsPartner && !hasPartner;

  const cardContent = (
    <View style={styles.cardInner}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconBox,
            !isGradient && styles.iconBoxDark,
          ]}
        >
          <Ionicons
            name={iconName as any}
            size={22}
            color={COLORS.white}
          />
        </View>

        {isComingSoon && (
          <View style={styles.badgeComingSoon}>
            <Text style={styles.badgeComingSoonText}>Coming soon</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
    </View>
  );

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={isDimmed ? onLinkPartnerPress : !isComingSoon ? onPress : undefined}
      disabled={isComingSoon}
    >
      {isGradient ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.darkBg]} />
      )}

      {cardContent}

      {/* Dimmed state if partner is required but not linked */}
      {isDimmed && (
        <View style={styles.dimmedOverlay}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color={COLORS.primaryLight}
          />
          <Text style={styles.dimmedPrompt}>Link your partner to unlock</Text>
          <Pressable
            style={styles.linkPartnerChip}
            onPress={onLinkPartnerPress}
          >
            <Ionicons name="link-outline" size={12} color={COLORS.white} />
            <Text style={styles.linkPartnerChipText}>Link partner</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};
