import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0B1A",
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
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
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
    color: "#FFFFFF",
  },
  tagline: {
    fontFamily: "Caveat_700Bold",
    fontSize: 22,
    color: "#FF8FA3",
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
    color: "#FF8FA3",
  },

  card: {
    backgroundColor: "#1E1527",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
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
    fontFamily: "Fredoka_500Medium",
    fontSize: 14,
    color: "#FFFFFF",
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
