import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MemoryCardProps } from "../types";
import { styles } from "../styles";

import { formatShortDate } from "@/src/utils/date";

export const MemoryCard = React.memo(function MemoryCard({
  memory,
  index,
  onPress,
  onToggleReaction,
}: MemoryCardProps) {
  const rotation = index % 2 === 0 ? "-2deg" : "2deg";

  const handleHeartPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleReaction(memory);
  };

  const handleCardPress = () => {
    Haptics.selectionAsync();
    onPress(memory);
  };

  const formattedDate = formatShortDate(memory.memory_date);

  return (
    <View style={styles.cardWrapper}>
      <Pressable
        style={[styles.polaroidCard, { transform: [{ rotate: rotation }] }]}
        onPress={handleCardPress}
        accessibilityRole="button"
        accessibilityLabel={`Memory: ${memory.title}`}
      >
        <View style={styles.polaroidImageContainer}>
          {memory.image_url ? (
            <Image
              source={{ uri: memory.image_url }}
              style={styles.polaroidPhoto}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.polaroidPhoto,
                {
                  backgroundColor: "#2A1828",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons name="image-outline" size={36} color="#FFE2E6" />
            </View>
          )}
        </View>

        <View style={styles.polaroidFooter}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {memory.title}
            </Text>
          </View>
          <Text style={styles.cardDateText}>{formattedDate}</Text>

          <View style={styles.cardMetaRow}>
            <View style={styles.creatorRow}>
              {memory.creator?.avatarUrl ? (
                <Image
                  source={{ uri: memory.creator.avatarUrl }}
                  style={styles.creatorAvatar}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={150}
                  placeholder="rgba(255, 255, 255, 0.1)"
                />
              ) : (
                <View
                  style={[
                    styles.creatorAvatar,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#FFE4E6",
                    },
                  ]}
                >
                  <Ionicons name="person" size={14} color="#FF2D55" />
                </View>
              )}
              <Text style={styles.creatorName} numberOfLines={1}>
                {memory.creator?.fullName?.split(" ")[0] || "Partner"}
              </Text>
            </View>

            <Pressable
              style={[
                styles.heartButton,
                memory.has_reacted && styles.heartButtonActive,
              ]}
              onPress={handleHeartPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="React with heart"
            >
              <Ionicons
                name={memory.has_reacted ? "heart" : "heart-outline"}
                size={16}
                color="#FF2D55"
              />
              {memory.reactions_count > 0 && (
                <Text style={styles.heartCount}>{memory.reactions_count}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
});
