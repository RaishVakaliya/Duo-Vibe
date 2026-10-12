import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  scrollable?: boolean;
  footer?: ReactNode;
  headerRight?: ReactNode;
  showHandleBar?: boolean;
  showCloseButton?: boolean;
  avoidKeyboard?: boolean;
  sheetStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}
