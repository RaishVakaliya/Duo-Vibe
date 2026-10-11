import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ─── Header ──────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.white,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  privacyText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },

  // ─── Retry / Error Banner ───────────────────────────────────
  retryBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: RADIUS.cardSmall,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  retryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  retryText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.white,
    flex: 1,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  retryButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: COLORS.white,
  },

  // ─── Sections ────────────────────────────────────────────────
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  sectionCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  // ─── Field Rows ──────────────────────────────────────────────
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
  },
  fieldRowLast: {
    borderBottomWidth: 0,
  },
  fieldLeft: {
    flex: 1,
    paddingRight: 12,
  },
  fieldLabel: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 14,
    color: COLORS.white,
  },
  fieldValuePreview: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.primaryLight,
    marginTop: 3,
  },
  fieldRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  savedBadgeText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 11,
    color: COLORS.success,
  },

  // ─── Dashed Unfilled Row ─────────────────────────────────────
  emptyFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: RADIUS.cardSmall,
    borderWidth: 1.2,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  emptyFieldLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  emptyFieldLabel: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.55)",
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255, 77, 109, 0.15)",
  },
  addChipText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: COLORS.primary,
  },
});
