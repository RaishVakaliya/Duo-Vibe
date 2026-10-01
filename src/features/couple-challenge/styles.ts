import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOWS } from "@/src/constants/colors";

// Pink-light theme matching Couple Quiz aesthetic but with green accent for "done"
const PINK_BG = "#FFF5F8";
const CARD_WHITE = "#FFFFFF";
const GREEN = "#10B981";
const GREEN_LIGHT = "#ECFDF5";
const GREEN_BORDER = "#A7F3D0";
const UPCOMING_BG = "#FAFAFA";
const UPCOMING_BORDER = "#F1F5F9";

export const styles = StyleSheet.create({
  // ── Layout ────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: PINK_BG,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },

  // ── Header ────────────────────────────────────────────────────────────
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
    ...SHADOWS.subtle,
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
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },

  // ── Loading / Error / No-partner ──────────────────────────────────────
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  blockingCard: {
    backgroundColor: CARD_WHITE,
    borderRadius: RADIUS.card,
    padding: 28,
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    ...SHADOWS.card,
  },
  blockingIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.bgPinkAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  blockingTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  blockingText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  // ── Progress Bar (streak indicator) ──────────────────────────────────
  progressContainer: {
    backgroundColor: CARD_WHITE,
    borderRadius: RADIUS.card,
    padding: 16,
    ...SHADOWS.subtle,
  },
  progressLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: GREEN,
  },
  progressNumbers: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: GREEN,
    marginTop: 6,
    textAlign: "right",
  },

  // ── Today's Challenge Card (expanded, highlighted) ────────────────────
  todayCard: {
    backgroundColor: CARD_WHITE,
    borderRadius: RADIUS.card,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 45, 108, 0.22)",
    ...SHADOWS.cardElevated,
  },
  todayCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  todayDayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.bgPinkAlt,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  todayDayBadgeText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.primary,
  },
  todayHeartIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgPinkAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCardTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: 24,
  },
  todayCardDescription: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 18,
    flexShrink: 1,
  },
  doneButton: {
    width: "100%",
    height: 54,
    borderRadius: RADIUS.button,
    overflow: "hidden",
    ...SHADOWS.primaryAction,
  },
  doneButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.08,
  },
  doneGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  doneButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // ── Partner completed banner (shown when partner already marked done) ─
  partnerCompletedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: GREEN_BORDER,
  },
  partnerCompletedText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#065F46",
    flex: 1,
    lineHeight: 20,
  },

  // ── Day already completed state ───────────────────────────────────────
  alreadyDoneCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: GREEN_BORDER,
  },
  alreadyDoneText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#065F46",
    flex: 1,
  },

  // ── Upcoming rows (collapsed, locked) ─────────────────────────────────
  upcomingCard: {
    backgroundColor: UPCOMING_BG,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: UPCOMING_BORDER,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  upcomingLeft: {
    flex: 1,
    gap: 2,
  },
  upcomingDayLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.textMuted,
  },
  upcomingDescription: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    backgroundColor: "transparent",
  },

  // ── "View All" button ─────────────────────────────────────────────────
  viewAllButton: {
    width: "100%",
    height: 52,
    borderRadius: RADIUS.button,
    backgroundColor: CARD_WHITE,
    borderWidth: 1.5,
    borderColor: "rgba(255, 45, 108, 0.25)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    ...SHADOWS.subtle,
  },
  viewAllText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: COLORS.primary,
  },

  // ── Action buttons (blocking / error state) ───────────────────────────
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.primary,
    ...SHADOWS.primaryAction,
  },
  actionButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: COLORS.white,
  },
  errorText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
