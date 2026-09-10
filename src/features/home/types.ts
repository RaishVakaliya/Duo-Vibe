import { type ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppRoute } from "@/src/constants/routes";

export type ToolIconName = ComponentProps<typeof Ionicons>["name"];

export interface LoveToolItem {
  id: string;
  title: string;
  icon: ToolIconName;
  iconColor: string;
  backgroundColor: string;
  borderColor: string;
  route?: AppRoute;
}

export interface HeroBannerProps {
  onPress: () => void;
}

export interface TodaysCardProps {
  question: string;
  onPress: () => void;
}
