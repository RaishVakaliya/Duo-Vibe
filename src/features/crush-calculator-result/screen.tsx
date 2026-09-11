import React, { useState, useEffect, useCallback } from "react";
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
import { ROUTES } from "@/src/constants/routes";

function HeartIconSvg({
  size = 48,
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

export default function CrushCalculatorResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    yourName?: string;
    crushName?: string;
    percentage?: string;
    headline?: string;
    message?: string;
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

  const yourName = params.yourName || "You";
  const crushName = params.crushName || "Crush";
  const targetPercentage = parseInt(params.percentage || "78", 10);
  const headline = params.headline || "They definitely notice you!";
  const message =
    params.message ||
    "Your energy is impossible to ignore. They light up a little when you're around.";

  const [displayPercentage, setDisplayPercentage] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 850;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercentage(Math.round(eased * targetPercentage));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetPercentage]);

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: `My crush score with ${crushName} is ${targetPercentage}%! 💕 "${headline}"\nTested on Duo Vibe! ✨`,
      });
    } catch (err: unknown) {
      console.warn("Share result error:", err);
    }
  };

  const handleTryAgain = (): void => {
    router.replace(ROUTES.CRUSH_CALCULATOR);
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
            onPress={() => router.replace(ROUTES.HOME)}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1B26" />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Ionicons
              name="flame"
              size={22}
              color="#FF7A00"
              style={styles.headerHeartIcon}
            />
            <Text style={styles.headerTitle}>Crush Calculator</Text>
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

            <MotiView
              from={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, delay: 100 }}
              style={styles.doubleHeartContainer}
            >
              <View style={styles.doubleHeartBack}>
                <HeartIconSvg size={56} color="#FFA45C" />
              </View>
              <View style={styles.doubleHeartFront}>
                <HeartIconSvg size={54} color="#FF2D55" />
              </View>
            </MotiView>

            <Text style={styles.percentageLabel}>Your Crush Percentage</Text>
            <Text style={styles.namesSubtitle}>
              {yourName} & {crushName}
            </Text>

            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 14, delay: 150 }}
            >
              <Text style={styles.percentageValue}>{displayPercentage}%</Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 300 }}
            >
              <Text style={styles.headlineText}>{headline}</Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 450 }}
            >
              <Text style={styles.messageText}>"{message}"</Text>
            </MotiView>
          </MotiView>
        </ScrollView>

        <View style={styles.footerActions}>
          <Pressable
            style={styles.shareButton}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share Crush Result"
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
