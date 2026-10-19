import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  backdropTouchable: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#1C0E2D",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    maxHeight: "90%",
    overflow: "hidden",
  },
  scrollView: {
    flexShrink: 1,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: COLORS.white,
  },
  headerSubtitle: {
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  plainContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
});
