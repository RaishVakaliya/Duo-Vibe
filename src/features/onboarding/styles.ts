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
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    height: 72,
    borderRadius: RADIUS.cardSmall,
    overflow: "hidden",
  },
  optionUnselected: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: RADIUS.cardSmall,
  },
  optionSelectedGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    borderRadius: RADIUS.cardSmall,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  optionTextUnselected: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 19,
    color: COLORS.textMuted,
  },
  optionTextSelected: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 19,
    color: COLORS.white,
  },
  footer: {
    paddingBottom: 24,
  },
  continueButton: {
    height: 56,
    borderRadius: RADIUS.button,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.button,
  },
  continueButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 0.4,
  },
});
