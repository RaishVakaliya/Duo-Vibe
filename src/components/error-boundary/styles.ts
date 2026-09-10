import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkOverlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
    maxWidth: 340,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 24,
  },
  devErrorBox: {
    backgroundColor: "rgba(255, 77, 109, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 109, 0.3)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    width: "100%",
  },
  devErrorText: {
    fontSize: 12,
    color: "#FF8FA3",
    fontFamily: "monospace",
  },
  retryButton: {
    height: 52,
    width: 200,
    borderRadius: 26,
    overflow: "hidden",
    shadowColor: "#FF4D6D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 26,
  },
  buttonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
