import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.cardSmall,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 14,
    marginBottom: 10,
  },
  cardDone: {
    opacity: 0.65,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkCircleDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  textContent: {
    flex: 1,
  },
  titleText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: COLORS.white,
  },
  titleTextDone: {
    textDecorationLine: "line-through",
    color: "rgba(255, 255, 255, 0.5)",
  },
  dateTimeText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 3,
  },
  noteText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 6,
    lineHeight: 16,
  },
  rightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  privateText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.65)",
  },
  kindBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255, 77, 109, 0.12)",
  },
  kindBadgeText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 11,
    color: COLORS.primaryLight,
    textTransform: "capitalize",
  },
  memoriesCtaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  memoriesButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255, 77, 109, 0.15)",
  },
  memoriesButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: COLORS.primary,
  },
  deleteButton: {
    padding: 6,
  },
});
