import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 40,
    height: 40,
  },
  // Centered variant
  centeredContainer: {
    justifyContent: "space-between",
  },
  centeredTitleWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  centeredTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  centeredTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: COLORS.white,
    textAlign: "center",
  },
  centeredSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.55)",
    textAlign: "center",
    marginTop: 2,
    paddingHorizontal: 8,
  },
  // Start-aligned variant
  startContainer: {
    justifyContent: "flex-start",
  },
  startTitlesWrapper: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  startTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  startTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: COLORS.white,
  },
  startSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 2,
  },
  // Light theme overrides (matches Love Match & Crush Test)
  backButtonLight: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  titleLight: {
    color: COLORS.textPrimary,
  },
  subtitleLight: {
    color: COLORS.textSecondary,
  },
});
