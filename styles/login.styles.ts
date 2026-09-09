import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

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
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    width: 130,
    height: 130,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 36,
    color: "#FFFFFF",
    marginTop: 18,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textDim,
    marginTop: 8,
    textAlign: "center",
  },
  fluidButtonWrapper: {
    marginTop: 44,
    width: "100%",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fluidButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: "100%",
    borderRadius: 30,
    paddingHorizontal: 24,
  },
  googleIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fluidButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  footer: {
    paddingBottom: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#8E7B8C",
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
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  andText: {
    fontSize: 12,
    color: "#8E7B8C",
  },
});
