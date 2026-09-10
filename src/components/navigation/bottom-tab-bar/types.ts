import { type ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type TabIconName = ComponentProps<typeof Ionicons>["name"];

export interface TabItem {
  id: string;
  name: string;
  icon: TabIconName;
  route?: string;
}

export interface BottomTabBarProps {
  activeTab: number;
  onTabPress: (index: number, item: TabItem) => void;
}
