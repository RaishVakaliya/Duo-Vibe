import { supabase } from "@/src/lib/supabase";

interface CachedUrl {
  url: string;
  expiresAt: number;
}

const urlCache = new Map<string, CachedUrl>();

function getCacheKey(bucket: string, path: string): string {
  return `${bucket}:${path}`;
}

/**
 * Batch resolve signed URLs for an array of storage paths in any private bucket.
 * Cached in memory with 1-hour expiry (with 5-minute safety margin).
 * Defaults to 'memories' bucket for backward compatibility.
 */
export async function getSignedUrlsBatch(
  paths: string[],
  bucket: string = "memories",
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const now = Date.now();
  const toFetch: string[] = [];

  for (const path of paths) {
    if (!path) continue;
    const key = getCacheKey(bucket, path);
    const cached = urlCache.get(key);
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
      .from(bucket)
      .createSignedUrls(uniqueToFetch, 3600);

    if (!error && data) {
      for (const item of data) {
        if (item.path && item.signedUrl && !item.error) {
          const key = getCacheKey(bucket, item.path);
          urlCache.set(key, {
            url: item.signedUrl,
            expiresAt: now + 3500 * 1000,
          });
          result.set(item.path, item.signedUrl);
        }
      }
    }
  } catch (err) {
    console.warn(`[storage:${bucket}] Failed to batch create signed URLs:`, err);
  }

  return result;
}

/** Get signed URL for single path from in-memory cache if valid */
export function getCachedSignedUrl(
  path: string | null,
  bucket: string = "memories",
): string | null {
  if (!path) return null;
  const key = getCacheKey(bucket, path);
  const cached = urlCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }
  return null;
}

/** Cache a freshly acquired or local signed URL manually */
export function setCachedSignedUrl(
  path: string,
  url: string,
  bucket: string = "memories",
): void {
  const key = getCacheKey(bucket, path);
  urlCache.set(key, {
    url,
    expiresAt: Date.now() + 3500 * 1000,
  });
}

