import { supabase } from "@/src/lib/supabase";
import {
  QUIZ_QUESTION_BANK,
  QuizCategory,
  QuizQuestion,
} from "@/src/data/quizQuestions";
import { selectBalancedRandom } from "@/src/lib/questionSelector";

export function selectQuizQuestions(): QuizQuestion[] {
  const categories: readonly QuizCategory[] = [
    "preferences",
    "habits",
    "memories",
    "future",
  ];
  return selectBalancedRandom(
    QUIZ_QUESTION_BANK,
    categories,
    (q) => q.category,
    [3, 3, 2, 2],
  );
}

export interface ScoreHeadline {
  title: string;
  desc: string;
}

export function getScoreHeadline(percentage: number): ScoreHeadline {
  if (percentage >= 90) {
    return {
      title: "Incredible Soulmates! 💖",
      desc: "You know each other inside and out. Your bond is truly exceptional!",
    };
  }
  if (percentage >= 70) {
    return {
      title: "Super In Sync! 💕",
      desc: "You know your partner wonderfully well! A couple that really pays attention.",
    };
  }
  if (percentage >= 50) {
    return {
      title: "Growing Closer Everyday! 🥰",
      desc: "A great foundation with plenty of cute new things to keep discovering!",
    };
  }
  return {
    title: "Exciting Discoveries Ahead! 🌱",
    desc: "Every answer is a chance to spark deeper conversation and learn more about each other.",
  };
}

export async function createQuizSession(
  answererId: string,
  reviewerId: string,
  questions: QuizQuestion[],
): Promise<string> {
  const questionIds = questions.map((q) => q.id);

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      answerer_id: answererId,
      reviewer_id: reviewerId,
      question_ids: questionIds,
      status: "awaiting_review",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create quiz session.");
  }

  return data.id;
}
