import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOWS } from "@/src/constants/colors";

const GREEN = "#10B981";
const GREEN_LIGHT = "#ECFDF5";
const GREEN_BORDER = "#A7F3D0";

export const styles = StyleSheet.create({
  // ── Layout ───────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: "#FFF5F8",
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },

  // ── Header ───────────────────────────────────────────────────────────
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
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.subtle,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  headerSpacer: { width: 40 },

  // ── Loading / Error ───────────────────────────────────────────────────
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  errorText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.button,
    ...SHADOWS.primaryAction,
  },
  retryButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 15,
    color: COLORS.white,
  },

  // ── FlatList ──────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 4,
  },

  // ── Row item ─────────────────────────────────────────────────────────
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: RADIUS.card,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    ...SHADOWS.subtle,
  },
  rowItemCurrent: {
    borderWidth: 1.5,
    borderColor: "rgba(255,45,108,0.28)",
    backgroundColor: "#FFF8FA",
  },
  rowItemCompleted: {
    backgroundColor: GREEN_LIGHT,
    borderWidth: 1,
    borderColor: GREEN_BORDER,
  },
  rowItemLocked: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  // ── Day circle ────────────────────────────────────────────────────────
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgPinkAlt,
  },
  dayCircleCurrent: {
    backgroundColor: COLORS.primary,
  },
  dayCircleCompleted: {
    backgroundColor: GREEN,
  },
  dayCircleLocked: {
    backgroundColor: COLORS.borderLight,
  },
  dayNumber: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 15,
    color: COLORS.primary,
  },
  dayNumberCurrent: {
    color: COLORS.white,
  },
  dayNumberCompleted: {
    color: COLORS.white,
  },
  dayNumberLocked: {
    color: COLORS.textMuted,
  },

  // ── Row text ──────────────────────────────────────────────────────────
  rowTextGroup: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  rowTitleLocked: {
    color: COLORS.textMuted,
  },
  rowDescription: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  rowDescriptionLocked: {
    color: COLORS.textMuted,
  },

  // ── Status icon column ────────────────────────────────────────────────
  statusIcon: {
    width: 28,
    alignItems: "center",
  },

  // ── Current badge pill ────────────────────────────────────────────────
  currentBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.bgPinkAlt,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  currentBadgeText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 10,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
