import React, { useEffect, useCallback } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { CardItem } from "./card-item";
import { styles } from "../styles";
import { SwipeDeckProps } from "../types";
import { FlagVote } from "@/src/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;

export const SwipeDeck = React.memo(function SwipeDeck({
  statements,
  currentIndex,
  canUndo,
  isAnimating,
  statToast,
  onVote,
  onUndo,
  onBack,
}: SwipeDeckProps) {
  const currentStatement = statements[currentIndex];
  const nextStatement = statements[currentIndex + 1];
  const total = statements.length;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Reset shared values when card changes
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [currentIndex, translateX, translateY]);

  const completeSwipe = useCallback(
    (vote: FlagVote) => {
      onVote(vote);
    },
    [onVote],
  );

  const programmaticSwipe = useCallback(
    (vote: FlagVote) => {
      if (isAnimating) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const targetX = vote === "green" ? SCREEN_WIDTH * 1.3 : -SCREEN_WIDTH * 1.3;
      translateX.value = withTiming(
        targetX,
        { duration: 240 },
        (finished) => {
          if (finished) {
            runOnJS(completeSwipe)(vote);
          }
        },
      );
    },
    [isAnimating, translateX, completeSwipe],
  );

  // Pan gesture for swiping
  const panGesture = Gesture.Pan()
    .enabled(!isAnimating)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.4;
    })
    .onEnd((event) => {
      const isPastThreshold = Math.abs(event.translationX) > SWIPE_THRESHOLD;
      const velocity = event.velocityX;

      if (
        (isPastThreshold || Math.abs(velocity) > 800) &&
        event.translationX > 0
      ) {
        // Swipe Right -> Green Flag
        translateX.value = withTiming(
          SCREEN_WIDTH * 1.3,
          { duration: 220 },
          (finished) => {
            if (finished) {
              runOnJS(completeSwipe)("green");
            }
          },
        );
      } else if (
        (isPastThreshold || Math.abs(velocity) > 800) &&
        event.translationX < 0
      ) {
        // Swipe Left -> Red Flag
        translateX.value = withTiming(
          -SCREEN_WIDTH * 1.3,
          { duration: 220 },
          (finished) => {
            if (finished) {
              runOnJS(completeSwipe)("red");
            }
          },
        );
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 15, stiffness: 180 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 180 });
      }
    });

  // Top Card Animated Style
  const topCardAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH * 0.8, 0, SCREEN_WIDTH * 0.8],
      [-15, 0, 15],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  // Next Card Animated Style (subtle scale & lift as top card leaves)
  const nextCardAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0.94, 1],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0.75, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Stamp Opacities
  const greenStampStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [20, SWIPE_THRESHOLD * 0.8],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const redStampStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-20, -SWIPE_THRESHOLD * 0.8],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Undo and Progress */}
      <View style={styles.headerRow}>
        <Pressable
          style={styles.headerBackButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Red or Green Flag</Text>
          <View style={styles.headerProgressPill}>
            <Text style={styles.headerProgressText}>
              {currentIndex + 1} / {total}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.headerUndoButton,
            !canUndo && styles.headerUndoButtonDisabled,
          ]}
          onPress={onUndo}
          disabled={!canUndo || isAnimating}
          accessibilityRole="button"
          accessibilityLabel="Undo last swipe"
        >
          <Ionicons
            name="arrow-undo"
            size={20}
            color={canUndo ? "#FFA07A" : "rgba(255, 255, 255, 0.3)"}
          />
        </Pressable>
      </View>

      {/* Main Deck Container */}
      <View style={styles.deckContainer}>
        <View style={styles.deckStack}>
          {/* Card Underneath (Only rendered if next card exists) */}
          {nextStatement && (
            <Animated.View
              style={[styles.cardWrapper, nextCardAnimatedStyle]}
              pointerEvents="none"
            >
              <CardItem
                statement={nextStatement}
                index={currentIndex + 1}
                total={total}
              />
            </Animated.View>
          )}

          {/* Top Active Card */}
          {currentStatement && (
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[styles.cardWrapper, topCardAnimatedStyle]}
              >
                <CardItem
                  statement={currentStatement}
                  index={currentIndex}
                  total={total}
                />

                {/* GREEN Stamp (Fade-in on drag right) */}
                <Animated.View
                  style={[styles.stampGreen, greenStampStyle]}
                  pointerEvents="none"
                >
                  <Text style={styles.stampTextGreen}>GREEN FLAG</Text>
                </Animated.View>

                {/* RED Stamp (Fade-in on drag left) */}
                <Animated.View
                  style={[styles.stampRed, redStampStyle]}
                  pointerEvents="none"
                >
                  <Text style={styles.stampTextRed}>RED FLAG</Text>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          )}
        </View>

        {/* Solo Mode Stat Toast */}
        {statToast && (
          <View style={styles.statToastContainer}>
            <Ionicons name="stats-chart" size={15} color="#FFA07A" />
            <Text style={styles.statToastText}>{statToast}</Text>
          </View>
        )}
      </View>

      {/* Bottom Large Buttons for Accessibility & Direct Tap */}
      <View style={styles.deckActionsRow}>
        <Pressable
          style={styles.voteButtonRed}
          onPress={() => programmaticSwipe("red")}
          disabled={isAnimating}
          accessibilityRole="button"
          accessibilityLabel="Vote Red Flag"
        >
          <Ionicons name="flag" size={20} color="#FFFFFF" />
          <Text style={styles.voteButtonText}>Red Flag</Text>
        </Pressable>

        <Pressable
          style={styles.voteButtonGreen}
          onPress={() => programmaticSwipe("green")}
          disabled={isAnimating}
          accessibilityRole="button"
          accessibilityLabel="Vote Green Flag"
        >
          <Ionicons name="flag" size={20} color="#FFFFFF" />
          <Text style={styles.voteButtonText}>Green Flag</Text>
        </Pressable>
      </View>
    </View>
  );
});
