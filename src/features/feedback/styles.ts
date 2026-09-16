import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkOverlay,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.white,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  introCard: {
    marginBottom: 20,
    marginTop: 8,
  },
  headline: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 6,
  },
  subheadline: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 20,
  },

  formCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 16,
    color: COLORS.white,
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    minHeight: 160,
    textAlignVertical: "top",
  },

  submitButton: {
    width: "100%",
    height: 56,
    borderRadius: RADIUS.button,
    overflow: "hidden",
  },
  submitButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.button,
  },
  submitButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
