export function getCoupleKey(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join("_");
}

export const buildCoupleKey = getCoupleKey;
