import { StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
  },
  greetingContainer: {
    gap: 4,
  },
  headerLogo: {
    width: 42,
    height: 42,
  },
  appName: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 26,
    color: "#FFFFFF",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 77, 109, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    color: "#FF8FA3",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for floating bottom tab bar
  },
  sparkCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#FF4D6D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  sparkGradient: {
    padding: 22,
  },
  sparkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sparkTag: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "#FFE4E6",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sparkQuestion: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    lineHeight: 26,
    color: "#FFFFFF",
    marginBottom: 18,
  },
  sparkButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  sparkButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 14,
    color: "#E11D48",
  },
  inviteBanner: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  inviteBannerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  inviteBannerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  inviteBannerSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textMuted,
  },
  inviteBannerButton: {
    backgroundColor: "#FF4D6D",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  inviteBannerButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  signOutRow: {
    alignItems: "center",
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
  },
});
