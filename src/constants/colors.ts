export const COLORS = {
  primary: "#FF4D6D",
  primaryLight: "#FF8FA3",
  coral: "#FF6B5B",
  orange: "#FFA45C",
  purple: "#9B51E0",
  violet: "#6C5CE7",
  cyan: "#00D2FF",
  white: "#FFFFFF",
  textMuted: "#94A3B8",
  textDim: "#BFA8BC",
  darkOverlay: "#0D0B1A",
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
