import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110, // clearance for bottom tab bar
  },

  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.65)",
    marginTop: 4,
  },

  gridRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  gridCardWrapper: {
    flex: 1,
  },

  fullWidthSection: {
    marginTop: 4,
  },
});
