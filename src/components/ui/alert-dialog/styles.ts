import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    paddingHorizontal: 28,
  },
  dialogContainer: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#181024",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  destructiveButton: {
    backgroundColor: "#EF4444",
  },
  primaryButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  cancelButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: "#94A3B8",
  },
  destructiveButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});
