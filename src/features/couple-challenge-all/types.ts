// ─── Couple Challenge All Screen — Types ─────────────────────────────────────

import { CoupleChallengeProgress, ChallengeLoadState } from "@/src/types";

export interface UseCoupleChallengAll {
  loadState: ChallengeLoadState;
  progress: CoupleChallengeProgress | null;
  handleRetry: () => void;
}
