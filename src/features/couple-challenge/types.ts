// ─── Couple Challenge Main Screen — Types ────────────────────────────────────

import { CoupleChallengeProgress } from "@/src/types";

export type ChallengeLoadState = "loading" | "error" | "no_partner" | "ready";

export interface UseCoupleChallenge {
  loadState: ChallengeLoadState;
  progress: CoupleChallengeProgress | null;
  partnerName: string | null;
  isMarkingDone: boolean;
  handleMarkDone: () => Promise<void>;
  handleRetry: () => void;
}
