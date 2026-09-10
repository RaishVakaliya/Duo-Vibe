import React, { useState, useEffect } from "react";
import { View, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { styles } from "./styles";
import { TabItem, BottomTabBarProps } from "./types";

export const TAB_ITEMS: readonly TabItem[] = [
  { id: "home", name: "Home", icon: "home" },
  { id: "games", name: "Games", icon: "game-controller" },
  { id: "chat", name: "Spark", icon: "chatbubble-ellipses" },
  { id: "memories", name: "Memories", icon: "heart" },
  { id: "profile", name: "Profile", icon: "person" },
];

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState<number>(0);
  const translateX = useSharedValue(0);

  const numTabs = TAB_ITEMS.length;
  const paddingHorizontal = 8;
  const availableWidth = barWidth > 0 ? barWidth - paddingHorizontal * 2 : 0;
  const tabWidth = availableWidth > 0 ? availableWidth / numTabs : 0;
  const indicatorMargin = 4;
  const indicatorWidth = tabWidth > 0 ? tabWidth - indicatorMargin * 2 : 56;

  useEffect(() => {
    if (tabWidth > 0) {
      const targetX =
        paddingHorizontal + activeTab * tabWidth + indicatorMargin;
      translateX.value = withSpring(targetX, {
        damping: 18,
        stiffness: 180,
        mass: 0.8,
      });
    }
  }, [activeTab, tabWidth, paddingHorizontal, indicatorMargin, translateX]);

  const onLayout = (event: LayoutChangeEvent): void => {
    const width = event.nativeEvent.layout.width;
    setBarWidth(width);
    const avail = width - paddingHorizontal * 2;
    const tWidth = avail / numTabs;
    translateX.value =
      paddingHorizontal + activeTab * tWidth + indicatorMargin;
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth,
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleTabPress = (index: number, item: TabItem): void => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onTabPress(index, item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pillBar} onLayout={onLayout}>
        {barWidth > 0 && (
          <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
        )}

        {TAB_ITEMS.map((item, index) => {
          const isActive = activeTab === index;
          return (
            <Pressable
              key={item.id}
              style={styles.tabButton}
              onPress={() => handleTabPress(index, item)}
              accessibilityRole="button"
              accessibilityLabel={item.name}
              accessibilityState={{ selected: isActive }}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color="#FFFFFF"
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export * from "./types";
