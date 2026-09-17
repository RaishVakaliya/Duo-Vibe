import { StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkOverlay,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: COLORS.white,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 28,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    color: COLORS.white,
  },
  tagline: {
    fontFamily: "Caveat_700Bold",
    fontSize: 22,
    color: COLORS.primaryLight,
    marginTop: 2,
  },
  versionBadge: {
    backgroundColor: "rgba(255, 77, 109, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 10,
  },
  versionText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.primaryLight,
  },

  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: COLORS.white,
    marginBottom: 10,
  },
  cardParagraph: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.75)",
    marginBottom: 12,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },

  footerText: {
    textAlign: "center",
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.35)",
    marginTop: 12,
  },
});
