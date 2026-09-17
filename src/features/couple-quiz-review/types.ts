import { QuizQuestion } from "@/src/data/quizQuestions";
import { QuizAnswer } from "@/src/types";

export interface CoupleQuizReviewParams {
  sessionId?: string;
}

export interface GradedAnswerMap {
  [answerId: string]: boolean;
}

export interface ReviewProgressHeaderProps {
  progressFraction: number;
  onBack: () => void;
}

export interface ReviewQuestionCardProps {
  currentIndex: number;
  total: number;
  currentAnswer?: QuizAnswer & { question?: QuizQuestion };
  currentGrade?: boolean;
  onGrade: (isCorrect: boolean) => void;
}
