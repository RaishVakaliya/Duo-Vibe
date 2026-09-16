import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const readyStyles = StyleSheet.create({
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
    justifyContent: "space-between",
  },
  headerTextContainer: {
    alignItems: "flex-start",
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
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -20,
    width: SCREEN_WIDTH,
    overflow: "hidden",
  },
  illustration: {
    width: SCREEN_WIDTH * 1.15,
    height: SCREEN_WIDTH * 0.92,
  },
  footer: {
    paddingBottom: 24,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    height: 56,
    borderRadius: RADIUS.button,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  googleIconContainer: {
    marginRight: 10,
  },
  googleButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  footerNote: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
    marginTop: 12,
  },
});
