function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInRange(rng: () => number, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1));
}

export interface LoveMatchResult {
  overall: number;
  communication: number;
  chemistry: number;
  trust: number;
  longTerm: number;
}

export function calculateLoveMatch(
  name1: string,
  dob1: string,
  name2: string,
  dob2: string,
): LoveMatchResult {
  const norm = (s: string) => s.trim().toLowerCase();
  const pairA = { name: norm(name1), dob: dob1 };
  const pairB = { name: norm(name2), dob: dob2 };
  const sorted = [pairA, pairB].sort((a, b) => a.name.localeCompare(b.name));
  const first = sorted[0] ?? pairA;
  const second = sorted[1] ?? pairB;
  const combined = `${first.name}|${first.dob}::${second.name}|${second.dob}`;
  const seed = hashString(combined);
  const rng = mulberry32(seed);
  const communication = randInRange(rng, 65, 99);
  const chemistry = randInRange(rng, 65, 99);
  const trust = randInRange(rng, 65, 99);
  const longTerm = randInRange(rng, 65, 99);
  const rawOverall =
    communication * 0.3 + chemistry * 0.3 + trust * 0.25 + longTerm * 0.15;
  const overall = Math.min(98, Math.max(76, Math.round(rawOverall)));
  return { overall, communication, chemistry, trust, longTerm };
}

// Dev-only verification tests
if (__DEV__) {
  try {
    const res1 = calculateLoveMatch(
      "Rahul",
      "2001-04-12",
      "Priya",
      "2002-11-08",
    );
    const res2 = calculateLoveMatch(
      "Rahul",
      "2001-04-12",
      "Priya",
      "2002-11-08",
    );
    // (a) Identical inputs give identical outputs
    const testA = JSON.stringify(res1) === JSON.stringify(res2);

    // (b) Swapping DOBs gives different result
    const resSwappedDob = calculateLoveMatch(
      "Rahul",
      "2002-11-08",
      "Priya",
      "2001-04-12",
    );
    const testB = JSON.stringify(res1) !== JSON.stringify(resSwappedDob);

    // (c) Swapping person order gives identical result
    const resSwappedOrder = calculateLoveMatch(
      "Priya",
      "2002-11-08",
      "Rahul",
      "2001-04-12",
    );
    const testC = JSON.stringify(res1) === JSON.stringify(resSwappedOrder);

    if (!testA || !testB || !testC) {
      console.warn("LoveMatch verification failed:", { testA, testB, testC });
    }
  } catch (e) {
    console.warn("LoveMatch test error:", e);
  }
}
