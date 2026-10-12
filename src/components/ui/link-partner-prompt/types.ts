import { StyleProp, ViewStyle } from "react-native";

export interface LinkPartnerPromptProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  icon?: string;
  source?: string;
  onPress?: () => void;
  theme?: "dark" | "light";
  style?: StyleProp<ViewStyle>;
}

