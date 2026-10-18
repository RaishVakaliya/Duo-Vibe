import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { BottomTabBar } from "./index";
import { useAuth } from "@/src/context/auth-context";
import { useUnreadBadge } from "@/src/lib/shared/unreadBadge";
import { getPartnerId } from "@/src/lib/quiz";
import { buildCoupleKey } from "@/src/lib/chat";

type AppTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

export function AppTabBar({ state, navigation }: AppTabBarProps) {
  const { user, hasPartner } = useAuth();
  const [coupleKey, setCoupleKey] = useState<string | null>(null);
  const unreadChatCount = useUnreadBadge(coupleKey, user?.id ?? null);

  useEffect(() => {
    if (!user || !hasPartner) {
      setCoupleKey(null);
      return;
    }
    let cancelled = false;
    getPartnerId(user.id)
      .then((pid) => {
        if (cancelled || !pid) return;
        setCoupleKey(buildCoupleKey(user.id, pid));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user, hasPartner]);

  if (!user) {
    return null;
  }

  return (
    <BottomTabBar
      activeTab={state.index}
      badges={{ chat: unreadChatCount }}
      onTabPress={(index) => {
        const route = state.routes[index];
        if (!route) return;
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });
        if (event.defaultPrevented) return;
        if (state.index !== index) {
          navigation.navigate(route.name);
        }
      }}
    />
  );
}
