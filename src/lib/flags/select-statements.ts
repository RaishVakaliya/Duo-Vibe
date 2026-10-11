import {
  FLAG_STATEMENTS,
  FLAG_CATEGORIES,
  FlagStatement,
  FlagCategory,
} from "@/src/data/flagStatements";
import { shuffleArray } from "@/src/lib/questionSelector";

/**
 * Selects 20 statements balanced across the 6 categories:
 * 2 categories get 4 statements, and 4 categories get 3 statements (total: 20).
 * Shuffled so categories appear organically throughout the deck.
 */
export function selectFlagStatements(): FlagStatement[] {
  const randomizedCategories = shuffleArray([...FLAG_CATEGORIES]);
  const selected: FlagStatement[] = [];

  randomizedCategories.forEach((category: FlagCategory, index: number) => {
    // First 2 categories get 4 items, remaining 4 get 3 items -> 4 + 4 + 3 + 3 + 3 + 3 = 20
    const count = index < 2 ? 4 : 3;
    const categoryStatements = FLAG_STATEMENTS.filter(
      (s) => s.category === category,
    );
    const shuffledPool = shuffleArray(categoryStatements);
    selected.push(...shuffledPool.slice(0, count));
  });

  return shuffleArray(selected);
}

/**
 * Reconstructs the 20 statements in order from a stored array of statement IDs.
 */
export function getStatementsFromIds(ids: string[]): FlagStatement[] {
  const map = new Map<string, FlagStatement>();
  FLAG_STATEMENTS.forEach((s) => map.set(s.id, s));

  return ids
    .map((id) => map.get(id))
    .filter((s): s is FlagStatement => s !== undefined);
}
