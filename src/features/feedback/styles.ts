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

  introCard: {
    marginBottom: 20,
    marginTop: 8,
  },
  headline: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subheadline: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 20,
  },

  formCard: {
    backgroundColor: "#1E1527",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 16,
    color: "#FFFFFF",
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    minHeight: 160,
    textAlignVertical: "top",
  },

  submitButton: {
    borderRadius: 18,
    overflow: "hidden",
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
  },
});
