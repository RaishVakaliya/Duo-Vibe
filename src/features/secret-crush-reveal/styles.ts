import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOWS } from "@/src/constants/colors";

const CRUSH_PINK = "#FF2D6C";
const CRUSH_PINK_SOFT = "#FF4D6D";
const CRUSH_BORDER = "rgba(255, 77, 109, 0.22)";
const CARD_BG = "rgba(255, 255, 255, 0.04)";

export const styles = StyleSheet.create({
  // ── Layout ─────────────────────────────────────────────────────────────
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
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
    alignItems: "center",
  },

  // ── Header / Nav ──────────────────────────────────────────────────────
  topNavRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
    width: "100%",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circleBack,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: { width: 40 },
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

  // ── Loading / Error ────────────────────────────────────────────────────
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  centeredTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 22,
    color: "#FFFFFF",
    textAlign: "center",
  },
  centeredSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },

  // ── Illustration ──────────────────────────────────────────────────────
  illustrationContainer: {
    marginBottom: 24,
    alignItems: "center",
  },

  // ── Message Card ──────────────────────────────────────────────────────
  messageCard: {
    width: "100%",
    backgroundColor: CARD_BG,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: CRUSH_BORDER,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  messageLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  messageText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
  },

  // ── Status Badge ─────────────────────────────────────────────────────
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  statusBadgeSent: { backgroundColor: "rgba(100,116,139,0.25)" },
  statusBadgeOpened: { backgroundColor: "rgba(251,191,36,0.2)" },
  statusBadgeReplied: { backgroundColor: "rgba(16,185,129,0.2)" },
  statusText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statusTextSent: { color: "#94A3B8" },
  statusTextOpened: { color: "#FBBF24" },
  statusTextReplied: { color: "#10B981" },

  // ── Sender-only view ─────────────────────────────────────────────────
  senderTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
  },
  senderSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  copyLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.button,
    backgroundColor: "rgba(255,45,108,0.12)",
    borderWidth: 1,
    borderColor: CRUSH_BORDER,
    width: "100%",
    marginBottom: 16,
  },
  copyLinkText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: CRUSH_PINK_SOFT,
  },

  // ── Reply display (sender sees it) ────────────────────────────────────
  replyCard: {
    width: "100%",
    backgroundColor: "rgba(16,185,129,0.07)",
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.22)",
    padding: 16,
    marginBottom: 20,
  },
  replyCardLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#10B981",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  replyCardText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 22,
  },

  // ── Recipient: mystery / reveal ──────────────────────────────────────
  recipientHeadline: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
  },
  recipientSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  // ── Reply Input ──────────────────────────────────────────────────────
  replyInputCard: {
    width: "100%",
    backgroundColor: CARD_BG,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: CRUSH_BORDER,
    padding: 16,
    marginBottom: 16,
  },
  replyInputLabel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  replyTextArea: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: "#FFFFFF",
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  replyCharCount: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "right",
    marginTop: 8,
  },

  // ── Reply Submit Button ──────────────────────────────────────────────
  sendReplyButton: {
    width: "100%",
    borderRadius: RADIUS.button,
    overflow: "hidden",
    marginBottom: 16,
    ...SHADOWS.primaryAction,
  },
  sendReplyButtonDisabled: {
    opacity: 0.45,
  },
  sendReplyGradient: {
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  sendReplyButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  // ── Confirmation (post-reply) ────────────────────────────────────────
  confirmCard: {
    width: "100%",
    backgroundColor: "rgba(16,185,129,0.07)",
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.22)",
    padding: 20,
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  confirmTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },
  confirmSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
