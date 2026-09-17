import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { useQuizReview } from "./use-quiz-review";
import { ReviewProgressHeader } from "./components/review-progress-header";
import { ReviewQuestionCard } from "./components/review-question-card";

export default function CoupleQuizReviewScreen() {
  const {
    isLoading,
    isSubmitting,
    currentIndex,
    total,
    currentAnswer,
    isFirst,
    isLast,
    currentGrade,
    progressFraction,
    handleGrade,
    handlePrevious,
    handleNextOrSubmit,
    handleBack,
  } = useQuizReview();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <ReviewProgressHeader
          progressFraction={progressFraction}
          onBack={handleBack}
        />

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FF2D6C" />
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ReviewQuestionCard
                currentIndex={currentIndex}
                total={total}
                currentAnswer={currentAnswer}
                currentGrade={currentGrade}
                onGrade={handleGrade}
              />
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.prevButton,
                  isFirst && styles.prevButtonDisabled,
                ]}
                onPress={handlePrevious}
                disabled={isFirst}
                accessibilityRole="button"
                accessibilityLabel="Previous question"
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={isFirst ? "#CBD5E1" : "#1E1B26"}
                />
                <Text
                  style={[
                    styles.prevButtonText,
                    isFirst && styles.prevButtonTextDisabled,
                  ]}
                >
                  Previous
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.nextButton,
                  (currentGrade === undefined || isSubmitting) &&
                  styles.nextButtonDisabled,
                ]}
                onPress={handleNextOrSubmit}
                disabled={currentGrade === undefined || isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={isLast ? "Submit Review" : "Next question"}
              >
                <LinearGradient
                  colors={
                    currentGrade !== undefined && !isSubmitting
                      ? [...GRADIENTS.primaryAction]
                      : [...GRADIENTS.buttonDisabled]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButtonGradient}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.nextButtonText}>
                      {isLast ? "Submit Review" : "Next"}
                    </Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
