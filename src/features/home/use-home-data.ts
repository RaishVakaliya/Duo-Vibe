import { useState, useCallback, useMemo } from "react";
import { BackHandler } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { getPendingReviewSessions } from "@/src/lib/quizSession";
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

  const greetingData = useMemo(() => getGreetingData(), []);

  useFocusEffect(
    useCallback(() => {
      setActiveTab(0);
      if (user) {
        getPendingReviewSessions(user.id)
          .then((sessions) => setPendingReviews(sessions))
          .catch((err) => console.warn("Pending reviews note:", err));
      }

      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [user]),
  );

  const handleTabPress = useCallback(
    (index: number, item: TabItem): void => {
      setActiveTab(index);
      switch (item.id) {
        case "home":
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
    handleTabPress,
    handleToolPress,
    handleReviewPress,
    handleInvitePress,
    handleCardPress,
  };
}
