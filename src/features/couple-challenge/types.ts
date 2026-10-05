// ─── Couple Challenge Main Screen — Types ────────────────────────────────────

import { CoupleChallengeState } from "@/src/types";

export type ChallengeLoadState = "loading" | "error" | "no_partner" | "ready";

export interface UseCoupleChallenge {
  loadState: ChallengeLoadState;
  challengeState: CoupleChallengeState | null;
  partnerName: string | null;
  isMarkingDone: boolean;
  handleMarkDone: () => Promise<void>;
  handleRetry: () => void;
}
