import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkOverlay,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "65%",
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headline: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.white,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.borderDisabled,
    marginBottom: 28,
  },
  buttonContainer: {
    height: 56,
    borderRadius: RADIUS.button,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.button,
  },
  buttonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: "Fredoka_700Bold",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});
