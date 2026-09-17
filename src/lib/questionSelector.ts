import { QUESTION_BANK, Question, QuestionCategory } from "@/src/data/questions";

export function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
  }
  return arr;
}

/**
 * Generic balanced random selection utility.
 * Groups items by category, randomly picks the requested count per category,
 * and returns the final selection shuffled.
 *
 * @param pool All candidate items
 * @param categories List of category keys to sample from
 * @param getCategory Accessor function to extract category from an item
 * @param countPerCategory Uniform count number, or per-category count array/function
 */
export function selectBalancedRandom<T, C extends string = string>(
  pool: readonly T[],
  categories: readonly C[],
  getCategory: (item: T) => C,
  countPerCategory:
    | number
    | readonly number[]
    | ((category: C, index: number) => number),
): T[] {
  const selected: T[] = [];
  const activeCategories = Array.isArray(countPerCategory)
    ? shuffleArray(categories)
    : categories;

  activeCategories.forEach((category, idx) => {
    const categoryPool = pool.filter((item) => getCategory(item) === category);
    let count: number;
    if (typeof countPerCategory === "number") {
      count = countPerCategory;
    } else if (typeof countPerCategory === "function") {
      count = countPerCategory(category, idx);
    } else {
      count = countPerCategory[idx] ?? 2;
    }
    const picked = shuffleArray(categoryPool).slice(0, count);
    selected.push(...picked);
  });

  return shuffleArray(selected);
}

export function selectSessionQuestions(): Question[] {
  const categories: readonly QuestionCategory[] = ["fun", "deep", "romantic"];
  return selectBalancedRandom(QUESTION_BANK, categories, (q) => q.category, 7);
}
