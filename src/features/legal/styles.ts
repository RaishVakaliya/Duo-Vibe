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

  card: {
    backgroundColor: "#1E1527",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    marginBottom: 20,
  },
  lastUpdated: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 14,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.78)",
    marginBottom: 10,
  },
  footerNote: {
    textAlign: "center",
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.35)",
    marginTop: 8,
  },
});
