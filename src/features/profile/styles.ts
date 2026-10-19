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
  // ── Hero banner ────────────────────────────────────────────────
  heroBanner: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    position: "relative",
    justifyContent: "space-between",
  },
  heroBannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroBannerFallback: {
    ...StyleSheet.absoluteFillObject,
  },
  heroBannerScrim: {
    ...StyleSheet.absoluteFillObject,
    // Gradient-like scrim: dark at top and bottom for icon + avatar readability
    backgroundColor: "rgba(10, 4, 19, 0.45)",
  },
  heroActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 2,
  },
  heroActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  // ── Avatar ring (inside hero) ───────────────────────────────────
  avatarRing: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 3,
    borderColor: COLORS.primary,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.avatarPlaceholderBg,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarLetter: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 38,
    color: COLORS.white,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  // ── Name / email / status below hero ────────────────────────────
  profileHero: {
    alignItems: "center",
    marginTop: 14,
    marginBottom: 22,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingCard: {
    backgroundColor: "rgba(30, 27, 38, 0.95)",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: RADIUS.card,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  loadingText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: COLORS.white,
  },
});
