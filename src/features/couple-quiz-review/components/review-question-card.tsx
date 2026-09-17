import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";
import { ReviewQuestionCardProps } from "../types";

export function ReviewQuestionCard({
  currentIndex,
  total,
  currentAnswer,
  currentGrade,
  onGrade,
}: ReviewQuestionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.progressCounter}>
        Question {currentIndex + 1} of {total}
      </Text>

      <Text style={styles.questionText}>
        {currentAnswer?.question?.question ?? "Question"}
      </Text>

      <View style={styles.optionsContainer}>
        {currentAnswer?.question?.options.map((option) => {
          const isGuessed = option.label === currentAnswer.guessed_option;

          return (
            <View
              key={option.label}
              style={[
                styles.optionPill,
                isGuessed && styles.optionPillGuessed,
              ]}
            >
              <View style={styles.optionEmojiWrap}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
              </View>

              <Text
                style={[
                  styles.optionText,
                  isGuessed && styles.optionTextGuessed,
                ]}
              >
                {option.label}
              </Text>

              {isGuessed && (
                <View style={styles.partnerGuessBadge}>
                  <Ionicons name="heart" size={12} color="#FFFFFF" />
                  <Text style={styles.partnerGuessBadgeText}>Their Guess</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.gradingTitle}>Is this correct about you?</Text>

      <View style={styles.gradingButtonsRow}>
        <Pressable
          style={[
            styles.gradeButton,
            currentGrade === true
              ? styles.correctButtonActive
              : styles.correctButtonInactive,
          ]}
          onPress={() => onGrade(true)}
          accessibilityRole="button"
          accessibilityLabel="Mark as correct"
        >
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={currentGrade === true ? "#FFFFFF" : "#059669"}
          />
          <Text
            style={[
              styles.gradeButtonText,
              currentGrade === true
                ? styles.gradeButtonTextActive
                : styles.gradeButtonTextInactiveCorrect,
            ]}
          >
            Correct
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.gradeButton,
            currentGrade === false
              ? styles.wrongButtonActive
              : styles.wrongButtonInactive,
          ]}
          onPress={() => onGrade(false)}
          accessibilityRole="button"
          accessibilityLabel="Mark as wrong"
        >
          <Ionicons
            name="close-circle"
            size={22}
            color={currentGrade === false ? "#FFFFFF" : "#DC2626"}
          />
          <Text
            style={[
              styles.gradeButtonText,
              currentGrade === false
                ? styles.gradeButtonTextActive
                : styles.gradeButtonTextInactiveWrong,
            ]}
          >
            Wrong
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
