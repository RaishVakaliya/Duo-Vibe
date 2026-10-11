import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
    padding: 18,
    marginTop: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.cardSmall,
    backgroundColor: "rgba(255, 77, 109, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 109, 0.25)",
  },
  titlesCol: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: COLORS.white,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  privacyText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: COLORS.primaryLight,
  },
  chevronButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  progressLabelsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressPercent: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: COLORS.primaryLight,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
});
