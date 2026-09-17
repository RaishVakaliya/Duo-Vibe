import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";

export default function AboutScreen() {
  const router = useRouter();
  const appVersion = Constants?.expoConfig?.version ?? "1.0.0";
  const appBuildNumber =
    Constants?.expoConfig?.android?.versionCode ??
    Constants?.expoConfig?.ios?.buildNumber ??
    "1";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>About</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Image
              source={require("@/assets/images/icon-nobg.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Duo Vibe</Text>
            <Text style={styles.tagline}>Better Connections, Bigger Smiles</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>
                Version {appVersion} (Build {appBuildNumber})
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardParagraph}>
              Duo Vibe is a romantic couple-connection platform designed to keep
              the spark alive between partners every single day.
            </Text>
            <Text style={styles.cardParagraph}>
              Whether you share a cozy apartment together or bridge time zones
              across the world in a long-distance relationship, Duo Vibe gives
              you meaningful reasons to check in, laugh, and grow closer.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What We Bring For You</Text>

            <View style={styles.featureRow}>
              <Text style={styles.featureEmoji}>💌</Text>
              <Text style={styles.featureText}>
                Daily Sparks: Thought-provoking conversation prompts
              </Text>
            </View>

            <View style={styles.featureRow}>
              <Text style={styles.featureEmoji}>🎮</Text>
              <Text style={styles.featureText}>
                Couple Quizzes: Playful compatibility & trivia games
              </Text>
            </View>

            <View style={styles.featureRow}>
              <Text style={styles.featureEmoji}>🥂</Text>
              <Text style={styles.featureText}>
                Romantic Date Ideas: Creative date plans and bucket lists
              </Text>
            </View>

            <View style={styles.featureRow}>
              <Text style={styles.featureEmoji}>📸</Text>
              <Text style={styles.featureText}>
                Keepsake Scrapbook: Save your most cherished polaroids
              </Text>
            </View>
          </View>

          <Text style={styles.footerText}>
            Crafted with 💕 for couples worldwide.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
