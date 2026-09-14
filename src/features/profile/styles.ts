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
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerPlaceholder: {
    width: 40,
  },
  topEditButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 130,
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
    borderColor: "#FF4D6D",
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#3A1A38",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarLetter: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 46,
    color: "#FFFFFF",
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  userName: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 26,
    color: "#FFFFFF",
    marginTop: 14,
    textAlign: "center",
  },
  userEmail: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "#94A3B8",
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
    backgroundColor: "#10B981",
  },
  partnerStatusText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#10B981",
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
    backgroundColor: "#FFA45C",
  },
  waitingStatusText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FFA45C",
  },
  waitingInviteLink: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FF8FA3",
    textDecorationLine: "underline",
  },

  // Relationship Type Section (Matching Lovio Reference Image 2)
  relationSectionTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 10,
    marginTop: 4,
    marginLeft: 2,
  },
  relationCard: {
    backgroundColor: "#1E1527",
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
    color: "#FFFFFF",
  },
  relationSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 2,
  },

  // Clean Settings Group (No noisy AI colored icon boxes)
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
    backgroundColor: "#1E1527",
    borderRadius: 20,
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
    color: "#FFFFFF",
  },
  settingsRowSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.45)",
    marginTop: 2,
  },
  destructiveText: {
    color: "#EF4444",
  },

  // Footer & Version
  footer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  versionText: {
    fontFamily: "Fredoka_500Medium",
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
