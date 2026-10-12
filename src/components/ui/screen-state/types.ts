export type ScreenStateVariant = "loading" | "error" | "empty";

export interface ScreenStateProps {
  variant: ScreenStateVariant;
  title?: string;
  message?: string;
  icon?: string;
  onRetry?: () => void;
  retryLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  theme?: "dark" | "light";
}
