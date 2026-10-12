import { StyleSheet } from "react-native";
import { RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
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
  },
  sizeLg: {
    height: 60,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  label: {
    fontFamily: "Fredoka_600SemiBold",
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
