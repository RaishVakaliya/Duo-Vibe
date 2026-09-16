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
  keyboardAvoid: {
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
    borderColor: COLORS.primary,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.avatarPlaceholderBg,
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
    color: COLORS.white,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: COLORS.darkOverlay,
  },
  changePhotoText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: COLORS.primaryLight,
    marginTop: 12,
  },

  formCard: {
    width: "100%",
    backgroundColor: COLORS.darkCard,
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
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.white,
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
    height: 56,
    borderRadius: RADIUS.button,
    overflow: "hidden",
  },
  saveButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.button,
  },
  saveButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
