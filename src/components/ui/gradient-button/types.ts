import { ReactNode } from "react";
import { StyleProp, ViewStyle, TextStyle } from "react-native";

export interface GradientButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  colors?: readonly [string, string, ...string[]];
  icon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}
