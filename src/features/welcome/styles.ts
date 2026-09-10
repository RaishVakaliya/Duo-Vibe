import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

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
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#CBD5E1",
    marginBottom: 28,
  },
  buttonContainer: {
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: "#ba21a8ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
  buttonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
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
    color: "#94A3B8",
  },
  loginLink: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Fredoka_700Bold",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});
