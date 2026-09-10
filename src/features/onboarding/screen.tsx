import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { RelationshipType } from "@/src/types";

export default function RelationshipTypeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<RelationshipType>("long_distance");

  const handleContinue = () => {
    router.push(ROUTES.DATE_IDEAS);
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
              style={[styles.progressBarFill, { width: "25%" }]}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Is your relationship local or long-distance?
          </Text>

          <View style={styles.optionsContainer}>
            <Pressable
              style={styles.optionCard}
              onPress={() => setSelected("local")}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === "local" }}
            >
              {selected === "local" ? (
                <LinearGradient
                  colors={[...GRADIENTS.optionSelected]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.optionSelectedGradient}
                >
                  <Text style={styles.optionEmoji}>🏠</Text>
                  <Text style={styles.optionTextSelected}>Local</Text>
                </LinearGradient>
              ) : (
                <View style={styles.optionUnselected}>
                  <Text style={styles.optionEmoji}>🏠</Text>
                  <Text style={styles.optionTextUnselected}>Local</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={styles.optionCard}
              onPress={() => setSelected("long_distance")}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === "long_distance" }}
            >
              {selected === "long_distance" ? (
                <LinearGradient
                  colors={[...GRADIENTS.optionSelected]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.optionSelectedGradient}
                >
                  <Text style={styles.optionEmoji}>🌍</Text>
                  <Text style={styles.optionTextSelected}>Long Distance</Text>
                </LinearGradient>
              ) : (
                <View style={styles.optionUnselected}>
                  <Text style={styles.optionEmoji}>🌍</Text>
                  <Text style={styles.optionTextUnselected}>Long Distance</Text>
                </View>
              )}
            </Pressable>
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
