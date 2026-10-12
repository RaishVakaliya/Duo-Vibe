import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255, 45, 85, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 20,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 8,
  },
  loadingMessage: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.55)",
    textAlign: "center",
    marginTop: 14,
  },
  message: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 45, 85, 0.18)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
    marginTop: 4,
  },
  retryText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: COLORS.white,
  },
  actionButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.55)",
    textDecorationLine: "underline",
  },
  // Light theme overrides (matches Love Match & Crush Test)
  titleLight: {
    fontFamily: "Fredoka_700Bold",
    color: COLORS.textPrimary,
  },
  loadingMessageLight: {
    color: COLORS.textSecondary,
  },
  messageLight: {
    color: COLORS.textSecondary,
  },
  retryButtonLight: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: "#FF2D55",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  retryTextLight: {
    color: "#FF2D55",
  },
  actionTextLight: {
    color: COLORS.textSecondary,
  },
});
