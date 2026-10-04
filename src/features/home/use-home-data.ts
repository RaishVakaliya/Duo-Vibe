import { useState, useCallback, useMemo, useRef } from "react";
import { BackHandler } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { getPendingReviewSessions, getPartnerId } from "@/src/lib/quizSession";
import { buildCoupleKey, getUnreadCount, subscribeToUnreadBadge } from "@/src/lib/chat";
import { QuizSession } from "@/src/types";
import { TabItem } from "@/src/components/navigation/bottom-tab-bar";
import { LoveToolItem } from "./types";

export function getGreetingData(date: Date = new Date()): {
  greeting: string;
  emoji: string;
} {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: "Good Morning", emoji: "☀️" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "Good Afternoon", emoji: "🌤️" };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: "Good Evening", emoji: "👋" };
  } else {
    return { greeting: "Good Night", emoji: "🌙" };
  }
}

export function useHomeData() {
  const router = useRouter();
  const { user, hasPartner } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [pendingReviews, setPendingReviews] = useState<QuizSession[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  const greetingData = useMemo(() => getGreetingData(), []);
  const unsubscribeChatBadgeRef = useRef<(() => void) | null>(null);

  useFocusEffect(
    useCallback(() => {
      setActiveTab(0);
      if (user) {
        getPendingReviewSessions(user.id)
          .then((sessions) => setPendingReviews(sessions))
          .catch((err) => console.warn("Pending reviews note:", err));

        if (hasPartner) {
          getPartnerId(user.id).then((partnerId) => {
            if (!partnerId) return;
            const coupleKey = buildCoupleKey(user.id, partnerId);
            getUnreadCount(coupleKey, user.id)
              .then(setUnreadChatCount)
              .catch(() => { });

            if (unsubscribeChatBadgeRef.current) {
              unsubscribeChatBadgeRef.current();
            }
            unsubscribeChatBadgeRef.current = subscribeToUnreadBadge(
              coupleKey,
              () => {
                getUnreadCount(coupleKey, user.id)
                  .then(setUnreadChatCount)
                  .catch(() => { });
              },
            );
          });
        }
      }

      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => {
        subscription.remove();
        if (unsubscribeChatBadgeRef.current) {
          unsubscribeChatBadgeRef.current();
          unsubscribeChatBadgeRef.current = null;
        }
      };
    }, [user, hasPartner]),
  );

  const handleTabPress = useCallback(
    (index: number, item: TabItem): void => {
      setActiveTab(index);
      switch (item.id) {
        case "home":
          break;
        case "chat":
          router.push(ROUTES.CHAT);
          break;
        case "profile":
          router.push(ROUTES.PROFILE);
          break;
      }
    },
    [router],
  );

  const handleToolPress = (tool: LoveToolItem): void => {
    if (tool.route) {
      router.push(tool.route);
    }
  };

  const handleReviewPress = (): void => {
    const first = pendingReviews[0];
    if (first) {
      router.push({
        pathname: ROUTES.COUPLE_QUIZ_REVIEW,
        params: { sessionId: first.id },
      });
    }
  };

  const handleInvitePress = (): void => {
    router.push({
      pathname: ROUTES.INVITE_PARTNER,
      params: { source: "home" },
    });
  };

  const handleCardPress = (): void => {
    router.push(ROUTES.TWENTY_ONE_QUESTIONS);
  };

  return {
    hasPartner,
    greetingData,
    pendingReviews,
    activeTab,
    unreadChatCount,
    handleTabPress,
    handleToolPress,
    handleReviewPress,
    handleInvitePress,
    handleCardPress,
  };
}
