import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hideBackButton?: boolean;
  backIcon?: "chevron-back" | "arrow-back" | "close";
  rightElement?: ReactNode;
  titleIcon?: ReactNode;
  align?: "start" | "center";
  theme?: "dark" | "light";
  style?: StyleProp<ViewStyle>;
}
