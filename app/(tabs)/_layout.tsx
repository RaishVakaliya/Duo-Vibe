import React from "react";
import { Tabs } from "expo-router";
import { AppTabBar } from "@/src/components/navigation/bottom-tab-bar/app-tab-bar";
import { COLORS } from "@/src/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        animation: "none",
        sceneStyle: { backgroundColor: COLORS.darkOverlay },
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="connect" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="memories" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
