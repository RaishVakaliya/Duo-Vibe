import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type ScreenStateVariant =
  | "loading"
  | "error"
  | "empty"
  | "permission_denied"
  | "offline";

export interface ScreenStateProps {
  variant: ScreenStateVariant;
  title?: string;
  message?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  onRetry?: () => void;
  retryLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  onOpenSettings?: () => void;
  theme?: "dark" | "light";
}
