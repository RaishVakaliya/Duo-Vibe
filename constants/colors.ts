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
};

export const GRADIENTS = {
  /**
   * Premium Midnight Velvet Background — deeply rich, elegant, and modern
   * Used as the unified screen background across Login, Onboarding, and Auth.
   */
  background: ["#1C0E2D", "#12091F", "#0A0413"] as const,
  backgroundLocations: [0, 0.5, 1] as const,

  /**
   * Warm Romantic Coral & Sunset Gradient (Main CTA / Continue)
   */
  primary: ["#FF4D6D", "#FFA45C"] as const,
  primaryLocations: [0, 1] as const,

  /**
   * Soft Pink to Rose Gradient
   */
  welcomeButton: ["#FF4D6D", "#FF8FA3"] as const,

  /**
   * Fluid Purple to Sky-Blue Gradient (From reference image for organic fluid buttons)
   */
  fluidBluePurple: ["#e475eaff", "#f163efff", "#e238f8ff"] as const,

  /**
   * Selected Option Card Glow (Violet to Electric Teal)
   */
  optionSelected: ["#e0c343ff", "#00a94cff"] as const,

  /**
   * Progress Bar Gradient
   */
  progressBar: ["#FF4D6D", "#FFA45C"] as const,
};
