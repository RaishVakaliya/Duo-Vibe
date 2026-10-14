import { supabase } from "@/src/lib/supabase";
import { Memory } from "@/src/types";
import { getSignedUrlsBatch } from "./signed-url-cache";

export const MEMORIES_PAGE_SIZE = 20;

export interface FetchMemoriesParams {
  coupleKey: string;
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface FetchMemoriesResult {
  memories: Memory[];
  hasMore: boolean;
  page: number;
}

export async function fetchMemories({
  coupleKey,
  userId,
  page = 0,
  pageSize = MEMORIES_PAGE_SIZE,
}: FetchMemoriesParams): Promise<FetchMemoriesResult> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  // 1. Fetch memories slice
  const { data: rows, error } = await supabase
    .from("memories")
    .select("id, couple_key, created_by, kind, title, note, memory_date, image_path, payload, created_at")
    .eq("couple_key", coupleKey)
    .order("memory_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to load memories: ${error.message}`);
  }

  if (!rows || rows.length === 0) {
    return {
      memories: [],
      hasMore: false,
      page,
    };
  }

  const memoryIds = rows.map((r) => r.id);
  const creatorIds = Array.from(new Set(rows.map((r) => r.created_by)));
  const imagePaths = rows
    .map((r) => r.image_path)
    .filter((p): p is string => Boolean(p));

  // 2. Fetch reactions, creator profiles, and signed URLs in parallel
  const [reactionsRes, profilesRes, signedUrlsMap] = await Promise.all([
    supabase
      .from("memory_reactions")
      .select("memory_id, user_id")
      .in("memory_id", memoryIds),
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", creatorIds),
    getSignedUrlsBatch(imagePaths),
  ]);

  // Aggregate reactions by memory_id
  const reactionMap = new Map<
    string,
    { count: number; hasReacted: boolean }
  >();
  if (reactionsRes.data) {
    for (const rx of reactionsRes.data) {
      const current = reactionMap.get(rx.memory_id) ?? {
        count: 0,
        hasReacted: false,
      };
      current.count += 1;
      if (rx.user_id === userId) {
        current.hasReacted = true;
      }
      reactionMap.set(rx.memory_id, current);
    }
  }

  // Map creators by id
  const profileMap = new Map<
    string,
    { fullName: string | null; avatarUrl: string | null }
  >();
  if (profilesRes.data) {
    for (const p of profilesRes.data) {
      profileMap.set(p.id, {
        fullName: p.full_name,
        avatarUrl: p.avatar_url,
      });
    }
  }

  // 3. Assemble domain Memory items
  const memories: Memory[] = rows.map((r) => {
    const rxInfo = reactionMap.get(r.id) ?? { count: 0, hasReacted: false };
    const creatorInfo = profileMap.get(r.created_by);
    const resolvedUrl = r.image_path ? signedUrlsMap.get(r.image_path) ?? null : null;

    return {
      id: r.id,
      couple_key: r.couple_key,
      created_by: r.created_by,
      kind: r.kind,
      title: r.title,
      note: r.note,
      memory_date: r.memory_date,
      image_path: r.image_path,
      image_url: resolvedUrl,
      payload: (r.payload as Record<string, unknown>) ?? null,
      created_at: r.created_at,
      reactions_count: rxInfo.count,
      has_reacted: rxInfo.hasReacted,
      creator: creatorInfo
        ? {
            id: r.created_by,
            fullName: creatorInfo.fullName,
            avatarUrl: creatorInfo.avatarUrl,
          }
        : undefined,
    };
  });

  return {
    memories,
    hasMore: rows.length === pageSize,
    page,
  };
}
