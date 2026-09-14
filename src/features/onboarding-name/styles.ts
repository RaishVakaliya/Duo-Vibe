import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    paddingTop: 36,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    lineHeight: 38,
    color: "#FFFFFF",
    marginBottom: 36,
  },
  inputContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.25)",
    paddingBottom: 8,
  },
  inputContainerFocused: {
    borderBottomColor: "#FF4D6D",
  },
  textInput: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 26,
    color: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  footer: {
    paddingBottom: 24,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  continueButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  continueButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.3)",
  },
});
