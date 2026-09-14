import { QuizSession } from "@/src/types";

export interface CoupleQuizStartState {
  isLoading: boolean;
  isStarting: boolean;
  hasPartner: boolean;
  activeSession: QuizSession | null;
  errorMessage: string | null;
}
