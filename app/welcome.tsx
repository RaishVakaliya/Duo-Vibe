import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { welcomeStyles } from "@/styles/welcome.styles";
import { GRADIENTS } from "@/constants/colors";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={welcomeStyles.container}>
      <StatusBar style="light" />

      <Image
        source={require("@/assets/images/welcome_bg.png")}
        style={welcomeStyles.backgroundImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          "transparent",
          "rgba(13, 11, 26, 0.4)",
          "rgba(13, 11, 26, 0.85)",
          "#0D0B1A",
          "#0D0B1A",
        ]}
        locations={[0, 0.25, 0.55, 0.75, 1]}
        style={welcomeStyles.gradientOverlay}
      />

      <SafeAreaView edges={["bottom"]} style={welcomeStyles.safeArea}>
        <View style={welcomeStyles.contentContainer}>
          <Text style={welcomeStyles.headline}>
            Some days need a reason to reach out.
          </Text>

          <Text style={welcomeStyles.subtitle}>
            DuoVibe gives you a small spark every day — a question, a game, a
            reason to check in and stay close, no matter the distance.
          </Text>

          <Pressable
            style={welcomeStyles.buttonContainer}
            onPress={() => router.push("/onboarding")}
            accessibilityRole="button"
            accessibilityLabel="Start Our Journey"
          >
            <LinearGradient
              colors={[...GRADIENTS.welcomeButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={welcomeStyles.buttonGradient}
            >
              <Text style={welcomeStyles.buttonText}>Start Our Journey</Text>
            </LinearGradient>
          </Pressable>

          <View style={welcomeStyles.footerRow}>
            <Text style={welcomeStyles.footerText}>
              Already have an account?
            </Text>
            <Pressable
              onPress={() => router.push("/login")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="link"
              accessibilityLabel="Log in"
            >
              <Text style={welcomeStyles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
