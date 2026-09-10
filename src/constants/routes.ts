export const ROUTES = {
  SPLASH: "/",
  WELCOME: "/welcome",
  LOGIN: "/login",
  ONBOARDING: "/onboarding",
  DATE_IDEAS: "/date-ideas",
  PLAY_COMPARE: "/play-compare",
  MEMORIES: "/memories",
  READY: "/ready",
  INVITE_PARTNER: "/invite-partner",
  HOME: "/home",
  LOVE_MATCH: "/love-match",
  LOVE_MATCH_RESULT: "/love-match-result",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
