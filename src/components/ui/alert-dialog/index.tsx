import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { styles } from "./styles";
import { AlertOptions, AlertContextType } from "./types";

export * from "./types";
export * from "./styles";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertConfig(options);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertConfig && (
        <Modal
          transparent
          animationType="fade"
          visible={Boolean(alertConfig)}
          onRequestClose={hideAlert}
        >
          <View style={styles.overlay}>
            <View style={styles.dialogContainer}>
              <Text style={styles.title}>{alertConfig.title}</Text>
              {alertConfig.message ? (
                <Text style={styles.message}>{alertConfig.message}</Text>
              ) : null}

              <View style={styles.buttonRow}>
                {alertConfig.buttons && alertConfig.buttons.length > 0 ? (
                  alertConfig.buttons.map((btn, idx) => {
                    const isCancel = btn.style === "cancel";
                    const isDestructive = btn.style === "destructive";

                    const buttonStyle = isCancel
                      ? styles.cancelButton
                      : isDestructive
                        ? styles.destructiveButton
                        : styles.primaryButton;

                    const textStyle = isCancel
                      ? styles.cancelButtonText
                      : isDestructive
                        ? styles.destructiveButtonText
                        : styles.primaryButtonText;

                    return (
                      <Pressable
                        key={idx}
                        style={[styles.button, buttonStyle]}
                        accessibilityRole="button"
                        accessibilityLabel={btn.text}
                        onPress={() => {
                          hideAlert();
                          if (btn.onPress) {
                            btn.onPress();
                          }
                        }}
                      >
                        <Text style={textStyle}>{btn.text}</Text>
                      </Pressable>
                    );
                  })
                ) : (
                  <Pressable
                    style={[styles.button, styles.primaryButton]}
                    accessibilityRole="button"
                    accessibilityLabel="OK"
                    onPress={hideAlert}
                  >
                    <Text style={styles.primaryButtonText}>OK</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
