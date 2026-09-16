import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPinkLight,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },

  headerRow: {
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },

  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 18,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    paddingHorizontal: 22,
    paddingVertical: 24,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  progressCounter: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  questionText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 21,
    color: COLORS.textPrimary,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 24,
    paddingHorizontal: 6,
  },

  optionsContainer: {
    gap: 10,
    marginBottom: 24,
  },
  optionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.pillBg,
    borderRadius: RADIUS.buttonFooter,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  optionPillGuessed: {
    borderColor: COLORS.primaryVibrant,
    backgroundColor: COLORS.pillSelectedBg,
    shadowColor: COLORS.primaryVibrant,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  optionEmojiWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    fontFamily: "Fredoka_500Medium",
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  optionTextGuessed: {
    fontFamily: "Fredoka_700Bold",
    color: COLORS.textPrimary,
  },
  partnerGuessBadge: {
    backgroundColor: COLORS.primaryVibrant,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  partnerGuessBadgeText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 11,
    color: COLORS.white,
  },

  gradingTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 14,
  },

  gradingButtonsRow: {
    flexDirection: "row",
    gap: 14,
  },
  gradeButton: {
    flex: 1,
    height: 56,
    borderRadius: RADIUS.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
  },
  correctButtonInactive: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.successBorder,
  },
  correctButtonActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  wrongButtonInactive: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.errorBorder,
  },
  wrongButtonActive: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gradeButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
  },
  gradeButtonTextInactiveCorrect: {
    color: COLORS.successDark,
  },
  gradeButtonTextInactiveWrong: {
    color: COLORS.errorDark,
  },
  gradeButtonTextActive: {
    color: COLORS.white,
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  prevButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.buttonFooter,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  prevButtonDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  prevButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  prevButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.buttonFooter,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    shadowOpacity: 0.05,
    elevation: 0,
  },
  nextButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    borderRadius: RADIUS.buttonFooter,
  },
  nextButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: COLORS.white,
  },

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
