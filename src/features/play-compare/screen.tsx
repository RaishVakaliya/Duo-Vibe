import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { GameModeItem } from "@/src/types";

const GAME_MODES: GameModeItem[] = [
  {
    id: "1",
    emoji: "😬",
    title: "ICK OR\nNAH?",
    gradient: GRADIENTS.gameIck,
    delay: 100,
  },
  {
    id: "2",
    emoji: "🔥",
    title: "WOULD YOU\nRATHER?",
    gradient: GRADIENTS.gameWouldYouRather,
    delay: 200,
  },
  {
    id: "3",
    emoji: "😏",
    title: "GUESS MY\nANSWER",
    gradient: GRADIENTS.gameGuessMyAnswer,
    delay: 300,
  },
  {
    id: "4",
    emoji: "🤝",
    title: "AGREE OR\nDISAGREE?",
    gradient: GRADIENTS.gameAgreeOrDisagree,
    delay: 400,
  },
];

export default function PlayCompareScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push(ROUTES.MEMORIES);
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
              style={[styles.progressBarFill, { width: "75%" }]}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Play and compare together</Text>
          <Text style={styles.subtitle}>
            Take quizzes, compare your answers, and see what surprises you.
          </Text>

          <View style={styles.gridContainer}>
            {GAME_MODES.map((game: GameModeItem) => (
              <MotiView
                key={game.id}
                from={{ opacity: 0, scale: 0.85, translateY: 15 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: 500,
                  delay: game.delay,
                }}
                style={styles.gameCardWrapper}
              >
                <LinearGradient
                  colors={[...game.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gameCardGradient}
                >
                  <Text style={styles.gameEmoji}>{game.emoji}</Text>
                  <Text style={styles.gameCardTitle}>
                    {game.title}
                  </Text>
                </LinearGradient>
              </MotiView>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.continueButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
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
