import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Share } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { DateCardItem } from "@/src/types";

const DATE_CARDS: DateCardItem[] = [
  {
    id: "1",
    category: "MIDNIGHT ROOFTOP CINEMA",
    categoryColor: "#34D399",
    gradientBorder: GRADIENTS.cardGreen,
    body: "String up glowing fairy lights, brew hot spiced chai, and project your favorite comfort film under the open night sky.",
    location: "Cozy Home Rooftop",
    website: "Curate Watchlist",
    shadowColor: "#10B981",
  },
  {
    id: "2",
    category: "SUNSET POTTERY & ROSÉ",
    categoryColor: "#FB923C",
    gradientBorder: GRADIENTS.cardOrange,
    body: "Spin clay together at the wheel with messy hands, joyful laughter, and a glass of your favorite chilled wine.",
    location: "Artisan Clay Studio",
    website: "Reserve Couple Wheel",
    shadowColor: "#F97316",
  },
  {
    id: "3",
    category: "SECRET SPEAKEASY & JAZZ",
    categoryColor: "#38BDF8",
    gradientBorder: GRADIENTS.cardPurpleCyan,
    body: "Dress up in your favorite look, slip through a bookshelf secret door, and sip craft cocktails to cozy live saxophone tunes.",
    location: "Velvet Alley Lounge",
    website: "View Secret Passcode",
    shadowColor: "#8B5CF6",
  },
];

export default function DateIdeasScreen() {
  const router = useRouter();
  const [topIndex, setTopIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % DATE_CARDS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleManualSwipe = (): void => {
    setTopIndex((prev) => (prev + 1) % DATE_CARDS.length);
  };

  const handleShare = async (item: DateCardItem): Promise<void> => {
    try {
      await Share.share({
        message: `${item.category}: ${item.body} - ${item.location}`,
      });
    } catch (err: unknown) {
      console.warn("Share date idea error:", err);
    }
  };

  const handleContinue = (): void => {
    router.push(ROUTES.PLAY_COMPARE);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.progressBarTrack}>
            <LinearGradient
              colors={[...GRADIENTS.progressBar]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: "50%" }]}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {"Discover Dates You'll Love"}
          </Text>
          <Text style={styles.subtitle}>
            Explore curated couple adventures and pick something exciting to do together.
          </Text>

          <Pressable
            style={styles.deckContainer}
            onPress={handleManualSwipe}
            accessibilityRole="button"
            accessibilityLabel="Tap to cycle next date idea"
          >
            {DATE_CARDS.map((card, index) => {
              const position =
                (index - topIndex + DATE_CARDS.length) % DATE_CARDS.length;

              const isTop = position === 0;
              const isSecond = position === 1;

              const scale = isTop ? 1 : isSecond ? 0.94 : 0.88;
              const translateY = isTop ? 0 : isSecond ? 14 : 26;
              const rotate = isTop ? "0deg" : isSecond ? "-4deg" : "3deg";
              const opacity = isTop ? 1 : isSecond ? 0.85 : 0.6;
              const zIndex = isTop ? 3 : isSecond ? 2 : 1;

              return (
                <MotiView
                  key={card.id}
                  animate={{
                    scale,
                    translateY,
                    rotate,
                    opacity,
                  }}
                  transition={{
                    type: "timing",
                    duration: 500,
                  }}
                  style={[styles.cardWrapper, { zIndex }]}
                >
                  <LinearGradient
                    colors={[...card.gradientBorder]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.cardGradientBorder,
                      { shadowColor: card.shadowColor },
                    ]}
                  >
                    <View style={styles.cardInner}>
                      <View style={styles.cardHeader}>
                        <Text
                          style={[
                            styles.categoryText,
                            { color: card.categoryColor },
                          ]}
                        >
                          {card.category}
                        </Text>
                        <Pressable
                          style={styles.shareButton}
                          onPress={() => handleShare(card)}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          accessibilityRole="button"
                          accessibilityLabel={`Share ${card.category} date idea`}
                        >
                          <Ionicons
                            name="share-outline"
                            size={20}
                            color="#94A3B8"
                          />
                        </Pressable>
                      </View>

                      <Text style={styles.bodyText}>{card.body}</Text>

                      <View style={styles.tagsRow}>
                        <View style={styles.tagPill}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#94A3B8"
                          />
                          <Text style={styles.tagText}>
                            {card.location}
                          </Text>
                        </View>
                        <View style={styles.tagPill}>
                          <Ionicons
                            name="link-outline"
                            size={14}
                            color="#94A3B8"
                          />
                          <Text style={styles.tagText}>
                            {card.website}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </MotiView>
              );
            })}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.continueButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue to Couple Games"
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
