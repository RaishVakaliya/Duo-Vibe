import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.white,
    marginBottom: 36,
  },
  inputContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.25)",
    paddingBottom: 8,
  },
  inputContainerFocused: {
    borderBottomColor: COLORS.primary,
  },
  textInput: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 26,
    color: COLORS.white,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  footer: {
    paddingBottom: 24,
  },
  continueButton: {
    height: 56,
    borderRadius: RADIUS.button,
    overflow: "hidden",
  },
  continueButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.button,
  },
  continueButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: COLORS.white,
  },
  continueButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.3)",
  },
});
