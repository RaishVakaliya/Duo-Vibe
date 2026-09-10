import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";

export default function MemoriesScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push(ROUTES.READY);
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
              style={[styles.progressBarFill, { width: "85%" }]}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Turn moments into Memories</Text>
          <Text style={styles.subtitle}>
            Build a scrapbook of your love story
          </Text>

          <View style={styles.polaroidContainer}>
            <MotiView
              from={{ translateY: -3, rotate: "-9deg" }}
              animate={{ translateY: 5, rotate: "-7deg" }}
              transition={{
                type: "timing",
                duration: 2600,
                loop: true,
                repeatReverse: true,
              }}
              style={[styles.polaroidCard, styles.polaroidLeft]}
            >
              <Image
                source={require("@/assets/images/memory_beach.jpg")}
                style={styles.polaroidImage}
                resizeMode="cover"
              />
            </MotiView>

            <MotiView
              from={{ translateY: 4, rotate: "7deg" }}
              animate={{ translateY: -4, rotate: "5deg" }}
              transition={{
                type: "timing",
                duration: 3000,
                loop: true,
                repeatReverse: true,
              }}
              style={[styles.polaroidCard, styles.polaroidRight]}
            >
              <Image
                source={require("@/assets/images/memory_stargazing.jpg")}
                style={styles.polaroidImage}
                resizeMode="cover"
              />
            </MotiView>

            <MotiView
              from={{ translateY: -5, rotate: "-1deg" }}
              animate={{ translateY: 5, rotate: "1deg" }}
              transition={{
                type: "timing",
                duration: 2400,
                loop: true,
                repeatReverse: true,
              }}
              style={[styles.polaroidCard, styles.polaroidCenter]}
            >
              <Image
                source={require("@/assets/images/memory_cafe.jpg")}
                style={styles.polaroidImage}
                resizeMode="cover"
              />
            </MotiView>
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
