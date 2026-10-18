import { Image } from "expo-image";
import { Image as RNImage } from "react-native";

const ONBOARDING_HERO_IMAGES = [
  require("@/assets/images/memory_beach.webp"),
  require("@/assets/images/memory_stargazing.webp"),
  require("@/assets/images/memory_cafe.webp"),
] as const;

export function prefetchOnboardingMemoriesImages(): void {
  const uris = ONBOARDING_HERO_IMAGES.map((src) => {
    const resolved = RNImage.resolveAssetSource(src);
    return resolved?.uri;
  }).filter((uri): uri is string => Boolean(uri));

  if (uris.length === 0) return;
  Image.prefetch(uris).catch(() => {});
}
