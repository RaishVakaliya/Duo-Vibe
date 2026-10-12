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
    fontSize: 22,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  buttonWrapper: {
    width: "100%",
    maxWidth: 280,
    borderRadius: 24,
    overflow: "hidden",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
  // Light theme overrides (matches Love Match & Crush Test)
  containerLight: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  cardLight: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  iconWrapperLight: {
    backgroundColor: "rgba(255, 45, 85, 0.12)",
  },
  titleLight: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  descriptionLight: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14.5,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
