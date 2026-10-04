import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";
import { ImageViewerModalProps } from "../types";

export function ImageViewerModal({
  isVisible,
  imageUri,
  onClose,
}: ImageViewerModalProps) {
  const insets = useSafeAreaInsets();
  if (!imageUri) return null;

  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? RNStatusBar.currentHeight || 28 : 20,
  );

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.imageViewerContainer}>
        <StatusBar style="light" translucent />

        {/* Top safe area spacer for camera notch & status bar */}
        <View style={{ height: topInset }} />

        {/* Header Bar positioned cleanly below camera notch */}
        <View style={styles.imageViewerHeader}>
          <Pressable
            style={styles.imageViewerBackBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close full screen photo"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.imageViewerTitle}>Photo</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Full Screen Image View */}
        <Pressable style={styles.imageViewerBody} onPress={onClose}>
          <Image
            source={{ uri: imageUri }}
            style={styles.imageViewerFullImage}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </Modal>
  );
}
