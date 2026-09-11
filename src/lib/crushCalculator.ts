import { calculateLoveMatch } from "./loveMatch";

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

interface ScoreBand {
  min: number;
  max: number;
  headline: string;
  messages: string[];
}

const SCORE_BANDS: ScoreBand[] = [
  {
    min: 65,
    max: 70,
    headline: "It's complicated...",
    messages: [
      "Hard to tell what's on their mind right now.",
      "The signals are a little mixed at the moment.",
      "Might be worth giving it more time.",
    ],
  },
  {
    min: 70,
    max: 75,
    headline: "There's a small spark",
    messages: [
      "Something's there, but it's still early days.",
      "A little curiosity might be brewing.",
      "Keep being yourself — it's working, slowly.",
    ],
  },
  {
    min: 75,
    max: 80,
    headline: "You're on their mind!",
    messages: [
      "Your smile, your vibe, your presence... You're on their mind!",
      "They've definitely noticed you around.",
      "There's a good feeling in the air here.",
    ],
  },
  {
    min: 80,
    max: 90,
    headline: "They definitely notice you!",
    messages: [
      "Your energy is impossible to ignore.",
      "They light up a little when you're around.",
      "This one's looking pretty promising!",
    ],
  },
  {
    min: 90,
    max: 99,
    headline: "Sparks are flying!",
    messages: [
      "They can't stop thinking about you!",
      "This is about as strong as it gets!",
      "The connection here is undeniable.",
    ],
  },
];

function getScoreBand(score: number): ScoreBand {
  const fallback = SCORE_BANDS[SCORE_BANDS.length - 1];
  if (!fallback) {
    return {
      min: 90,
      max: 99,
      headline: "Sparks are flying!",
      messages: ["The connection here is undeniable."],
    };
  }
  return (
    SCORE_BANDS.find((band) => score >= band.min && score < band.max) ??
    fallback
  );
}

export interface CrushResult {
  percentage: number;
  headline: string;
  message: string;
}

export function calculateCrush(
  yourName: string,
  crushName: string,
): CrushResult {
  const norm = (s: string) => s.trim().toLowerCase();

  const combined = `CRUSH_CALC::${norm(yourName)}::${norm(crushName)}`;

  const seed = hashString(combined);
  const rng = mulberry32(seed);

  const percentage = randInRange(rng, 65, 98);
  const band = getScoreBand(percentage);
  const messageIndex = Math.floor(rng() * band.messages.length);
  const message = band.messages[messageIndex] ?? band.messages[0] ?? "";

  return {
    percentage,
    headline: band.headline,
    message,
  };
}

if (__DEV__) {
  try {
    const res1 = calculateCrush("Rahul", "Priya");
    const res2 = calculateCrush("Rahul", "Priya");
    const checkA =
      res1.percentage === res2.percentage && res1.message === res2.message;

    const resSwapped = calculateCrush("Priya", "Rahul");
    const checkB =
      res1.percentage !== resSwapped.percentage ||
      res1.message !== resSwapped.message;

    const loveMatchRes = calculateLoveMatch(
      "Rahul",
      "2001-04-12",
      "Priya",
      "2002-11-08",
    );
    const checkC = res1.percentage !== loveMatchRes.overall;

    if (!checkA || !checkB || !checkC) {
      console.warn("CrushCalculator dev check note:", {
        checkA,
        checkB,
        checkC,
      });
    }
  } catch (e) {
    console.warn("CrushCalculator dev check error:", e);
  }
}
