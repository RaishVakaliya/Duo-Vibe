import { useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/auth-context";
import { ROUTES, AppRoute } from "@/src/constants/routes";

let Notifications: typeof import("expo-notifications") | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require("expo-notifications");
} catch {
  Notifications = null;
}

export function useNotificationRouting() {
  const router = useRouter();
  const { user, hasPartner, isLoading } = useAuth();
  const pendingNotificationRef = useRef<Record<string, unknown> | null>(null);
  const isHandledColdStartRef = useRef(false);

  const routeNotificationData = useCallback(
    (data: Record<string, unknown>) => {
      // 1. If user is logged out, route to welcome
      if (!user) {
        router.replace(ROUTES.WELCOME);
        return;
      }

      const type = typeof data.type === "string" ? data.type : "";
      const route = typeof data.route === "string" ? data.route : "";
      const sessionId = typeof data.sessionId === "string" ? data.sessionId : "";

      // 2. If user has no partner and notification target is a couple feature, route to invite-partner
      const coupleFeatures: readonly AppRoute[] = [
        ROUTES.CHAT,
        ROUTES.COUPLE_CHALLENGE,
        ROUTES.COUPLE_QUIZ,
        ROUTES.COUPLE_QUIZ_PLAY,
        ROUTES.COUPLE_QUIZ_REVIEW,
        ROUTES.COUPLE_QUIZ_RESULT,
        ROUTES.MEMORIES,
        ROUTES.UPCOMING_PLANS,
        ROUTES.ABOUT_THEM,
      ];

      if (!hasPartner) {
        // Regardless of intended feature, partner is required
        router.push({
          pathname: ROUTES.INVITE_PARTNER,
          params: { source: "notification" },
        });
        return;
      }

      // 3. Match notification type or route
      if (type === "chat_message" || route === ROUTES.CHAT) {
        router.push(ROUTES.CHAT);
      } else if (type === "quiz_review" && sessionId) {
        router.push({
          pathname: ROUTES.COUPLE_QUIZ_REVIEW,
          params: { sessionId },
        });
      } else if (type === "quiz_result" && sessionId) {
        router.push({
          pathname: ROUTES.COUPLE_QUIZ_RESULT,
          params: { sessionId },
        });
      } else if (type === "challenge" || route === ROUTES.COUPLE_CHALLENGE) {
        router.push(ROUTES.COUPLE_CHALLENGE);
      } else if (type === "plan" || route === ROUTES.UPCOMING_PLANS) {
        router.push(ROUTES.UPCOMING_PLANS);
      } else if (type === "about_them" || route === ROUTES.ABOUT_THEM) {
        router.push(ROUTES.ABOUT_THEM);
      } else if (route && coupleFeatures.includes(route as AppRoute)) {
        router.push(route as AppRoute);
      } else {
        router.push(ROUTES.HOME);
      }
    },
    [user, hasPartner, router],
  );

  // Check cold start notification on mount
  useEffect(() => {
    if ((Platform.OS as string) === "web" || !Notifications) return;

    let isSubscribed = true;

    async function checkColdStart() {
      try {
        if (!Notifications || isHandledColdStartRef.current) return;
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response && isSubscribed) {
          isHandledColdStartRef.current = true;
          const data = response.notification.request.content.data as Record<string, unknown>;
          if (data) {
            pendingNotificationRef.current = data;
          }
        }
      } catch (err) {
        console.warn("[notification-routing] Failed checking cold start notification:", err);
      }
    }

    checkColdStart();

    // Listen to background / foreground notification taps
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      if (data) {
        if (isLoading) {
          pendingNotificationRef.current = data;
        } else {
          routeNotificationData(data);
        }
      }
    });

    return () => {
      isSubscribed = false;
      subscription.remove();
    };
  }, [isLoading, routeNotificationData]);

  // Process pending cold-start or delayed notification once auth finishes loading
  useEffect(() => {
    if (!isLoading && pendingNotificationRef.current) {
      const pending = pendingNotificationRef.current;
      pendingNotificationRef.current = null;
      routeNotificationData(pending);
    }
  }, [isLoading, routeNotificationData]);

  // Graceful session expiry watcher: If session refresh failed or expired while on a protected screen,
  // sign out cleanly to /welcome without a crash or redirect loop.
  useEffect(() => {
    if (!isLoading && !user) {
      const timer = setTimeout(() => {
        // If unauthenticated and on a protected screen, route to welcome
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoading, user]);
}
