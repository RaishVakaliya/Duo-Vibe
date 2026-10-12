import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CouplePlan } from "@/src/types";

let Notifications: typeof import("expo-notifications") | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require("expo-notifications");
} catch {
  Notifications = null;
}

const STORAGE_PREFIX = "couple_plan_reminders_";

export async function cancelPlanReminders(planId: string): Promise<void> {
  if (Platform.OS === "web" || !Notifications) return;

  try {
    const key = `${STORAGE_PREFIX}${planId}`;
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      await Promise.all(
        ids.map(async (id) => {
          try {
            await Notifications?.cancelScheduledNotificationAsync(id);
          } catch {
            // Ignore individual cancellation failure
          }
        }),
      );
      await AsyncStorage.removeItem(key);
    }
  } catch (err) {
    console.warn("Failed to cancel plan reminders:", err);
  }
}

export async function reconcilePlanReminders(plans: CouplePlan[]): Promise<void> {
  if (Platform.OS === "web" || !Notifications) return;

  try {
    const now = new Date();
    const activeUpcomingPlans = plans.filter(
      (p) => !p.done_at && new Date(p.starts_at).getTime() > now.getTime(),
    );

    // Cancel reminders for completed plans
    const completedPlans = plans.filter((p) => Boolean(p.done_at));
    for (const completed of completedPlans) {
      await cancelPlanReminders(completed.id);
    }

    // Schedule reminders for upcoming active plans
    for (const plan of activeUpcomingPlans) {
      // Cancel previous to prevent duplicate triggers
      await cancelPlanReminders(plan.id);

      const startsAt = new Date(plan.starts_at);
      const scheduledIds: string[] = [];

      // 1. Day before at 9:00 AM
      const dayBefore = new Date(
        startsAt.getFullYear(),
        startsAt.getMonth(),
        startsAt.getDate() - 1,
        9,
        0,
        0,
        0,
      );

      if (dayBefore.getTime() > now.getTime()) {
        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Plan Tomorrow! 🗓️",
              body: `Reminder: "${plan.title}" is scheduled for tomorrow.`,
              sound: true,
              data: {
                type: "plan_reminder",
                planId: plan.id,
                timing: "day_before",
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: dayBefore,
            },
          });
          scheduledIds.push(id);
        } catch {
          // ignore
        }
      }

      // 2. 1 hour before
      const oneHourBefore = new Date(startsAt.getTime() - 60 * 60 * 1000);
      if (oneHourBefore.getTime() > now.getTime()) {
        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Plan Coming Up Soon! ✨",
              body: `"${plan.title}" starts in 1 hour!`,
              sound: true,
              data: {
                type: "plan_reminder",
                planId: plan.id,
                timing: "one_hour_before",
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: oneHourBefore,
            },
          });
          scheduledIds.push(id);
        } catch {
          // ignore
        }
      }

      if (scheduledIds.length > 0) {
        await AsyncStorage.setItem(
          `${STORAGE_PREFIX}${plan.id}`,
          JSON.stringify(scheduledIds),
        );
      }
    }
  } catch (err) {
    console.warn("Failed to reconcile plan reminders:", err);
  }
}
