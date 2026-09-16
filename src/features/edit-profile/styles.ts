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
  keyboardAvoid: {
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
    alignItems: "center",
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: "#FF4D6D",
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#3A1A38",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarLetter: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 48,
    color: "#FFFFFF",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FF4D6D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#0D0B1A",
  },
  changePhotoText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#FF8FA3",
    marginTop: 12,
  },

  formCard: {
    width: "100%",
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
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
  },
  inputHelper: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.35)",
    marginTop: 6,
    marginLeft: 2,
  },

  saveButton: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
  },
});
