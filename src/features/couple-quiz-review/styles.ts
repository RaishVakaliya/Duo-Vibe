import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
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
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    color: "#1E1B26",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
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
    paddingBottom: 24,
    gap: 18,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 24,
    shadowColor: "#FF8FA3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  progressCounter: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  questionText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 21,
    color: "#1E1B26",
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
    backgroundColor: "#FBF3F4",
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  optionPillGuessed: {
    borderColor: "#FF2D6C",
    backgroundColor: "#FFE9EF",
    shadowColor: "#FF2D6C",
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
    color: "#64748B",
    lineHeight: 20,
  },
  optionTextGuessed: {
    fontFamily: "Fredoka_700Bold",
    color: "#1E1B26",
  },
  partnerGuessBadge: {
    backgroundColor: "#FF2D6C",
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
    color: "#FFFFFF",
  },

  gradingTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#64748B",
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
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
  },
  correctButtonInactive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  correctButtonActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  wrongButtonInactive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  wrongButtonActive: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
    shadowColor: "#EF4444",
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
    color: "#059669",
  },
  gradeButtonTextInactiveWrong: {
    color: "#DC2626",
  },
  gradeButtonTextActive: {
    color: "#FFFFFF",
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
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    shadowColor: "#000",
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
    color: "#1E1B26",
  },
  prevButtonTextDisabled: {
    color: "#94A3B8",
  },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FF2D6C",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    shadowColor: "#FF2D6C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0.05,
    elevation: 0,
  },
  nextButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
