import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 14,
    color: COLORS.white,
  },
  totalText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
