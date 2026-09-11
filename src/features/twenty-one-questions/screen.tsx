import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  BackHandler,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { ROUTES } from "@/src/constants/routes";
import { selectSessionQuestions } from "@/src/lib/questionSelector";
import { Question } from "@/data/questions";

const TOTAL = 21;

export default function TwentyOneQuestionsScreen() {
  const router = useRouter();

  const [questions] = useState<Question[]>(() => selectSessionQuestions());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState<boolean>(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };
      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => sub.remove();
    }, [router]),
  );

  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TOTAL - 1;
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const handleSelectOption = (option: string): void => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handlePrevious = (): void => {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleNext = (): void => {
    if (isLast) {
      triggerFinish();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const triggerFinish = (): void => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2200),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace(ROUTES.HOME);
    });
  };

  const progressFraction = (currentIndex + 1) / TOTAL;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFEBF0", "#FFDEE7"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace(ROUTES.HOME)}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1B26" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="chatbubbles" size={24} color="#FF2D6C" />
              <Text style={styles.headerTitle}>21 Questions</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Fun, deep and romantic questions to get to know your partner
              better.
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <MotiView
              animate={{ width: `${progressFraction * 100}%` }}
              transition={{ type: "timing", duration: 300 }}
              style={styles.progressBarFill}
            >
              <LinearGradient
                colors={["#FF4D6D", "#FF2D6C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1, borderRadius: 3 }}
              />
            </MotiView>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.questionCard}>
            <Text style={styles.progressCounter}>
              {currentIndex + 1} / {TOTAL}
            </Text>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedAnswer === option;

                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionPill,
                      isSelected && styles.optionPillSelected,
                    ]}
                    onPress={() => handleSelectOption(option)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={option}
                  >
                    <View style={styles.optionIcon}>
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={isSelected ? "#FF2D6C" : "#374151"}
                      />
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.prevButton, isFirst && styles.prevButtonDisabled]}
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
              !selectedAnswer && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!selectedAnswer}
            accessibilityRole="button"
            accessibilityLabel={isLast ? "Finish" : "Next question"}
          >
            <Text style={styles.nextButtonText}>
              {isLast ? "Finish 💕" : "Next"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {showToast && (
        <Animated.View
          style={[styles.toastContainer, { opacity: toastOpacity }]}
        >
          <Ionicons name="heart" size={22} color="#FF4D6D" />
          <Text style={styles.toastText}>
            Great conversation! 💕 Keep exploring each other.
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
