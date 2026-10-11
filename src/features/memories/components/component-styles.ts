import { StyleSheet, Dimensions } from "react-native";
import { RADIUS } from "@/src/constants/colors";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export const componentStyles = StyleSheet.create({
  // ─── Bottom Sheet Modal ────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#1F1522",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: SCREEN_H * 0.9,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sheetTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ─── Photo Picker Box ──────────────────────────────────────────────────────
  photoPickerBox: {
    width: "100%",
    aspectRatio: 1.3,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderStyle: "dashed",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 16,
  },
  photoPickerBoxActive: {
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  pickedPhoto: {
    width: "100%",
    height: "100%",
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changePhotoText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "#FFFFFF",
  },
  pickerPlaceholderText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: "#FFE2E6",
    marginTop: 8,
  },
  pickerHintText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 4,
  },

  // ─── Input Fields ──────────────────────────────────────────────────────────
  inputGroup: {
    marginBottom: 14,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  inputLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
  },
  inputCharCount: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.45)",
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Fredoka_500Medium",
    fontSize: 15,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  textArea: {
    height: 72,
    textAlignVertical: "top",
  },

  // ─── Date Picker Row ───────────────────────────────────────────────────────
  dateSelectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  dateSelectValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateSelectValue: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 15,
    color: "#FFFFFF",
  },

  // ─── Save / Progress Button ────────────────────────────────────────────────
  saveButton: {
    height: 52,
    borderRadius: RADIUS.button,
    overflow: "hidden",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  // ─── Detail Modal ──────────────────────────────────────────────────────────
  detailBackdrop: {
    flex: 1,
    backgroundColor: "rgba(10, 5, 15, 0.96)",
  },
  detailSafeArea: {
    flex: 1,
  },
  detailTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  detailCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailDeleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  detailScroll: {
    flex: 1,
  },
  detailScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  detailImageWrapper: {
    width: SCREEN_W - 40,
    height: SCREEN_W - 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1E1522",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
    marginBottom: 20,
  },
  detailImage: {
    width: "100%",
    height: "100%",
  },
  detailCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  detailTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    lineHeight: 28,
    color: "#FFFFFF",
    flex: 1,
    marginRight: 12,
  },
  detailDate: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.65)",
    marginBottom: 12,
  },
  detailNote: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingTop: 14,
  },
  detailCreatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailCreatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#332238",
    marginRight: 8,
  },
  detailCreatorName: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  detailCreatorSubtext: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.55)",
  },
  detailHeartToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  detailHeartToggleActive: {
    backgroundColor: "rgba(255, 45, 85, 0.25)",
    borderColor: "#FF2D55",
  },
  detailHeartCount: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 6,
  },
});
