import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LOGO_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.32), 130);

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  ambientBlobTop: {
    position: "absolute",
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(168, 85, 247, 0.15)",
  },
  ambientBlobBottom: {
    position: "absolute",
    bottom: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(56, 189, 248, 0.12)",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  header: {
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
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: SCREEN_WIDTH < 360 ? 28 : 34,
    color: COLORS.white,
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textDim,
    marginTop: 8,
    textAlign: "center",
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
    marginTop: 40,
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
  footer: {
    paddingBottom: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textDim,
    textAlign: "center",
    marginBottom: 4,
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    fontSize: 12,
    color: COLORS.white,
    textDecorationLine: "underline",
  },
  andText: {
    fontSize: 12,
    color: COLORS.textDim,
  },
});
