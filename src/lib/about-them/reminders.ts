import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let Notifications: typeof import("expo-notifications") | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require("expo-notifications");
} catch {
  Notifications = null;
}

const STORAGE_PREFIX = "about_them_reminders_";

export async function cancelAboutThemReminders(fieldKey: "birthday" | "anniversary"): Promise<void> {
  if (Platform.OS === "web" || !Notifications) return;

  try {
    const storageKey = `${STORAGE_PREFIX}${fieldKey}`;
    const rawIds = await AsyncStorage.getItem(storageKey);
    if (rawIds) {
      const ids: string[] = JSON.parse(rawIds);
      await Promise.all(
        ids.map(async (id) => {
          try {
            await Notifications?.cancelScheduledNotificationAsync(id);
          } catch {
            // Ignore individual cancel failure
          }
        }),
      );
      await AsyncStorage.removeItem(storageKey);
    }
  } catch (err) {
    console.warn("Failed to cancel about them reminders:", err);
  }
}

export async function scheduleAboutThemReminders(
  fieldKey: "birthday" | "anniversary",
  dateString: string | null | undefined,
  partnerName?: string | null,
): Promise<void> {
  if (Platform.OS === "web" || !Notifications) return;

  // First cancel any existing scheduled reminders for this field
  await cancelAboutThemReminders(fieldKey);

  if (!dateString) return;

  try {
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return;

    const month = parsed.getMonth(); // 0-indexed
    const day = parsed.getDate();
    const now = new Date();

    // Determine next event occurrence at 9:00 AM
    let nextEvent = new Date(now.getFullYear(), month, day, 9, 0, 0, 0);
    if (nextEvent.getTime() <= now.getTime()) {
      nextEvent = new Date(now.getFullYear() + 1, month, day, 9, 0, 0, 0);
    }

    const displayName = partnerName && partnerName.trim().length > 0 ? partnerName.trim() : "your partner";
    const isBirthday = fieldKey === "birthday";

    const reminders = [
      {
        offsetDays: 7,
        triggerDate: new Date(nextEvent.getTime() - 7 * 24 * 60 * 60 * 1000),
        title: isBirthday ? "Birthday Coming Up! 🎂" : "Anniversary Coming Up! 💖",
        body: isBirthday
          ? `${displayName}’s birthday is in 7 days.`
          : `Your anniversary is in 7 days.`,
      },
      {
        offsetDays: 1,
        triggerDate: new Date(nextEvent.getTime() - 1 * 24 * 60 * 60 * 1000),
        title: isBirthday ? "Birthday Tomorrow! 🎂" : "Anniversary Tomorrow! 💖",
        body: isBirthday
          ? `${displayName}’s birthday is tomorrow!`
          : `Your anniversary with ${displayName} is tomorrow!`,
      },
      {
        offsetDays: 0,
        triggerDate: new Date(nextEvent.getTime()),
        title: isBirthday ? "Happy Birthday! 🎂" : "Happy Anniversary! 💖",
        body: isBirthday
          ? `Today is ${displayName}’s birthday! Make it special ✨`
          : `Today is your anniversary with ${displayName}! 💕`,
      },
    ];

    const scheduledIds: string[] = [];

    for (const item of reminders) {
      if (item.triggerDate.getTime() > now.getTime()) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: item.title,
            body: item.body,
            sound: true,
            data: {
              type: "about_them_reminder",
              fieldKey,
              offsetDays: item.offsetDays,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: item.triggerDate,
          },
        });
        scheduledIds.push(id);
      }
    }

    if (scheduledIds.length > 0) {
      await AsyncStorage.setItem(
        `${STORAGE_PREFIX}${fieldKey}`,
        JSON.stringify(scheduledIds),
      );
    }
  } catch (err) {
    console.warn("Failed to schedule about them reminders:", err);
  }
}
