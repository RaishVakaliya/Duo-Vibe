import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Share,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { MotiView } from "moti";
import { styles } from "./styles";
import { MatchBarRow } from "./types";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { COLORS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth-context";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { getPartnerId } from "@/src/lib/quiz";
import { buildCoupleKey } from "@/src/lib/challenge";
import { createResultMemory } from "@/src/lib/memories";
import { useDeferredReady } from "@/src/hooks/use-deferred-ready";

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
  const contentReady = useDeferredReady();
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const params = useLocalSearchParams<{
    name1?: string;
    name2?: string;
    overall?: string;
    communication?: string;
    chemistry?: string;
    trust?: string;
    longTerm?: string;
  }>();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [router]),
  );

  function parseClamp(val: string | undefined, fallback: number): number {
    if (!val) return fallback;
    const parsed = parseInt(val, 10);
    if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return fallback;
    return Math.max(0, Math.min(100, parsed));
  }

  const name1 = (typeof params.name1 === "string" && params.name1.trim()) || "Partner 1";
  const name2 = (typeof params.name2 === "string" && params.name2.trim()) || "Partner 2";
  const overall = parseClamp(params.overall, 87);
  const communication = parseClamp(params.communication, 91);
  const chemistry = parseClamp(params.chemistry, 94);
  const trust = parseClamp(params.trust, 82);
  const longTerm = parseClamp(params.longTerm, 79);


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

  const handleSaveToMemories = async (): Promise<void> => {
    if (isSaved || isSaving) return;
    if (!user) {
      showAlert({
        title: "Sign in Required",
        message: "Please sign in to save memories.",
      });
      return;
    }
    setIsSaving(true);
    try {
      const partnerId = await getPartnerId(user.id);
      if (!partnerId) {
        showAlert({
          title: "Partner Required",
          message: "Connect with a partner to save shared memories.",
        });
        setIsSaving(false);
        return;
      }
      const coupleKey = buildCoupleKey(user.id, partnerId);
      await createResultMemory({
        coupleKey,
        userId: user.id,
        title: `${name1} & ${name2} Love Match`,
        note: `Compatibility score: ${overall}%`,
        payload: {
          type: "love_match",
          score: overall,
          overall,
          headline: `${overall}% Compatibility`,
        },
      });
      setIsSaved(true);
    } catch (err: unknown) {
      console.warn("Save to memories error:", err);
      showAlert({
        title: "Save Failed",
        message: err instanceof Error ? err.message : "Failed to save result to memories.",
      });
    } finally {
      setIsSaving(false);
    }
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
        <ScreenHeader
          title="Love Match"
          align="center"
          theme="light"
          titleIcon={
            <Ionicons
              name="heart"
              size={24}
              color="#FF2D55"
              style={styles.headerHeartIcon}
            />
          }
          onBack={() => router.replace(ROUTES.HOME)}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: contentReady ? 0 : 1, translateY: contentReady ? 8 : 0 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: contentReady ? 280 : 0 }}
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
                from={{ opacity: contentReady ? 0 : 1, translateY: contentReady ? 8 : 0 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: contentReady ? 280 : 0 }}
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
                      from={{ width: contentReady ? "0%" : `${bar.percentage}%` }}
                      animate={{ width: `${bar.percentage}%` }}
                      transition={{
                        type: "timing",
                        duration: contentReady ? 400 : 0,
                        delay: contentReady ? Math.min(bar.delay, 120) : 0,
                      }}
                      style={[styles.barFill, { backgroundColor: bar.color }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </MotiView>
        </ScrollView>

        <Pressable
          style={[styles.saveMemoryButton, isSaved && styles.saveMemoryButtonSaved]}
          onPress={handleSaveToMemories}
          disabled={isSaved || isSaving}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? "Saved to Memories" : "Save to Memories"}
        >
          <Ionicons
            name={isSaved ? "checkmark-circle" : "sparkles"}
            size={18}
            color={isSaved ? "#059669" : "#FF2D55"}
          />
          <Text
            style={[
              styles.saveMemoryButtonText,
              isSaved && styles.saveMemoryButtonTextSaved,
            ]}
          >
            {isSaved ? "Saved to Memories" : isSaving ? "Saving to Memories..." : "Save to Memories"}
          </Text>
        </Pressable>

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
