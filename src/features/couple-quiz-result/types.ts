import { ReviewSessionData } from "@/src/lib/quizSession";

export interface CoupleQuizResultParams {
  sessionId?: string;
  score?: string;
}

export interface CoupleQuizResultState {
  isLoading: boolean;
  sessionData: ReviewSessionData | null;
  score: number;
  total: number;
}
