import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { useAuth } from "@/src/context/auth";
import { useAlert } from "@/src/components/ui/alert-dialog";

export default function EditProfileScreen() {
  const router = useRouter();
  const { userName, avatarUrl, updateProfile } = useAuth();
  const { showAlert } = useAlert();

  const [name, setName] = useState<string>(userName ?? "");
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(
    avatarUrl ?? null,
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const getInitial = (str: string | null): string => {
    if (!str || !str.trim()) return "D";
    return str.trim().charAt(0).toUpperCase();
  };

  const handlePickFromGallery = async (): Promise<void> => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        showAlert({
          title: "Permission Required",
          message: "Please allow photo library access to choose your profile picture.",
        });
        return;
      }

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
      await updateProfile({
        fullName: trimmedName,
        avatarUrl: pickedImageUri ?? undefined,
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

  const isUrl = (val: string | null): boolean => {
    if (!val) return false;
    return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("file://") || val.startsWith("data:");
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
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
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
                  {pickedImageUri && isUrl(pickedImageUri) ? (
                    <Image
                      source={{ uri: pickedImageUri }}
                      style={styles.avatarImage}
                      resizeMode="cover"
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
