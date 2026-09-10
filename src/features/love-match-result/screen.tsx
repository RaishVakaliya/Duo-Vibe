import React from "react";
import { View, Text, Pressable, ScrollView, Share } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { MotiView } from "moti";
import { styles } from "./styles";
import { MatchBarRow } from "./types";
import { COLORS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { LoveMatchResultScreenParams } from "@/src/types";

function HeartSvg({
  size = 88,
  color = "#FF2D55",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </Svg>
  );
}

export default function LoveMatchResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name1?: string;
    name2?: string;
    overall?: string;
    communication?: string;
    chemistry?: string;
    trust?: string;
    longTerm?: string;
  }>();

  const name1 = params.name1 || "Partner 1";
  const name2 = params.name2 || "Partner 2";
  const overall = parseInt(params.overall || "87", 10);
  const communication = parseInt(params.communication || "91", 10);
  const chemistry = parseInt(params.chemistry || "94", 10);
  const trust = parseInt(params.trust || "82", 10);
  const longTerm = parseInt(params.longTerm || "79", 10);

  const barRows: readonly MatchBarRow[] = [
    {
      label: "Communication",
      percentage: communication,
      color: COLORS.matchCommunication,
      delay: 100,
    },
    {
      label: "Chemistry",
      percentage: chemistry,
      color: COLORS.matchChemistry,
      delay: 250,
    },
    {
      label: "Trust",
      percentage: trust,
      color: COLORS.matchTrust,
      delay: 400,
    },
    {
      label: "Long-term",
      percentage: longTerm,
      color: COLORS.matchLongTerm,
      delay: 550,
    },
  ];

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: `Our love compatibility score is ${overall}%! 💕 (${name1} & ${name2})\nTested on Duo Vibe app ✨`,
      });
    } catch (err: unknown) {
      console.warn("Share result error:", err);
    }
  };

  const handleTryAgain = (): void => {
    router.replace(ROUTES.LOVE_MATCH);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFE8EF", "#FFDCE6"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1B26" />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Ionicons
              name="heart"
              size={24}
              color="#FF2D55"
              style={styles.headerHeartIcon}
            />
            <Text style={styles.headerTitle}>Love Match</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 16 }}
            style={styles.resultCard}
          >
            <View style={styles.scatterHeart1}>
              <Ionicons name="heart" size={22} color="#FFB6C1" />
            </View>
            <View style={styles.scatterHeart2}>
              <Ionicons name="heart" size={18} color="#FFC0CB" />
            </View>
            <View style={styles.scatterHeart3}>
              <Ionicons name="heart" size={14} color="#FFD1DC" />
            </View>
            <View style={styles.scatterHeart4}>
              <Ionicons name="heart" size={16} color="#FFB6C1" />
            </View>

            <View style={styles.scoreCenterSection}>
              <MotiView
                from={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: 150 }}
                style={styles.heartScoreContainer}
              >
                <HeartSvg size={92} color="#FF2D55" />
                <View
                  style={[
                    styles.gradientBackground,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text style={styles.scoreTextInsideHeart}>{overall}</Text>
                </View>
              </MotiView>

              <Text style={styles.compatibilityTitle}>Love Compatibility</Text>
              <Text style={styles.coupleNamesSubtitle}>
                {name1} & {name2}
              </Text>
            </View>

            <View style={styles.barsContainer}>
              {barRows.map((bar) => (
                <View key={bar.label} style={styles.barRow}>
                  <View style={styles.barLabelRow}>
                    <Text style={styles.barLabel}>{bar.label}</Text>
                    <Text style={styles.barPercentage}>{bar.percentage}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <MotiView
                      from={{ width: "0%" }}
                      animate={{ width: `${bar.percentage}%` }}
                      transition={{
                        type: "timing",
                        duration: 800,
                        delay: bar.delay,
                      }}
                      style={[styles.barFill, { backgroundColor: bar.color }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </MotiView>
        </ScrollView>

        <View style={styles.footerActions}>
          <Pressable
            style={styles.shareButton}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share Love Match Result"
          >
            <Text style={styles.shareButtonText}>Share Result</Text>
          </Pressable>

          <Pressable
            style={styles.tryAgainButton}
            onPress={handleTryAgain}
            accessibilityRole="button"
            accessibilityLabel="Try Again"
          >
            <LinearGradient
              colors={["#FF4D6D", "#FF2D55", "#E11D48"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tryAgainGradient}
            >
              <Text style={styles.tryAgainText}>Try Again</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
