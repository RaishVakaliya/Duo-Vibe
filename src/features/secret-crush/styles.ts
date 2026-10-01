import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOWS } from "@/src/constants/colors";

// ─── Palette ─────────────────────────────────────────────────────────────────
const CRUSH_PINK = "#FF2D6C";
const CRUSH_PINK_SOFT = "#FF4D6D";
const CRUSH_PINK_GLOW = "rgba(255, 45, 108, 0.18)";
const CRUSH_CARD_BG = "rgba(255, 255, 255, 0.04)";
const CRUSH_BORDER = "rgba(255, 77, 109, 0.22)";

export const styles = StyleSheet.create({
  // ── Layout ────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  topNavRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  headerTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
  },

  // ── Tab Bar ───────────────────────────────────────────────────────────────
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: RADIUS.cardSmall,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: CRUSH_PINK_GLOW,
    borderWidth: 1,
    borderColor: CRUSH_BORDER,
  },
  tabText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: CRUSH_PINK_SOFT,
    fontFamily: "Fredoka_600SemiBold",
  },

  // ── Compose Card ─────────────────────────────────────────────────────────
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 48,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  composeCard: {
    backgroundColor: CRUSH_CARD_BG,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: CRUSH_BORDER,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  composeLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  textArea: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: "#FFFFFF",
    minHeight: 120,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  charCount: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "right",
    marginTop: 8,
  },

  // ── Create Button ─────────────────────────────────────────────────────────
  createButton: {
    borderRadius: RADIUS.button,
    overflow: "hidden",
    marginBottom: 20,
    ...SHADOWS.primaryAction,
  },
  createButtonDisabled: {
    opacity: 0.45,
  },
  createGradient: {
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  // ── Link Card (post-creation) ─────────────────────────────────────────────
  linkCard: {
    backgroundColor: "rgba(255, 45, 108, 0.06)",
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: CRUSH_BORDER,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    gap: 12,
  },
  linkCardTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  linkCardSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 19,
  },
  linkText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: CRUSH_PINK_SOFT,
    backgroundColor: "rgba(255, 77, 109, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
    textAlign: "center",
  },
  shareRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    width: "100%",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.cardSmall,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  shareButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  resetButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  resetButtonText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textMuted,
  },

  // ── Sent Messages List ────────────────────────────────────────────────────
  sentList: {
    gap: 12,
  },
  sentEmptyContainer: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  sentEmptyText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: COLORS.textMuted,
  },
  sentEmptySubtext: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  sentCard: {
    backgroundColor: CRUSH_CARD_BG,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: CRUSH_BORDER,
    padding: 16,
  },
  sentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sentCardDate: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: COLORS.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  statusBadgeSent: {
    backgroundColor: "rgba(100, 116, 139, 0.25)",
  },
  statusBadgeOpened: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
  },
  statusBadgeReplied: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  statusBadgeText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statusTextSent: { color: "#94A3B8" },
  statusTextOpened: { color: "#FBBF24" },
  statusTextReplied: { color: "#10B981" },
  sentCardMessage: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 20,
    marginBottom: 8,
  },
  sentCardReply: {
    backgroundColor: "rgba(16, 185, 129, 0.07)",
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
    gap: 2,
  },
  sentCardReplyLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 11,
    color: "#10B981",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sentCardReplyText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: COLORS.textDim,
    lineHeight: 18,
  },
  sentCardCopyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  sentCardCopyText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: CRUSH_PINK_SOFT,
  },
});
