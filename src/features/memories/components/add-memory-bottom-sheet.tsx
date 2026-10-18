import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { AppBottomSheet } from "@/src/components/ui/app-bottom-sheet";
import { GradientButton } from "@/src/components/ui/gradient-button";
import { GRADIENTS } from "@/src/constants/colors";
import { createPhotoMemory } from "@/src/lib/memories";
import { requestPhotoLibraryPermission } from "@/src/utils/permissions";
import { AddMemoryBottomSheetProps } from "../types";

import { componentStyles } from "./component-styles";

export function AddMemoryBottomSheet({
  isOpen,
  coupleKey,
  userId,
  onClose,
  onMemoryCreated,
}: AddMemoryBottomSheetProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setPhotoUri(null);
    setPhotoBase64(null);
    setTitle("");
    setNote("");
    setSelectedDate(new Date());
    setShowDatePicker(false);
    setIsUploading(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    if (isUploading) return;
    resetForm();
    onClose();
  };

  const handlePickPhoto = async () => {
    try {
      const granted = await requestPhotoLibraryPermission(
        "Duo Vibe needs access to your gallery so you can choose photos for your shared couple memories.",
      );
      if (!granted) return;


      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setPhotoUri(result.assets[0].uri);
        setPhotoBase64(result.assets[0].base64 ?? null);
        setErrorMessage(null);
      }
    } catch (err) {
      console.warn("[memories] Image pick error:", err);
      setErrorMessage("Could not open photo library. Please try again.");
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "set" && date) {
      setSelectedDate(date);
    }
  };

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedIsoDate: string =
    selectedDate.toISOString().split("T")[0] ??
    new Date().toISOString().slice(0, 10);

  const handleSave = async () => {
    if (!photoUri) {
      setErrorMessage("Please pick a photo for this memory.");
      return;
    }
    if (!title.trim()) {
      setErrorMessage("Please give your memory a title.");
      return;
    }
    if (!coupleKey || !userId) {
      setErrorMessage("Missing partner connection. Please try again.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const newMemory = await createPhotoMemory({
        coupleKey,
        userId,
        title: title.trim(),
        note: note.trim() || undefined,
        memoryDate: formattedIsoDate,
        imageUri: photoUri,
        imageBase64: photoBase64 ?? undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onMemoryCreated(newMemory);
      resetForm();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to upload memory. Please try again.";
      setErrorMessage(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsUploading(false);
    }
  };

  const isSaveDisabled =
    isUploading || !photoUri || title.trim().length === 0;

  return (
    <AppBottomSheet
      visible={isOpen}
      onClose={handleClose}
      title="New Memory"
      scrollable
      footer={
        <GradientButton
          label="Save Memory"
          rightIcon={<Ionicons name="sparkles" size={18} color="#FFFFFF" />}
          loading={isUploading}
          disabled={isSaveDisabled}
          colors={GRADIENTS.buttonCoralAmber}
          onPress={handleSave}
          accessibilityLabel="Save memory"
        />
      }
    >
      {/* Photo Picker Box */}
            <Pressable
              style={[
                componentStyles.photoPickerBox,
                photoUri ? componentStyles.photoPickerBoxActive : null,
              ]}
              onPress={handlePickPhoto}
              disabled={isUploading}
              accessibilityRole="button"
              accessibilityLabel="Pick photo"
            >
              {photoUri ? (
                <>
                  <Image
                    source={{ uri: photoUri }}
                    style={componentStyles.pickedPhoto}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={150}
                  />
                  <View style={componentStyles.changePhotoButton}>
                    <Ionicons name="camera" size={14} color="#FFFFFF" />
                    <Text style={componentStyles.changePhotoText}>Change</Text>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons name="camera-outline" size={36} color="#FFE2E6" />
                  <Text style={componentStyles.pickerPlaceholderText}>
                    Add Photo
                  </Text>
                  <Text style={componentStyles.pickerHintText}>
                    From your camera roll
                  </Text>
                </>
              )}
            </Pressable>

            {/* Title Input */}
            <View style={componentStyles.inputGroup}>
              <View style={componentStyles.inputLabelRow}>
                <Text style={componentStyles.inputLabel}>Title *</Text>
                <Text style={componentStyles.inputCharCount}>
                  {title.length}/60
                </Text>
              </View>
              <TextInput
                style={componentStyles.textInput}
                placeholder="e.g. Rainy coffee date, Beach trip"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={title}
                onChangeText={(t) => setTitle(t.slice(0, 60))}
                maxLength={60}
                editable={!isUploading}
                returnKeyType="next"
              />
            </View>

            {/* Date Picker Button */}
            <View style={componentStyles.inputGroup}>
              <View style={componentStyles.inputLabelRow}>
                <Text style={componentStyles.inputLabel}>Date</Text>
              </View>
              <Pressable
                style={componentStyles.dateSelectButton}
                onPress={() => setShowDatePicker(true)}
                disabled={isUploading}
                accessibilityRole="button"
                accessibilityLabel="Choose date"
              >
                <View style={componentStyles.dateSelectValueRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#FFE2E6"
                  />
                  <Text style={componentStyles.dateSelectValue}>
                    {formattedDate}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="rgba(255, 255, 255, 0.5)"
                />
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                  textColor="#FFFFFF"
                />
              )}
            </View>

            {/* Note Input */}
            <View style={componentStyles.inputGroup}>
              <View style={componentStyles.inputLabelRow}>
                <Text style={componentStyles.inputLabel}>
                  Note (optional)
                </Text>
                <Text style={componentStyles.inputCharCount}>
                  {note.length}/300
                </Text>
              </View>
              <TextInput
                style={[componentStyles.textInput, componentStyles.textArea]}
                placeholder="A small thought or sweet memory from the day..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={note}
                onChangeText={(t) => setNote(t.slice(0, 300))}
                maxLength={300}
                multiline
                editable={!isUploading}
              />
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <Text style={componentStyles.errorText}>
                {errorMessage}
              </Text>
            ) : null}

    </AppBottomSheet>
  );
}
