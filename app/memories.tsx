import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { memoriesStyles } from "@/styles/memories.styles";
import { GRADIENTS } from "@/constants/colors";

export default function MemoriesScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/ready");
  };

  return (
    <View style={memoriesStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={memoriesStyles.gradientBackground}
      />

      <SafeAreaView style={memoriesStyles.safeArea}>
        <View style={memoriesStyles.headerRow}>
          <Pressable
            style={memoriesStyles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={memoriesStyles.progressBarTrack}>
            <LinearGradient
              colors={[...GRADIENTS.progressBar]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[memoriesStyles.progressBarFill, { width: "85%" }]}
            />
          </View>
        </View>

        <View style={memoriesStyles.content}>
          <Text style={memoriesStyles.title}>Turn moments into Memories</Text>
          <Text style={memoriesStyles.subtitle}>
            Build a scrapbook of your love story
          </Text>

          <View style={memoriesStyles.polaroidContainer}>
            <MotiView
              from={{ translateY: -3, rotate: "-9deg" }}
              animate={{ translateY: 5, rotate: "-7deg" }}
              transition={{
                type: "timing",
                duration: 2600,
                loop: true,
                repeatReverse: true,
              }}
              style={[memoriesStyles.polaroidCard, memoriesStyles.polaroidLeft]}
            >
              <Image
                source={require("@/assets/images/memory_beach.jpg")}
                style={memoriesStyles.polaroidImage}
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
              style={[
                memoriesStyles.polaroidCard,
                memoriesStyles.polaroidRight,
              ]}
            >
              <Image
                source={require("@/assets/images/memory_stargazing.jpg")}
                style={memoriesStyles.polaroidImage}
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
              style={[
                memoriesStyles.polaroidCard,
                memoriesStyles.polaroidCenter,
              ]}
            >
              <Image
                source={require("@/assets/images/memory_cafe.jpg")}
                style={memoriesStyles.polaroidImage}
                resizeMode="cover"
              />
            </MotiView>
          </View>
        </View>

        <View style={memoriesStyles.footer}>
          <Pressable
            style={memoriesStyles.continueButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={memoriesStyles.continueButtonGradient}
            >
              <Text style={memoriesStyles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
