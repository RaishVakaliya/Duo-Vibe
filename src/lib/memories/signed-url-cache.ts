import { supabase } from "@/src/lib/supabase";

interface CachedUrl {
  url: string;
  expiresAt: number;
}

const memoryUrlCache = new Map<string, CachedUrl>();

/**
 * Batch resolve signed URLs for an array of storage paths.
 * Cached in memory with 1-hour expiry (with 5-minute safety margin).
 */
export async function getSignedUrlsBatch(
  paths: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const now = Date.now();
  const toFetch: string[] = [];

  for (const path of paths) {
    if (!path) continue;
    const cached = memoryUrlCache.get(path);
    if (cached && cached.expiresAt > now + 5 * 60 * 1000) {
      result.set(path, cached.url);
    } else {
      toFetch.push(path);
    }
  }

  if (toFetch.length === 0) {
    return result;
  }

  // De-duplicate paths
  const uniqueToFetch = Array.from(new Set(toFetch));

  try {
    const { data, error } = await supabase.storage
      .from("memories")
      .createSignedUrls(uniqueToFetch, 3600);

    if (!error && data) {
      for (const item of data) {
        if (item.path && item.signedUrl && !item.error) {
          memoryUrlCache.set(item.path, {
            url: item.signedUrl,
            expiresAt: now + 3500 * 1000,
          });
          result.set(item.path, item.signedUrl);
        }
      }
    }
  } catch (err) {
    console.warn("[memories] Failed to batch create signed URLs:", err);
  }

  return result;
}

/** Get signed URL for single path from in-memory cache if valid */
export function getCachedSignedUrl(path: string | null): string | null {
  if (!path) return null;
  const cached = memoryUrlCache.get(path);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }
  return null;
}

/** Cache a freshly acquired signed URL manually */
export function setCachedSignedUrl(path: string, url: string): void {
  memoryUrlCache.set(path, {
    url,
    expiresAt: Date.now() + 3500 * 1000,
  });
}
