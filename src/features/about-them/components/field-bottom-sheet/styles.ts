import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "flex-end",
  },
  backdropTouchable: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: COLORS.darkCard,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingBottom: 24,
  },
  handleBar: {
    width: 44,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  titleContainer: {
    flex: 1,
  },
  sheetTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: COLORS.white,
  },
  sheetSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // ─── Chips & Options ──────────────────────────────────────────
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
  },
  chipTextSelected: {
    color: COLORS.white,
    fontFamily: "Fredoka_600SemiBold",
  },

  // ─── "Other" Input ───────────────────────────────────────────
  otherContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  otherLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  otherLabel: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  otherCount: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.white,
  },

  // ─── Date Picker Section ─────────────────────────────────────
  dateContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dateDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateDisplayText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 15,
    color: COLORS.white,
  },

  // ─── Gift Ideas List ─────────────────────────────────────────
  listAddRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  listAddInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.white,
  },
  listAddButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.input,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  listAddButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.white,
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: RADIUS.cardSmall,
    marginBottom: 6,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  listItemText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.white,
    flex: 1,
  },
  listItemTextDone: {
    textDecorationLine: "line-through",
    color: "rgba(255, 255, 255, 0.4)",
  },

  // ─── Action Buttons ──────────────────────────────────────────
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  clearButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
  },
  clearButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: COLORS.error,
  },
  saveButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
});
