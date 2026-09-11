import { QuestionCategory } from "@/data/questions";

export interface TwentyOneQuestionsState {
  currentIndex: number;
  answers: Record<string, string>;
}

export interface OptionIconMeta {
  name: string;
  color: string;
}

export const CATEGORY_BADGE: Record<
  QuestionCategory,
  { label: string; color: string; bg: string }
> = {
  fun: { label: "Fun", color: "#F97316", bg: "#FFF7ED" },
  deep: { label: "Deep", color: "#6366F1", bg: "#EEF2FF" },
  romantic: { label: "Romantic", color: "#EC4899", bg: "#FDF2F8" },
};
