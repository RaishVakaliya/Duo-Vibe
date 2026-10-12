import {
  FLAG_STATEMENTS,
  FLAG_CATEGORIES,
  FlagStatement,
} from "@/src/data/flagStatements";
import { pickBalanced } from "@/src/utils/pick-balanced";

export function selectFlagStatements(): FlagStatement[] {
  return pickBalanced(
    FLAG_STATEMENTS,
    FLAG_CATEGORIES,
    (s) => s.category,
    [4, 4, 3, 3, 3, 3],
  );
}

export function getStatementsFromIds(ids: string[]): FlagStatement[] {
  const map = new Map<string, FlagStatement>();
  FLAG_STATEMENTS.forEach((s) => map.set(s.id, s));

  return ids
    .map((id) => map.get(id))
    .filter((s): s is FlagStatement => s !== undefined);
}
