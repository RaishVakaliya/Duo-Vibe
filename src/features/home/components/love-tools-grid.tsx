import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "../styles";
import { LoveToolItem, LoveToolsGridProps } from "../types";
import { ROUTES } from "@/src/constants/routes";

export const DEFAULT_LOVE_TOOLS: readonly LoveToolItem[] = [
  {
    id: "love-match",
    title: "Love Match",
    icon: "heart",
    iconColor: "#FF4D6D",
    backgroundColor: "rgba(255, 77, 109, 0.12)",
    borderColor: "rgba(255, 77, 109, 0.25)",
    route: ROUTES.LOVE_MATCH,
  },
  {
    id: "crush-test",
    title: "Crush Test",
    icon: "flame",
    iconColor: "#FF7A00",
    backgroundColor: "rgba(255, 122, 0, 0.12)",
    borderColor: "rgba(255, 122, 0, 0.25)",
    route: ROUTES.CRUSH_CALCULATOR,
  },
  {
    id: "couple-quiz",
    title: "Couple Quiz",
    icon: "people",
    iconColor: "#A855F7",
    backgroundColor: "rgba(168, 85, 247, 0.12)",
    borderColor: "rgba(168, 85, 247, 0.25)",
    route: ROUTES.COUPLE_QUIZ,
  },
  {
    id: "21-questions",
    title: "21 Questions",
    icon: "chatbubble-ellipses",
    iconColor: "#0EA5E9",
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    borderColor: "rgba(14, 165, 233, 0.25)",
    route: ROUTES.TWENTY_ONE_QUESTIONS,
  },
  {
    id: "secret-crush",
    title: "Secret Crush",
    icon: "mail",
    iconColor: "#F43F5E",
    backgroundColor: "rgba(244, 63, 94, 0.12)",
    borderColor: "rgba(244, 63, 94, 0.25)",
  },
  {
    id: "couple-challenge",
    title: "Couple Challenge",
    icon: "calendar",
    iconColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
];

export function LoveToolsGrid({
  tools = DEFAULT_LOVE_TOOLS,
  onToolPress,
}: LoveToolsGridProps) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="heart" size={18} color="#FF4D6D" />
        <Text style={styles.sectionTitle}>Love Tools</Text>
      </View>

      <View style={styles.toolsGrid}>
        {tools.map((tool, idx) => (
          <MotiView
            key={tool.id}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 350,
              delay: 150 + idx * 40,
            }}
            style={[
              styles.toolCard,
              {
                backgroundColor: tool.backgroundColor,
                borderColor: tool.borderColor,
              },
            ]}
          >
            <Pressable
              style={{ alignItems: "center", width: "100%" }}
              onPress={() => onToolPress(tool)}
              accessibilityRole="button"
              accessibilityLabel={tool.title}
            >
              <View
                style={[
                  styles.toolIconContainer,
                  { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                ]}
              >
                <Ionicons
                  name={tool.icon}
                  size={22}
                  color={tool.iconColor}
                />
              </View>
              <Text style={styles.toolTitle} numberOfLines={2}>
                {tool.title}
              </Text>
            </Pressable>
          </MotiView>
        ))}
      </View>
    </View>
  );
}
