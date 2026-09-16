import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

const SCREEN_W = Dimensions.get("window").width;

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
    paddingTop: 16,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  polaroidContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  polaroidCard: {
    position: "absolute",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    paddingBottom: 36,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  polaroidLeft: {
    left: "3%",
    top: 30,
    width: SCREEN_W * 0.44,
    height: SCREEN_W * 0.44 * 1.22,
    zIndex: 1,
  },
  polaroidRight: {
    right: "3%",
    top: 50,
    width: SCREEN_W * 0.46,
    height: SCREEN_W * 0.46 * 1.22,
    zIndex: 2,
  },
  polaroidCenter: {
    bottom: 20,
    width: SCREEN_W * 0.48,
    height: SCREEN_W * 0.48 * 1.22,
    zIndex: 3,
  },
  polaroidImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
