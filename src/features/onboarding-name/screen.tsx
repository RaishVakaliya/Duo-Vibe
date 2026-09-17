import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";

export default function OnboardingNameScreen() {
  const router = useRouter();
  const { userName, setUserName } = useAuth();
  const [name, setName] = useState<string>(userName ?? "");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isNameValid = name.trim().length > 0;

  const handleContinue = async (): Promise<void> => {
    if (!isNameValid) return;
    await setUserName(name.trim());
    router.push(ROUTES.ONBOARDING);
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
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.progressBarTrack}>
            <LinearGradient
              colors={[...GRADIENTS.progressBar]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: "15%" }]}
            />
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.content}
        >
          <Text style={styles.title}>What's your name?</Text>

          <View
            style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="rgba(255, 255, 255, 0.35)"
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              selectionColor="#FF4D6D"
            />
          </View>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.continueButton,
              !isNameValid && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isNameValid}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            {isNameValid ? (
              <LinearGradient
                colors={[...GRADIENTS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            ) : (
              <Text
                style={[
                  styles.continueButtonText,
                  styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
