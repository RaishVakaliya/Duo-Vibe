export type FlagCategory =
  | "communication"
  | "trust"
  | "social media"
  | "habits"
  | "money"
  | "family";

export interface FlagStatement {
  id: string;
  category: FlagCategory;
  text: string;
}

export interface CategoryMeta {
  label: string;
  gradient: readonly [string, string, string];
  accentColor: string;
  badgeBg: string;
}

export const FLAG_CATEGORIES: readonly FlagCategory[] = [
  "communication",
  "trust",
  "social media",
  "habits",
  "money",
  "family",
] as const;

export const CATEGORY_META: Record<FlagCategory, CategoryMeta> = {
  communication: {
    label: "Communication",
    gradient: ["#0F2537", "#163852", "#0B1B29"],
    accentColor: "#38BDF8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
  },
  trust: {
    label: "Trust",
    gradient: ["#1F163D", "#2C1E57", "#140E28"],
    accentColor: "#A78BFA",
    badgeBg: "rgba(167, 139, 250, 0.15)",
  },
  "social media": {
    label: "Social Media",
    gradient: ["#33152F", "#4A1A43", "#220D1F"],
    accentColor: "#F472B6",
    badgeBg: "rgba(244, 114, 182, 0.15)",
  },
  habits: {
    label: "Habits",
    gradient: ["#0D2B24", "#134035", "#091E19"],
    accentColor: "#34D399",
    badgeBg: "rgba(52, 211, 153, 0.15)",
  },
  money: {
    label: "Money",
    gradient: ["#33220E", "#473014", "#211609"],
    accentColor: "#FBBF24",
    badgeBg: "rgba(251, 191, 36, 0.15)",
  },
  family: {
    label: "Family",
    gradient: ["#361919", "#4C2323", "#241010"],
    accentColor: "#FB7185",
    badgeBg: "rgba(251, 113, 133, 0.15)",
  },
};

