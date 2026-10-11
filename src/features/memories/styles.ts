import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS } from "@/src/constants/colors";

const SCREEN_W = Dimensions.get("window").width;

export const styles = StyleSheet.create({
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

  // ─── Header ────────────────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.65)",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // ─── Anniversary Chip ──────────────────────────────────────────────────────
  anniversaryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  anniversaryChipText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 6,
  },

  // ─── Timeline & Month Group ────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120, // Keep clear of floating tab bar
  },
  monthHeader: {
    marginVertical: 12,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  monthHeaderText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FFE2E6",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // ─── Polaroid Card ─────────────────────────────────────────────────────────
  cardWrapper: {
    marginVertical: 10,
    alignItems: "center",
  },
  polaroidCard: {
    width: SCREEN_W * 0.88,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    paddingBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  polaroidImageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    position: "relative",
  },
  polaroidPhoto: {
    width: "100%",
    height: "100%",
  },
  polaroidFooter: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
    lineHeight: 22,
    color: "#1E1B26",
    flex: 1,
    marginRight: 8,
  },
  cardDateText: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E2E8F0",
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    backgroundColor: "#E2E8F0",
  },
  creatorName: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "#475569",
  },
  heartButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: "#FFF1F2",
  },
  heartButtonActive: {
    backgroundColor: "#FFE4E6",
  },
  heartCount: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FF2D55",
    marginLeft: 4,
  },

  // ─── Result Card ───────────────────────────────────────────────────────────
  resultCard: {
    width: SCREEN_W * 0.88,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    overflow: "hidden",
  },
  resultCardGradient: {
    borderRadius: 18,
    padding: 16,
  },
  resultHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  resultBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resultBadgeText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
  },
  resultDate: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
  },
  resultTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    lineHeight: 26,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  resultScoreBanner: {
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginVertical: 10,
  },
  resultScoreText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    lineHeight: 38,
    color: "#FFE2E6",
  },
  resultScoreSubtext: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
  resultFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  resultCreatorName: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
  },
  resultHeartButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  resultHeartCount: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
  },

  // ─── Floating "+" Button ───────────────────────────────────────────────────
  floatingAddButton: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#FF5E62",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 9,
    zIndex: 10,
  },
  floatingAddGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  // ─── Empty State ───────────────────────────────────────────────────────────
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  emptyHeartCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  emptyTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.65)",
    textAlign: "center",
    marginBottom: 24,
  },

  // ─── Blocking State (No Partner) ───────────────────────────────────────────
  blockingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  blockingIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  blockingTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 10,
  },
  blockingSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 28,
  },
  inviteButton: {
    width: "100%",
    maxWidth: 280,
    height: 52,
    borderRadius: RADIUS.button,
    overflow: "hidden",
  },
  inviteButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  inviteButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },

  // ─── Error & Retry State ───────────────────────────────────────────────────
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: RADIUS.button,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },

  // ─── Load More Indicator ───────────────────────────────────────────────────
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  // ─── Onboarding Preview (Legacy Re-use) ────────────────────────────────────
  onboardingHeaderRow: {
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
  onboardingContent: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  onboardingTitle: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.white,
    marginBottom: 8,
  },
  onboardingSubtitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  polaroidContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  previewCard: {
    position: "absolute",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    paddingBottom: 36,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  previewLeft: {
    left: "3%",
    top: 30,
    width: SCREEN_W * 0.44,
    height: SCREEN_W * 0.44 * 1.22,
    zIndex: 1,
  },
  previewRight: {
    right: "3%",
    top: 50,
    width: SCREEN_W * 0.46,
    height: SCREEN_W * 0.46 * 1.22,
    zIndex: 2,
  },
  previewCenter: {
    bottom: 20,
    width: SCREEN_W * 0.48,
    height: SCREEN_W * 0.48 * 1.22,
    zIndex: 3,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  onboardingFooter: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  continueButton: {
    height: 56,
    borderRadius: RADIUS.button,
    overflow: "hidden",
  },
  continueButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 17,
    color: COLORS.white,
  },
});
