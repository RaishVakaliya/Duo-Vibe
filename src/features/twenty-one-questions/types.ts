// ─── 21 Questions Feature — Types ─────────────────────────────────────────────

import {
  TwentyOneQuestionsSession,
  TwentyOneQuestionsReveal,
} from "@/src/types";

export type TwentyOneQLoadState = "loading" | "error" | "no_partner" | "ready";

export interface UseTwentyOneQuestions {
  loadState: TwentyOneQLoadState;
  session: TwentyOneQuestionsSession | null;
  reveals: TwentyOneQuestionsReveal[];
  currentIndex: number;
  myAnswerCount: number;
  partnerAnswerCount: number;
  selectedAnswer: string | undefined;
  isSubmitting: boolean;
  handleSelectOption: (option: string) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleRetry: () => void;
}
