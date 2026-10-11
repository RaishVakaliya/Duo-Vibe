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
    paddingBottom: 48,
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
  headerTitles: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.white,
  },
  headerSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Section Header ──────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  sectionCount: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },

  // ─── Done Accordion ──────────────────────────────────────────
  doneAccordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: RADIUS.cardSmall,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  doneAccordionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  doneAccordionTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },

  // ─── Empty State ─────────────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255, 77, 109, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyCta: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.pill,
  },
  emptyCtaText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
});
