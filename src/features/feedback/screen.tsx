import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { useAlert } from "@/src/components/ui/alert-dialog";

export default function FeedbackScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    const trimmed = feedback.trim();
    if (!trimmed) {
      showAlert({
        title: "Feedback Needed",
        message: "Please write a few thoughts or suggestions before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showAlert({
        title: "Thank You! 💕",
        message:
          "Your feedback has been received. Thank you for helping us shape Duo Vibe!",
        buttons: [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ],
      });
    }, 600);
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
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>Feedback</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.introCard}>
            <Text style={styles.headline}>Share Your Thoughts 💌</Text>
            <Text style={styles.subheadline}>
              Have an idea for a new game? Found an issue? Or just want to tell us
              how Duo Vibe made you smile? We read every message!
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Your Feedback</Text>
            <TextInput
              style={styles.textArea}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Tell us what you love or what we could do better..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              multiline
              selectionColor="#FF4D6D"
            />
          </View>

          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Submit feedback"
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              )}
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
