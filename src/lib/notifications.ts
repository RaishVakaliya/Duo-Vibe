import { Platform } from "react-native";
import Constants from "expo-constants";
import { supabase } from "@/src/lib/supabase";

const EAS_PROJECT_ID = "e03ddfb4-b07e-49a0-9661-5fbf95d81273";

// Safely resolve expo-notifications so missing native binaries in dev builds do not crash the app
let Notifications: typeof import("expo-notifications") | null = null;

try {
  Notifications = require("expo-notifications");
  if (
    Notifications &&
    typeof Notifications.setNotificationHandler === "function"
  ) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch (nativeErr) {
  console.log("Push notifications native module check note:", nativeErr);
  Notifications = null;
}

export async function registerForPushNotificationsAsync(
  userId: string,
): Promise<string | null> {
  if (Platform.OS === "web" || !Notifications) {
    return null;
  }

  try {
    // 1. Android Notification Channel configuration
    if (
      Platform.OS === "android" &&
      Notifications.setNotificationChannelAsync
    ) {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF2D6C",
        sound: "default",
      });
    }

    // 2. Permission check & request
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission not granted by user.");
      return null;
    }

    // 3. Obtain Expo Push Token using EAS Project ID
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId ??
      EAS_PROJECT_ID;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    const token = tokenData.data;

    console.log("Device push token obtained:", token);

    // 4. Save to Supabase profile
    if (token && userId) {
      const { error } = await supabase
        .from("profiles")
        .update({ push_token: token })
        .eq("id", userId);

      if (error) {
        console.warn("Failed to store push token in Supabase profile:", error);
      } else {
        console.log(
          "Push token successfully saved to Supabase profile for user:",
          userId,
        );
      }
    }

    return token;
  } catch (err: unknown) {
    console.warn("Error registering for push notifications:", err);
    return null;
  }
}

export interface SendPushNotificationParams {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function sendExpoPushNotification({
  to,
  title,
  body,
  data,
}: SendPushNotificationParams): Promise<boolean> {
  if (
    !to ||
    (!to.startsWith("ExponentPushToken") && !to.startsWith("ExpoPushToken"))
  ) {
    console.warn("Invalid Expo push token:", to);
    return false;
  }

  try {
    const payload = {
      to,
      sound: "default",
      title,
      body,
      data: data ?? {},
      priority: "high",
      channelId: "default",
    };

    console.log("Sending push notification payload:", payload);

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("Expo push service response:", responseData);
    return true;
  } catch (err: unknown) {
    console.warn("Failed to send Expo push notification:", err);
    return false;
  }
}
