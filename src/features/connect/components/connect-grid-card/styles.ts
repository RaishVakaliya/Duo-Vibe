import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: RADIUS.card,
    minHeight: 160,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardInner: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  darkBg: {
    backgroundColor: COLORS.darkCard,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.cardSmall,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxDark: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  badgeComingSoon: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  badgeComingSoonText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
  },
  bottomContent: {
    marginTop: 18,
  },
  titleText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
    color: COLORS.white,
    lineHeight: 22,
  },
  subtitleText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 3,
  },

  // ─── Dimmed / Needs Partner Overlay ──────────────────────────
  dimmedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 9, 31, 0.85)",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.card,
  },
  dimmedPrompt: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 8,
  },
  linkPartnerChip: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkPartnerChipText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 11,
    color: COLORS.white,
  },
});
