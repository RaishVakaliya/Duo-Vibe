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

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatDateDisplay(isoString: string): string {
  if (!isoString) return "Select Date";
  try {
    const [year, month, day] = isoString.split("-");
    if (!year || !month || !day) return isoString;
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );
    const dayFormatted = String(date.getDate()).padStart(2, "0");
    const monthShort = date.toLocaleString("en-US", { month: "short" });
    const fullYear = date.getFullYear();
    return `${dayFormatted} ${monthShort} ${fullYear}`;
  } catch {
    return isoString;
  }
}
