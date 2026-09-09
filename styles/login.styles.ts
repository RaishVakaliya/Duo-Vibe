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
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    height: 56,
    borderRadius: 28,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000000",
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
    color: "#FFFFFF",
    letterSpacing: 0.2,
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
