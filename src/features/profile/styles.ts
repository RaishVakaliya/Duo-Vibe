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
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerPlaceholder: {
    width: 40,
  },
  topEditButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  // Profile Hero (Matching Lovio Reference Image 1)
  profileHero: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 26,
  },
  avatarRing: {
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.avatarPlaceholderBg,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarLetter: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 46,
    color: COLORS.white,
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  userName: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 26,
    color: COLORS.white,
    marginTop: 14,
    textAlign: "center",
  },
  userEmail: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 3,
  },

  // Partner Status Pill
  partnerStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
    marginTop: 10,
  },
  partnerStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  partnerStatusText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: COLORS.success,
  },
  waitingStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 164, 92, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 8,
    marginTop: 10,
  },
  waitingStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
  },
  waitingStatusText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: COLORS.orange,
  },
  waitingInviteLink: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: COLORS.primaryLight,
    textDecorationLine: "underline",
  },

  // Relationship Type Section
  relationSectionTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 10,
    marginTop: 4,
    marginLeft: 2,
  },
  relationCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
  },
  relationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
    marginRight: 10,
  },
  relationIconCol: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  relationTextCol: {
    flex: 1,
  },
  relationTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
  relationSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 2,
  },

  sectionHeader: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.cardSmall,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  settingsRowContent: {
    flex: 1,
  },
  settingsRowTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: COLORS.white,
  },
  settingsRowSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.45)",
    marginTop: 2,
  },
  destructiveText: {
    color: COLORS.error,
  },

  footer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  versionText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.35)",
  },
  copyrightText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.22)",
    marginTop: 4,
  },
});
