import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { onboardingStyles } from "@/styles/onboarding.styles";
import { GRADIENTS } from "@/constants/colors";

type RelationshipType = "local" | "long_distance";

export default function RelationshipTypeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<RelationshipType>("long_distance");

  const handleContinue = () => {
    // Navigate to next screen (or signup for now)
    router.push("/signup");
  };

  return (
    <View style={onboardingStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={onboardingStyles.gradientBackground}
      />

      <SafeAreaView style={onboardingStyles.safeArea}>
        <View style={onboardingStyles.headerRow}>
          <Pressable
            style={onboardingStyles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={onboardingStyles.progressBarTrack}>
            <LinearGradient
              colors={[...GRADIENTS.progressBar]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[onboardingStyles.progressBarFill, { width: "25%" }]}
            />
          </View>
        </View>

        <View style={onboardingStyles.content}>
          <Text style={onboardingStyles.title}>
            Is your relationship local or long-distance?
          </Text>

          <View style={onboardingStyles.optionsContainer}>
            <Pressable
              style={onboardingStyles.optionCard}
              onPress={() => setSelected("local")}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === "local" }}
            >
              {selected === "local" ? (
                <LinearGradient
                  colors={[...GRADIENTS.optionSelected]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={onboardingStyles.optionSelectedGradient}
                >
                  <Text style={onboardingStyles.optionEmoji}>🏠</Text>
                  <Text style={onboardingStyles.optionTextSelected}>Local</Text>
                </LinearGradient>
              ) : (
                <View style={onboardingStyles.optionUnselected}>
                  <Text style={onboardingStyles.optionEmoji}>🏠</Text>
                  <Text style={onboardingStyles.optionTextUnselected}>
                    Local
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={onboardingStyles.optionCard}
              onPress={() => setSelected("long_distance")}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === "long_distance" }}
            >
              {selected === "long_distance" ? (
                <LinearGradient
                  colors={[...GRADIENTS.optionSelected]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={onboardingStyles.optionSelectedGradient}
                >
                  <Text style={onboardingStyles.optionEmoji}>🌍</Text>
                  <Text style={onboardingStyles.optionTextSelected}>
                    Long Distance
                  </Text>
                </LinearGradient>
              ) : (
                <View style={onboardingStyles.optionUnselected}>
                  <Text style={onboardingStyles.optionEmoji}>🌍</Text>
                  <Text style={onboardingStyles.optionTextUnselected}>
                    Long Distance
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <View style={onboardingStyles.footer}>
          <Pressable
            style={onboardingStyles.continueButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={onboardingStyles.continueButtonGradient}
            >
              <Text style={onboardingStyles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