export const FLAG_STATEMENTS: readonly FlagStatement[] = [
  // ── Communication (10) ──────────────────────────────────────────────────────
  {
    id: "comm_01",
    category: "communication",
    text: "Your partner replies 'k' to a long message.",
  },
  {
    id: "comm_02",
    category: "communication",
    text: "Your partner goes quiet for a day after a disagreement.",
  },
  {
    id: "comm_03",
    category: "communication",
    text: "Your partner never says sorry first.",
  },
  {
    id: "comm_04",
    category: "communication",
    text: "Your partner remembers the small things you mentioned once.",
  },
  {
    id: "comm_05",
    category: "communication",
    text: "Your partner says 'we need to talk' and then waits until tomorrow.",
  },
  {
    id: "comm_06",
    category: "communication",
    text: "Your partner calls you when they know you are having a tough day.",
  },
  {
    id: "comm_07",
    category: "communication",
    text: "Your partner interrupts you mid-story to make a joke.",
  },
  {
    id: "comm_08",
    category: "communication",
    text: "Your partner brings up old arguments during a new one.",
  },
  {
    id: "comm_09",
    category: "communication",
    text: "Your partner checks in to see if you made it home safely.",
  },
  {
    id: "comm_10",
    category: "communication",
    text: "Your partner leaves you on read for hours while being active online.",
  },

  // ── Trust (10) ─────────────────────────────────────────────────────────────
  {
    id: "trust_01",
    category: "trust",
    text: "Your partner has never let you see their phone.",
  },
  {
    id: "trust_02",
    category: "trust",
    text: "Your partner tells you where they are without being asked.",
  },
  {
    id: "trust_03",
    category: "trust",
    text: "Your partner is still close friends with an ex.",
  },
  {
    id: "trust_04",
    category: "trust",
    text: "Your partner keeps their location on for you.",
  },
  {
    id: "trust_05",
    category: "trust",
    text: "Your partner hides their screen when a message arrives.",
  },
  {
    id: "trust_06",
    category: "trust",
    text: "Your partner shares their phone passcode with you without being asked.",
  },
  {
    id: "trust_07",
    category: "trust",
    text: "Your partner tells you white lies to avoid small conflicts.",
  },
  {
    id: "trust_08",
    category: "trust",
    text: "Your partner is completely open about who they are hanging out with.",
  },
  {
    id: "trust_09",
    category: "trust",
    text: "Your partner questions your whereabouts when you go out with friends.",
  },
  {
    id: "trust_10",
    category: "trust",
    text: "Your partner admits when they made a mistake before you find out.",
  },

  // ── Social Media (10) ──────────────────────────────────────────────────────
  {
    id: "soc_01",
    category: "social media",
    text: "Your partner likes their ex's Instagram posts.",
  },
  {
    id: "soc_02",
    category: "social media",
    text: "Your partner posts you on their stories regularly.",
  },
  {
    id: "soc_03",
    category: "social media",
    text: "Your partner has never posted a photo of you.",
  },
  {
    id: "soc_04",
    category: "social media",
    text: "Your partner follows a lot of models.",
  },
  {
    id: "soc_05",
    category: "social media",
    text: "Your partner checks who viewed their story before replying to you.",
  },
  {
    id: "soc_06",
    category: "social media",
    text: "Your partner leaves sweet comments on your photos.",
  },
  {
    id: "soc_07",
    category: "social media",
    text: "Your partner still keeps photos with their ex on their main feed.",
  },
  {
    id: "soc_08",
    category: "social media",
    text: "Your partner sends you memes throughout the workday.",
  },
  {
    id: "soc_09",
    category: "social media",
    text: "Your partner cares more about taking photos on dates than enjoying the moment.",
  },
  {
    id: "soc_10",
    category: "social media",
    text: "Your partner soft-launches you instead of tagging your profile.",
  },

  // ── Habits (10) ────────────────────────────────────────────────────────────
  {
    id: "hab_01",
    category: "habits",
    text: "Your partner is always late, and always says sorry.",
  },
  {
    id: "hab_02",
    category: "habits",
    text: "Your partner chews loudly and laughs it off.",
  },
  {
    id: "hab_03",
    category: "habits",
    text: "Your partner plans surprises for no reason.",
  },
  {
    id: "hab_04",
    category: "habits",
    text: "Your partner falls asleep on calls with you.",
  },
  {
    id: "hab_05",
    category: "habits",
    text: "Your partner leaves wet towels on the bed.",
  },
  {
    id: "hab_06",
    category: "habits",
    text: "Your partner makes your coffee or tea just the way you like it.",
  },
  {
    id: "hab_07",
    category: "habits",
    text: "Your partner spends the first hour of every morning scrolling their phone.",
  },
  {
    id: "hab_08",
    category: "habits",
    text: "Your partner cleans up after cooking without asking for praise.",
  },
  {
    id: "hab_09",
    category: "habits",
    text: "Your partner cancels plans last minute because of low social battery.",
  },
  {
    id: "hab_10",
    category: "habits",
    text: "Your partner kisses your forehead when walking past you.",
  },

  // ── Money (10) ─────────────────────────────────────────────────────────────
  {
    id: "mon_01",
    category: "money",
    text: "Your partner splits the bill down to the last coin.",
  },
  {
    id: "mon_02",
    category: "money",
    text: "Your partner always pays without making it a thing.",
  },
  {
    id: "mon_03",
    category: "money",
    text: "Your partner hides what they spend.",
  },
  {
    id: "mon_04",
    category: "money",
    text: "Your partner saves up for dates together.",
  },
  {
    id: "mon_05",
    category: "money",
    text: "Your partner borrows money and forgets.",
  },
  {
    id: "mon_06",
    category: "money",
    text: "Your partner talks openly with you about financial goals.",
  },
  {
    id: "mon_07",
    category: "money",
    text: "Your partner buys expensive things on impulse while complaining about rent.",
  },
  {
    id: "mon_08",
    category: "money",
    text: "Your partner suggests budget-friendly date ideas so you both save.",
  },
  {
    id: "mon_09",
    category: "money",
    text: "Your partner keeps tabs on every coffee they bought you.",
  },
  {
    id: "mon_10",
    category: "money",
    text: "Your partner celebrates your career milestones with thoughtful treats.",
  },

  // ── Family (10) ────────────────────────────────────────────────────────────
  {
    id: "fam_01",
    category: "family",
    text: "Your partner introduces you to their family early.",
  },
  {
    id: "fam_02",
    category: "family",
    text: "Your partner always takes their family's side in arguments.",
  },
  {
    id: "fam_03",
    category: "family",
    text: "Your partner never mentions you to their parents.",
  },
  {
    id: "fam_04",
    category: "family",
    text: "Your partner is kind to your family.",
  },
  {
    id: "fam_05",
    category: "family",
    text: "Your partner's family has opinions about everything you do.",
  },
  {
    id: "fam_06",
    category: "family",
    text: "Your partner makes an effort to remember your siblings' names and birthdays.",
  },
  {
    id: "fam_07",
    category: "family",
    text: "Your partner shares private relationship details with their mother.",
  },
  {
    id: "fam_08",
    category: "family",
    text: "Your partner invites you along to casual weekend family lunches.",
  },
  {
    id: "fam_09",
    category: "family",
    text: "Your partner lets their parents make major decisions for them.",
  },
  {
    id: "fam_10",
    category: "family",
    text: "Your partner stands up for you if a relative makes an uncomfortable remark.",
  },
] as const;

export function getStatementById(id: string): FlagStatement | undefined {
  return FLAG_STATEMENTS.find((s) => s.id === id);
}
