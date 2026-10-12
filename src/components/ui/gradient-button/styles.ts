import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOWS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.button,
    overflow: "hidden",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sizeSm: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
  },
  sizeMd: {
    height: 54,
    paddingHorizontal: 24,
    borderRadius: RADIUS.button,
    ...SHADOWS.primaryAction,
  },
  sizeLg: {
    height: 60,
    paddingHorizontal: 28,
    borderRadius: 30,
    ...SHADOWS.primaryAction,
  },
  label: {
    fontFamily: "Fredoka_600SemiBold",
    color: COLORS.white,
    textAlign: "center",
  },
  labelSm: {
    fontSize: 14,
  },
  labelMd: {
    fontSize: 16,
  },
  labelLg: {
    fontSize: 18,
  },
});
