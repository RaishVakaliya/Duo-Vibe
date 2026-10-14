import { useState, useEffect } from "react";
import {
  getCachedSignedUrl,
  getSignedUrlsBatch,
} from "@/src/lib/memories/signed-url-cache";

/**
 * React hook that returns a displayable image URL.
 * Supports:
 * - Local file URIs ("file://...", "content://...")
 * - Data URLs ("data:image/...")
 * - Full remote HTTP(S) URLs ("https://...")
 * - Supabase storage paths ("coupleKey/messageId.jpg") via batch signed URL cache
 */
export function useStorageImageUrl(
  rawPath: string | null | undefined,
  bucket: string = "chat-images",
): string | null {
  const [url, setUrl] = useState<string | null>(() => {
    if (!rawPath) return null;
    if (
      rawPath.startsWith("data:") ||
      rawPath.startsWith("file:") ||
      rawPath.startsWith("content:") ||
      rawPath.startsWith("http://") ||
      rawPath.startsWith("https://")
    ) {
      return rawPath;
    }
    return getCachedSignedUrl(rawPath, bucket);
  });

  useEffect(() => {
    if (!rawPath) {
      setUrl(null);
      return;
    }

    if (
      rawPath.startsWith("data:") ||
      rawPath.startsWith("file:") ||
      rawPath.startsWith("content:") ||
      rawPath.startsWith("http://") ||
      rawPath.startsWith("https://")
    ) {
      setUrl(rawPath);
      return;
    }

    // Check if in-memory cache already has valid signed URL
    const cached = getCachedSignedUrl(rawPath, bucket);
    if (cached) {
      setUrl(cached);
      return;
    }

    // Otherwise fetch signed URL
    let isCancelled = false;
    getSignedUrlsBatch([rawPath], bucket).then((map) => {
      if (!isCancelled) {
        const resolved = map.get(rawPath);
        if (resolved) {
          setUrl(resolved);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [rawPath, bucket]);

  return url;
}
