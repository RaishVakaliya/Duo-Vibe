import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { calculateCrush } from "@/src/lib/crushCalculator";

export default function CrushCalculatorScreen() {
  const router = useRouter();

  const [yourName, setYourName] = useState<string>("");
  const [crushName, setCrushName] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [router]),
  );

  const isFormValid = yourName.trim().length > 0 && crushName.trim().length > 0;

  const handleCalculate = (): void => {
    if (!isFormValid) return;
    const result = calculateCrush(yourName, crushName);
    router.push({
      pathname: ROUTES.CRUSH_CALCULATOR_RESULT,
      params: {
        yourName: yourName.trim(),
        crushName: crushName.trim(),
        percentage: String(result.percentage),
        headline: result.headline,
        message: result.message,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.headerContainer}>
          <View style={styles.topNavRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace(ROUTES.HOME)}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>

            <View style={styles.headerTitleRow}>
              <Ionicons
                name="heart"
                size={22}
                color="#FF2D55"
                style={styles.headerHeartIcon}
              />
              <Text style={styles.headerTitle}>Crush Calculator</Text>
            </View>

            <View style={styles.headerSpacer} />
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
            style={styles.headerTextSection}
          >
            <Text style={styles.mainTitle}>Calculate Your Crush ✨</Text>
            <Text style={styles.subtitle}>
              Enter your name and find out what your crush feels!
            </Text>
          </MotiView>
        </View>

        <View style={styles.contentContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.cardsContainer}>
                <MotiView
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 16 }}
                  style={styles.inputCard}
                >
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <View style={styles.inputRow}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="You"
                      placeholderTextColor="#94A3B8"
                      value={yourName}
                      onChangeText={setYourName}
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={24}
                      accessibilityLabel="Enter your name"
                    />
                  </View>
                </MotiView>

                <MotiView
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 16, delay: 100 }}
                  style={styles.inputCard}
                >
                  <Text style={styles.inputLabel}>Crush Name</Text>
                  <View style={styles.inputRow}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Crush"
                      placeholderTextColor="#94A3B8"
                      value={crushName}
                      onChangeText={setCrushName}
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={24}
                      accessibilityLabel="Enter crush name"
                    />
                  </View>
                </MotiView>
              </View>

              <Pressable
                style={[
                  styles.calculateButton,
                  !isFormValid && styles.calculateButtonDisabled,
                ]}
                onPress={handleCalculate}
                disabled={!isFormValid}
                accessibilityRole="button"
                accessibilityLabel="Calculate crush compatibility"
              >
                <LinearGradient
                  colors={
                    isFormValid
                      ? ["#FF4D6D", "#FF2D55", "#E11D48"]
                      : ["#CBD5E1", "#94A3B8"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.calculateGradient}
                >
                  <Text style={styles.calculateText}>Calculate</Text>
                </LinearGradient>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
}
