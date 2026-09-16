import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  topNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerHeartIcon: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.white,
  },
  headerSpacer: {
    width: 40,
  },
  headerTextSection: {
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 26,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.borderDisabled,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPinkAlt,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  cardsContainer: {
    gap: 18,
    marginBottom: 28,
  },
  inputCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.cardSmall,
    padding: 18,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  inputLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.input,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: COLORS.textPrimary,
    height: "100%",
  },
  calculateButton: {
    height: 56,
    borderRadius: RADIUS.button,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 6,
  },
  calculateButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  calculateGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.button,
  },
  calculateText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
