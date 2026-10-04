import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { styles } from "../styles";
import { ThemeModalProps } from "../types";
import { BG_THEMES, BUBBLE_THEMES } from "../chat-themes";

export function ThemeModal({
  isVisible,
  currentTheme,
  onClose,
  onSelectTheme,
}: ThemeModalProps) {
  const handleSelectBg = (bgId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onSelectTheme({
      ...currentTheme,
      bgId,
    });
  };

  const handleSelectBubble = (bubbleId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onSelectTheme({
      ...currentTheme,
      bubbleId,
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalDismissArea}
          onPress={onClose}
          accessibilityLabel="Dismiss theme modal"
        />

        <View style={styles.modalSheet}>
          <View style={styles.modalDragHandle} />

          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>Customize Chat Theme</Text>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close theme settings"
            >
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Section 1: Chat Background Wallpaper */}
          <View style={styles.themeSection}>
            <Text style={styles.themeSectionTitle}>Chat Wallpaper</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.themeScrollRow}
            >
              {BG_THEMES.map((theme) => {
                const isActive = currentTheme.bgId === theme.id;
                return (
                  <Pressable
                    key={theme.id}
                    style={styles.themeCard}
                    onPress={() => handleSelectBg(theme.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${theme.name} background`}
                  >
                    <View
                      style={[
                        styles.themeCircleWrap,
                        isActive && styles.themeCircleActive,
                      ]}
                    >
                      <LinearGradient
                        colors={[...theme.colors]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.themeCircle}
                      >
                        {isActive && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color="#FFFFFF"
                          />
                        )}
                      </LinearGradient>
                    </View>
                    <Text
                      style={[
                        styles.themeName,
                        isActive && styles.themeNameActive,
                      ]}
                    >
                      {theme.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Section 2: Message Bubble Color */}
          <View style={styles.themeSection}>
            <Text style={styles.themeSectionTitle}>Message Bubble Color</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.themeScrollRow}
            >
              {BUBBLE_THEMES.map((theme) => {
                const isActive = currentTheme.bubbleId === theme.id;
                return (
                  <Pressable
                    key={theme.id}
                    style={styles.themeCard}
                    onPress={() => handleSelectBubble(theme.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${theme.name} bubble color`}
                  >
                    <View
                      style={[
                        styles.themeCircleWrap,
                        isActive && styles.themeCircleActive,
                      ]}
                    >
                      <LinearGradient
                        colors={[...theme.colors]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.themeCircle}
                      >
                        {isActive && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color="#FFFFFF"
                          />
                        )}
                      </LinearGradient>
                    </View>
                    <Text
                      style={[
                        styles.themeName,
                        isActive && styles.themeNameActive,
                      ]}
                    >
                      {theme.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <Pressable
            style={styles.doneButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Apply and close"
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
