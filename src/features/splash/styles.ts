import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkOverlay,
    justifyContent: "space-between",
  },
  sparkleTopLeft: {
    position: "absolute",
    top: "18%",
    left: "8%",
    opacity: 0.8,
  },
  sparkleMidLeft: {
    position: "absolute",
    top: "55%",
    left: "10%",
    opacity: 0.9,
  },
  sparkleRight: {
    position: "absolute",
    top: "38%",
    right: "10%",
    opacity: 0.7,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 120,
  },
  wordmark: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 48,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#FF6B81",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 36,
    letterSpacing: 1.2,
  },
  taglineContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  tagline: {
    fontFamily: "Caveat_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: "#FFFFFF",
    textAlign: "center",
  },
  accentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: 140,
    position: "relative",
  },
  accentHeart: {
    transform: [{ rotate: "-8deg" }],
  },
  diagonalAccent: {
    position: "absolute",
    right: 0,
    top: -4,
    transform: [{ rotate: "15deg" }],
  },
  bottomSection: {
    width: "100%",
    position: "relative",
    alignItems: "center",
  },
  bottomSparkle1: {
    position: "absolute",
    top: -24,
    right: "18%",
    zIndex: 4,
  },
  bottomSparkle2: {
    position: "absolute",
    top: 6,
    right: "25%",
    zIndex: 4,
  },
  heartsContainer: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
    width: 130,
    height: 80,
    zIndex: 2,
  },
  filledHeartWrapper: {
    position: "absolute",
    right: 12,
    top: 0,
    transform: [{ rotate: "14deg" }],
  },
  outlinedHeartWrapper: {
    position: "absolute",
    left: 8,
    top: 14,
    transform: [{ rotate: "-16deg" }],
  },
});
