import { QUESTION_BANK, Question, QuestionCategory } from "@/src/data/questions";
import { pickBalanced, shuffle, shuffleArray, selectBalancedRandom } from "@/src/utils/pick-balanced";

export { shuffle, shuffleArray, pickBalanced, selectBalancedRandom };

export function selectSessionQuestions(): Question[] {
  const categories: readonly QuestionCategory[] = ["fun", "deep", "romantic"];
  return pickBalanced(QUESTION_BANK, categories, (q) => q.category, 7);
}
