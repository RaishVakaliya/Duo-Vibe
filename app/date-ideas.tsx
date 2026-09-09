import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Share } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { dateIdeasStyles } from "@/styles/date-ideas.styles";
import { GRADIENTS } from "@/constants/colors";

interface DateCardItem {
  id: string;
  category: string;
  categoryColor: string;
  gradientBorder: readonly [string, string, ...string[]];
  body: string;
  location: string;
  website: string;
  shadowColor: string;
}

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
  const [topIndex, setTopIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % DATE_CARDS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleManualSwipe = () => {
    setTopIndex((prev) => (prev + 1) % DATE_CARDS.length);
  };

  const handleShare = async (item: DateCardItem) => {
    try {
      await Share.share({
        message: `${item.category}: ${item.body} - ${item.location}`,
      });
    } catch {
      // ignore
    }
  };

  const handleContinue = () => {
    router.push("/play-compare");
  };

  return (
    <View style={dateIdeasStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={dateIdeasStyles.gradientBackground}
      />

      <SafeAreaView style={dateIdeasStyles.safeArea}>
        <View style={dateIdeasStyles.headerRow}>
          <Pressable
            style={dateIdeasStyles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={dateIdeasStyles.progressBarTrack}>
            <LinearGradient
              colors={[...GRADIENTS.progressBar]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[dateIdeasStyles.progressBarFill, { width: "50%" }]}
            />
          </View>
        </View>

        <View style={dateIdeasStyles.content}>
          <Text style={dateIdeasStyles.title}>
            Discover Dates You'll Love
          </Text>
          <Text style={dateIdeasStyles.subtitle}>
            Explore curated couple adventures and pick something exciting to do together.
          </Text>

          <Pressable
            style={dateIdeasStyles.deckContainer}
            onPress={handleManualSwipe}
            accessibilityRole="button"
            accessibilityLabel="Tap to cycle date idea card"
          >
            {DATE_CARDS.map((card, index) => {
              const position =
                (index - topIndex + DATE_CARDS.length) % DATE_CARDS.length;

              const isTop = position === 0;
              const isSecond = position === 1;
              const isThird = position === 2;

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
                  style={[dateIdeasStyles.cardWrapper, { zIndex }]}
                >
                  <LinearGradient
                    colors={[...card.gradientBorder]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      dateIdeasStyles.cardGradientBorder,
                      { shadowColor: card.shadowColor },
                    ]}
                  >
                    <View style={dateIdeasStyles.cardInner}>
                      <View style={dateIdeasStyles.cardHeader}>
                        <Text
                          style={[
                            dateIdeasStyles.categoryText,
                            { color: card.categoryColor },
                          ]}
                        >
                          {card.category}
                        </Text>
                        <Pressable
                          style={dateIdeasStyles.shareButton}
                          onPress={() => handleShare(card)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons
                            name="share-outline"
                            size={20}
                            color="#94A3B8"
                          />
                        </Pressable>
                      </View>

                      <Text style={dateIdeasStyles.bodyText}>{card.body}</Text>

                      <View style={dateIdeasStyles.tagsRow}>
                        <View style={dateIdeasStyles.tagPill}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#94A3B8"
                          />
                          <Text style={dateIdeasStyles.tagText}>
                            {card.location}
                          </Text>
                        </View>
                        <View style={dateIdeasStyles.tagPill}>
                          <Ionicons
                            name="link-outline"
                            size={14}
                            color="#94A3B8"
                          />
                          <Text style={dateIdeasStyles.tagText}>
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

        <View style={dateIdeasStyles.footer}>
          <Pressable
            style={dateIdeasStyles.continueButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={dateIdeasStyles.continueButtonGradient}
            >
              <Text style={dateIdeasStyles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
