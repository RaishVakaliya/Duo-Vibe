import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { useSessionAuth } from "@/src/context/auth-context";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { getInitial } from "@/src/lib/profile";
import { uploadAvatarImage } from "@/src/lib/profile/upload-avatar";
import { requestPhotoLibraryPermission } from "@/src/utils/permissions";


export default function EditProfileScreen() {
  const router = useRouter();
  const { user, userName, avatarUrl, updateProfile } = useSessionAuth();
  const { showAlert } = useAlert();

  const [name, setName] = useState<string>(userName ?? "");
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(
    avatarUrl ?? null,
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handlePickFromGallery = async (): Promise<void> => {
    try {
      const hasPermission = await requestPhotoLibraryPermission(
        "Please allow photo library access to choose your profile picture.",
      );
      if (!hasPermission) return;


      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0]?.uri;
        if (uri) {
          setPickedImageUri(uri);
          Haptics.selectionAsync();
        }
      }
    } catch (err) {
      console.warn("Error picking image from gallery:", err);
      showAlert({
        title: "Gallery Error",
        message: "Failed to pick image from gallery. Please try again.",
      });
    }
  };

  const handleSave = async (): Promise<void> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      showAlert({
        title: "Name Required",
        message: "Please enter your name.",
      });
      return;
    }

    try {
      setIsSaving(true);
      let finalAvatarUrl: string | undefined = undefined;

      if (pickedImageUri && pickedImageUri !== avatarUrl) {
        if (
          pickedImageUri.startsWith("file:") ||
          pickedImageUri.startsWith("content:") ||
          pickedImageUri.startsWith("data:")
        ) {
          if (user?.id) {
            finalAvatarUrl = await uploadAvatarImage(pickedImageUri, user.id);
          }
        } else {
          finalAvatarUrl = pickedImageUri;
        }
      }

      await updateProfile({
        fullName: trimmedName,
        avatarUrl: finalAvatarUrl ?? (pickedImageUri ? pickedImageUri : undefined),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      console.warn("Failed to save profile:", err);
      showAlert({
        title: "Save Error",
        message: "Failed to save profile changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Cancel editing and go back"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatarWrapper}>
              <Pressable
                style={styles.avatarRing}
                onPress={handlePickFromGallery}
                accessibilityRole="button"
                accessibilityLabel="Upload profile picture from gallery"
              >
                <View style={styles.avatarInner}>
                  {pickedImageUri ? (
                    <Image
                      source={{ uri: pickedImageUri }}
                      style={styles.avatarImage}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                      transition={150}
                      placeholder="rgba(255, 255, 255, 0.1)"
                    />
                  ) : (
                    <Text style={styles.avatarLetter}>{getInitial(name)}</Text>
                  )}
                </View>

                <View style={styles.cameraBadge}>
                  <Ionicons name="camera" size={17} color="#FFFFFF" />
                </View>
              </Pressable>

              <Pressable
                onPress={handlePickFromGallery}
                accessibilityRole="button"
                accessibilityLabel="Change photo text button"
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </Pressable>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                maxLength={35}
                autoCapitalize="words"
                selectionColor="#FF4D6D"
              />
              <Text style={styles.inputHelper}>
                This is the name your partner sees on sparks & games.
              </Text>
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel="Save profile changes"
            >
              <LinearGradient
                colors={[...GRADIENTS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
