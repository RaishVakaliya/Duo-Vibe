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
    maxHeight: SCREEN_HEIGHT * 0.88,
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
  headerTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: COLORS.white,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // ─── Quick-start Chips ───────────────────────────────────────
  sectionLabel: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  quickStartRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  quickStartChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255, 77, 109, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 109, 0.25)",
  },
  quickStartText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: COLORS.primaryLight,
  },

  // ─── Input Group ─────────────────────────────────────────────
  inputGroup: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.white,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },

  // ─── Kind Chips ──────────────────────────────────────────────
  kindChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  kindChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  kindChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  kindChipText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "capitalize",
  },
  kindChipTextSelected: {
    color: COLORS.white,
    fontFamily: "Fredoka_600SemiBold",
  },

  // ─── Date & Time Row ─────────────────────────────────────────
  dateTimeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateTimeText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 13,
    color: COLORS.white,
  },

  // ─── Submit CTA ──────────────────────────────────────────────
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.input,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: COLORS.white,
  },
});
