export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

export interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

export interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}
