import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { GRADIENTS, COLORS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image
        source={require("@/assets/images/welcome_bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          "transparent",
          "rgba(13, 11, 26, 0.4)",
          "rgba(13, 11, 26, 0.85)",
          COLORS.darkOverlay,
          COLORS.darkOverlay,
        ]}
        locations={[0, 0.25, 0.55, 0.75, 1]}
        style={styles.gradientOverlay}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.headline}>
            Some days need a reason to reach out.
          </Text>

          <Text style={styles.subtitle}>
            DuoVibe gives you a small spark every day — a question, a game, a
            reason to check in and stay close, no matter the distance.
          </Text>

          <Pressable
            style={styles.buttonContainer}
            onPress={() => router.push(ROUTES.ONBOARDING)}
            accessibilityRole="button"
            accessibilityLabel="Start Our Journey"
          >
            <LinearGradient
              colors={[...GRADIENTS.welcomeButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start Our Journey</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable
              onPress={() => router.push(ROUTES.LOGIN)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="link"
              accessibilityLabel="Log in"
            >
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
