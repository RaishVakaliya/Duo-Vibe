export const COLORS = {
  // Brand & Accents
  primary: "#FF4D6D",
  primaryLight: "#FF8FA3",
  primaryVibrant: "#FF2D6C",
  primaryDark: "#E11D48",
  coral: "#FF6B5B",
  orange: "#FFA45C",
  purple: "#9B51E0",
  violet: "#6C5CE7",
  cyan: "#00D2FF",
  white: "#FFFFFF",
  black: "#000000",

  // Typography
  textPrimary: "#1E1B26",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  textDim: "#BFA8BC",
  textDarkSlate: "#1E293B",
  textSlateLight: "#475569",

  // Backgrounds & Surfaces
  darkOverlay: "#0D0B1A",
  bgDark: "#12091F",
  darkCard: "#1E1527",
  darkCardSubtle: "#181024",
  cardInnerDark: "#161028",
  avatarPlaceholderBg: "#3A1A38",
  bgPinkLight: "#FFF5F7",
  bgPinkAlt: "#FFF0F4",
  surfaceLight: "#F8FAFC",
  surfaceCard: "#FFFFFF",
  pillBg: "#FBF3F4",
  pillSelectedBg: "#FFE9EF",
  borderLight: "#F1F5F9",
  borderDisabled: "#CBD5E1",
  disabledBg: "#CBD5E1",

  // Status & Feedback
  success: "#10B981",
  successDark: "#059669",
  successLight: "#ECFDF5",
  successBorder: "#A7F3D0",
  error: "#EF4444",
  errorDark: "#DC2626",
  errorLight: "#FEF2F2",
  errorBorder: "#FECACA",
  errorText: "#B91C1C",

  // Love Match progress bar & theme tokens
  matchCommunication: "#0D9488",
  matchChemistry: "#059669",
  matchTrust: "#4F46E5",
  matchLongTerm: "#F43F5E",
  matchPinkLight: "#FFF0F3",
  matchPinkCard: "rgba(255, 255, 255, 0.92)",
  matchTrackBg: "rgba(0, 0, 0, 0.06)",
};

export const GRADIENTS = {
  /**
   * Premium Midnight Velvet Background — deeply rich, elegant, and modern
   * Used as the unified screen background across Login, Onboarding, and Auth.
   */
  background: ["#1C0E2D", "#12091F", "#0A0413"] as const,
  backgroundLocations: [0, 0.5, 1] as const,

  /**
   * Main Continue / Action Button Gradient (Unique glowing coral-amber)
   */
  primary: ["#FF4D6D", "#FF758C", "#FFA07A"] as const,
  primaryLocations: [0, 0.5, 1] as const,

  /**
   * Vibrant Pink Action Button Gradient (Used across primary calculate/next/submit actions)
   */
  primaryAction: ["#FF4D6D", "#FF2D55", "#E11D48"] as const,

  /**
   * Disabled Button Gradient
   */
  buttonDisabled: ["#CBD5E1", "#94A3B8"] as const,

  /**
   * Soft Pink to Rose Gradient
   */
  welcomeButton: ["#FF4D6D", "#FF8FA3"] as const,

  /**
   * Selected Option Card Glow (Amber to Emerald)
   */
  optionSelected: ["#E0C343", "#00A94C"] as const,

  /**
   * Progress Bar Gradient (Glowing Neon Rose to Peach)
   */
  progressBar: ["#FF4D6D", "#FFA45C"] as const,

  /**
   * Date Ideas Card Neon Glow Borders
   */
  cardGreen: ["#10B981", "#34D399", "#86EFAC"] as const,
  cardOrange: ["#F97316", "#FB923C", "#FDE047"] as const,
  cardPurpleCyan: ["#8B5CF6", "#6366F1", "#38BDF8"] as const,

  /**
   * Game Mode Card Gradients (Play & Compare Screen)
   */
  gameIck: ["#A3E635", "#22C55E"] as const,
  gameWouldYouRather: ["#FBBF24", "#EF4444"] as const,
  gameGuessMyAnswer: ["#F59E0B", "#EC4899"] as const,
  gameAgreeOrDisagree: ["#A855F7", "#6366F1"] as const,
};

export const RADIUS = {
  button: 28, // Standard full-pill button radius (h: 56)
  buttonFooter: 26, // Dual-button footer radius (h: 52)
  card: 20, // Structured card radius (restrained, modern, not squircle bubble)
  cardSmall: 16, // Secondary / inner modal / option cards
  input: 14, // Crisp text inputs & picker containers
  pill: 9999, // Pill tags and badges
  circleBack: 20, // 40x40 circular back button
  circleBackLg: 22, // 44x44 circular back button
};

export const SHADOWS = {
  subtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: "#1E1B26",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardElevated: {
    shadowColor: "#1E1B26",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryAction: {
    shadowColor: "#FF4D6D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
};

export const SPACING = {
  screenPadding: 20,
  headerTop: 8,
  headerBottom: 12,
};

