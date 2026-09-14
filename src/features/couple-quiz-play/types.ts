import { QuizQuestion } from "@/src/data/quizQuestions";

export interface CoupleQuizPlayParams {
  sessionId?: string;
  questions?: string;
}

export interface CoupleQuizPlayState {
  currentIndex: number;
  answers: Record<string, string>;
  isSubmitting: boolean;
  isSubmitted: boolean;
}
