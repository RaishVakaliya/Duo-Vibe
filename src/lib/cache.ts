import AsyncStorage from "@react-native-async-storage/async-storage";

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // Unix ms
}

const memoryStore = new Map<string, CacheEntry<unknown>>();

const KEY_PREFIX = "duo:cache:";

function storageKey(key: string): string {
  return `${KEY_PREFIX}${key}`;
}

export async function getCache<T>(key: string): Promise<T | null> {
  const now = Date.now();

  // 1. L1 — memory check
  const memEntry = memoryStore.get(key) as CacheEntry<T> | undefined;
  if (memEntry) {
    if (memEntry.expiresAt > now) {
      return memEntry.data;
    }
    // Stale — evict from both layers
    memoryStore.delete(key);
    AsyncStorage.removeItem(storageKey(key)).catch(() => {});
    return null;
  }

  // 2. L2 — AsyncStorage check
  try {
    const raw = await AsyncStorage.getItem(storageKey(key));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (parsed.expiresAt <= now) {
      // Stale — evict
      AsyncStorage.removeItem(storageKey(key)).catch(() => {});
      return null;
    }

    // Promote back to L1
    memoryStore.set(key, parsed as CacheEntry<unknown>);
    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Write a value to both cache layers with the given TTL.
 * @param key        Cache key (namespaced automatically)
 * @param data       Value to store
 * @param ttlSeconds Time-to-live in seconds (e.g. 300 = 5 minutes)
 */
export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number,
): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };

  memoryStore.set(key, entry as CacheEntry<unknown>);

  try {
    await AsyncStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // AsyncStorage failures must not propagate to callers
  }
}

export async function invalidateCache(key: string): Promise<void> {
  memoryStore.delete(key);
  try {
    await AsyncStorage.removeItem(storageKey(key));
  } catch {
    // ignore
  }
}

export async function clearAllCache(): Promise<void> {
  memoryStore.clear();
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter((k) => k.startsWith(KEY_PREFIX));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch {
    // ignore
  }
}


export const TTL = {
  PROFILE: 10 * 60,
  COUPLE: 15 * 60,
  QUIZ_SESSIONS: 2 * 60,
  TQS_SESSION: 5 * 60,
  COUPLE_PLANS: 3 * 60,
} as const;
