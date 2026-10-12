import { ReviewSessionData } from "@/src/lib/quiz";

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
