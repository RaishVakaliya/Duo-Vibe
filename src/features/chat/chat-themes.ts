import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatTheme, BgThemeOption, BubbleThemeOption } from "./types";

export const CHAT_THEME_STORAGE_KEY = "@duo_chat_theme_v1";

export const BG_THEMES: readonly BgThemeOption[] = [
  {
    id: "navy",
    name: "Duo Navy",
    colors: ["#0E0B19", "#171328"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Dark",
    colors: ["#0B141A", "#111B21"],
  },
  {
    id: "midnight",
    name: "OLED Midnight",
    colors: ["#040407", "#0D0D14"],
  },
  {
    id: "plum",
    name: "Velvet Plum",
    colors: ["#1A0B1B", "#2B112D"],
  },
  {
    id: "emerald",
    name: "Deep Emerald",
    colors: ["#071612", "#0F261F"],
  },
  {
    id: "twilight",
    name: "Twilight Purple",
    colors: ["#140C24", "#24133A"],
  },
  {
    id: "espresso",
    name: "Warm Espresso",
    colors: ["#16100E", "#261A16"],
  },
] as const;

export const BUBBLE_THEMES: readonly BubbleThemeOption[] = [
  {
    id: "pink",
    name: "Romantic Pink",
    colors: ["#FF2D6C", "#FF6B8B"],
  },
  {
    id: "whatsapp_green",
    name: "WhatsApp Green",
    colors: ["#005C4B", "#008069"],
  },
  {
    id: "purple",
    name: "Royal Violet",
    colors: ["#7C3AED", "#A855F7"],
  },
  {
    id: "blue",
    name: "Electric Blue",
    colors: ["#0284C7", "#38BDF8"],
  },
  {
    id: "coral",
    name: "Sunset Coral",
    colors: ["#EA580C", "#FB923C"],
  },
  {
    id: "crimson",
    name: "Crimson Rose",
    colors: ["#E11D48", "#FB7185"],
  },
  {
    id: "teal",
    name: "Ocean Teal",
    colors: ["#0D9488", "#2DD4BF"],
  },
  {
    id: "slate",
    name: "Minimal Slate",
    colors: ["#334155", "#475569"],
  },
] as const;

export const DEFAULT_BG_COLORS: readonly [string, string] = ["#0E0B19", "#171328"];
export const DEFAULT_BUBBLE_COLORS: readonly [string, string] = ["#FF2D6C", "#FF6B8B"];

export const DEFAULT_CHAT_THEME: ChatTheme = {
  bgId: "navy",
  bubbleId: "pink",
};

export function getBgColors(bgId: string): readonly [string, string] {
  const found = BG_THEMES.find((t) => t.id === bgId);
  return found ? found.colors : DEFAULT_BG_COLORS;
}

export function getBubbleColors(bubbleId: string): readonly [string, string] {
  const found = BUBBLE_THEMES.find((t) => t.id === bubbleId);
  return found ? found.colors : DEFAULT_BUBBLE_COLORS;
}

export async function loadSavedChatTheme(): Promise<ChatTheme> {
  try {
    const raw = await AsyncStorage.getItem(CHAT_THEME_STORAGE_KEY);
    if (!raw) return DEFAULT_CHAT_THEME;
    const parsed = JSON.parse(raw);
    const bgExists = BG_THEMES.some((t) => t.id === parsed.bgId);
    const bubbleExists = BUBBLE_THEMES.some((t) => t.id === parsed.bubbleId);
    return {
      bgId: bgExists ? parsed.bgId : DEFAULT_CHAT_THEME.bgId,
      bubbleId: bubbleExists ? parsed.bubbleId : DEFAULT_CHAT_THEME.bubbleId,
    };
  } catch {
    return DEFAULT_CHAT_THEME;
  }
}

export async function saveChatTheme(theme: ChatTheme): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAT_THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (err) {
    console.warn("[chat-themes] failed to save theme:", err);
  }
}
