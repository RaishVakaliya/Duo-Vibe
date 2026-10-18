import { Linking, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export interface PermissionAlertAction {
  title?: string;
  message?: string;
  settingsButtonText?: string;
  cancelButtonText?: string;
}

export async function requestPhotoLibraryPermission(
  customMessage?: string,
): Promise<boolean> {
  try {
    const { status, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      return true;
    }

    if (!canAskAgain && (Platform.OS as string) !== "web") {
      Alert.alert(
        "Permission Blocked",
        customMessage ??
          "Photo library access is blocked. Please enable it in Settings to select photos for Duo Vibe.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings().catch(() => {});
            },
          },
        ],
      );
    } else {
      Alert.alert(
        "Permission Needed",
        customMessage ??
          "Duo Vibe needs photo library access so you can pick and share photos with your partner.",
        [{ text: "OK", style: "default" }],
      );
    }

    return false;
  } catch (err) {
    console.warn("[permissions] Failed to request photo permission:", err);
    return false;
  }
}
