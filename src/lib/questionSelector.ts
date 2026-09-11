import { QUESTION_BANK, Question, QuestionCategory } from "@/data/questions";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
  }
  return arr;
}

export function selectSessionQuestions(): Question[] {
  const categories: QuestionCategory[] = ["fun", "deep", "romantic"];
  const selected: Question[] = [];

  for (const category of categories) {
    const pool = QUESTION_BANK.filter((q) => q.category === category);
    const shuffled = shuffleArray(pool).slice(0, 7);
    selected.push(...shuffled);
  }

  return shuffleArray(selected);
}
