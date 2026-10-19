import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { AppBottomSheetProps } from "./types";
import { styles } from "./styles";

export function AppBottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  scrollable = true,
  footer,
  headerRight,
  showHandleBar = true,
  showCloseButton = true,
  avoidKeyboard = true,
  sheetStyle,
  contentContainerStyle,
  disabled = false,
}: AppBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setIsKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const safeBottomPadding = isKeyboardVisible
    ? 16
    : Math.max(insets.bottom, Platform.OS === "android" ? 44 : 20);

  const handleBackdropPress = () => {
    if (!disabled) {
      onClose();
    }
  };

  const body = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces={false}
      automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.plainContent, contentContainerStyle]}>{children}</View>
  );

  const container = (
    <View
      style={[
        styles.sheetContainer,
        { paddingBottom: footer ? 0 : safeBottomPadding },
        sheetStyle,
      ]}
    >
      {showHandleBar && <View style={styles.handleBar} />}

      {(title || subtitle || showCloseButton || headerRight) && (
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
            {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
          </View>

          {headerRight ?? (
            showCloseButton ? (
              <Pressable
                onPress={onClose}
                disabled={disabled}
                style={styles.closeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Close sheet"
              >
                <Ionicons name="close" size={18} color={COLORS.white} />
              </Pressable>
            ) : null
          )}
        </View>
      )}

      {body}

      {footer && (
        <View
          style={[
            styles.footerContainer,
            { paddingBottom: safeBottomPadding },
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleBackdropPress}
      statusBarTranslucent
    >
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
          keyboardVerticalOffset={0}
        >
          <Pressable
            style={styles.backdropTouchable}
            onPress={handleBackdropPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Dismiss modal"
          />
          {container}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdropTouchable}
            onPress={handleBackdropPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Dismiss modal"
          />
          {container}
        </View>
      )}
    </Modal>
  );
}
