import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@/src/context/auth-context";
import { getPartnerId } from "@/src/lib/quiz";
import { buildCoupleKey } from "@/src/lib/challenge";
import {
  fetchMemories,
  MEMORIES_PAGE_SIZE,
  toggleReaction,
  deleteMemory,
  subscribeToMemories,
  getAnniversaryDate,
  setAnniversaryDate,
  computeDaysTogether,
} from "@/src/lib/memories";
import { Memory } from "@/src/types";
import {
  MemoriesLoadState,
  MonthGroup,
  UseMemoriesDataResult,
} from "./types";

export function useMemoriesData(): UseMemoriesDataResult {
  const { user, hasPartner } = useAuth();

  const [loadState, setLoadState] = useState<MemoriesLoadState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [coupleKey, setCoupleKey] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [daysTogether, setDaysTogether] = useState<number | null>(null);
  const [anniversaryDate, setAnniversaryDateState] = useState<string | null>(
    null,
  );

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAnniversaryPickerOpen, setIsAnniversaryPickerOpen] =
    useState<boolean>(false);

  const coupleKeyRef = useRef<string | null>(null);
  const unsubscribeRealtimeRef = useRef<(() => void) | null>(null);

  // ─── Initialize Couple Key & Anniversary ───────────────────────────────────
  const initCouple = useCallback(async () => {
    if (!user || !hasPartner) {
      setLoadState("no_partner");
      return null;
    }

    try {
      const partnerId = await getPartnerId(user.id);
      if (!partnerId) {
        setLoadState("no_partner");
        return null;
      }

      const cKey = buildCoupleKey(user.id, partnerId);
      coupleKeyRef.current = cKey;
      setCoupleKey(cKey);

      // Load anniversary date
      const anni = await getAnniversaryDate(user.id);
      if (anni) {
        setAnniversaryDateState(anni);
        setDaysTogether(computeDaysTogether(anni));
      } else {
        setAnniversaryDateState(null);
        setDaysTogether(null);
      }

      return cKey;
    } catch (err) {
      console.warn("[memories] Init couple error:", err);
      setLoadState("error");
      setErrorMessage("Could not connect to partner session.");
      return null;
    }
  }, [user, hasPartner]);

  // ─── Fetch Initial Page ───────────────────────────────────────────────────
  const loadInitialMemories = useCallback(async (cKey: string) => {
    if (!user) return;
    try {
      setLoadState("loading");
      setErrorMessage(null);

      const result = await fetchMemories({
        coupleKey: cKey,
        userId: user.id,
        page: 0,
        pageSize: MEMORIES_PAGE_SIZE,
      });

      setMemories(result.memories);
      setHasMore(result.hasMore);
      setPage(0);
      setLoadState("ready");
    } catch (err: unknown) {
      console.warn("[memories] Fetch memories error:", err);
      setLoadState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load memories.",
      );
    }
  }, [user]);

  // ─── Realtime Sync ────────────────────────────────────────────────────────
  const setupRealtime = useCallback((cKey: string) => {
    if (unsubscribeRealtimeRef.current) {
      unsubscribeRealtimeRef.current();
    }

    const unsub = subscribeToMemories({
      coupleKey: cKey,
      onMemoryChange: () => {
        // Silently reload top page when memories change
        if (user) {
          fetchMemories({
            coupleKey: cKey,
            userId: user.id,
            page: 0,
            pageSize: MEMORIES_PAGE_SIZE,
          })
            .then((res) => {
              setMemories((prev) => {
                // Merge while preserving older pages
                const newIds = new Set(res.memories.map((m) => m.id));
                const older = prev.filter((m) => !newIds.has(m.id));
                return [...res.memories, ...older];
              });
            })
            .catch(() => {});
        }
      },
      onReactionChange: () => {
        // Refetch current slice
        if (user) {
          fetchMemories({
            coupleKey: cKey,
            userId: user.id,
            page: 0,
            pageSize: (page + 1) * MEMORIES_PAGE_SIZE,
          })
            .then((res) => {
              setMemories(res.memories);
            })
            .catch(() => {});
        }
      },
    });

    unsubscribeRealtimeRef.current = unsub;
  }, [user, page]);

  // ─── Mount / Dependency Trigger ───────────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    if (!user || !hasPartner) {
      setLoadState("no_partner");
      return;
    }

    initCouple().then((cKey) => {
      if (isCancelled || !cKey) return;
      loadInitialMemories(cKey);
      setupRealtime(cKey);
    });

    return () => {
      isCancelled = true;
      if (unsubscribeRealtimeRef.current) {
        unsubscribeRealtimeRef.current();
        unsubscribeRealtimeRef.current = null;
      }
    };
  }, [user, hasPartner, initCouple, loadInitialMemories, setupRealtime]);

  // ─── Refresh (Pull-to-refresh) ─────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    if (!coupleKeyRef.current || !user) return;
    setIsRefreshing(true);
    try {
      const result = await fetchMemories({
        coupleKey: coupleKeyRef.current,
        userId: user.id,
        page: 0,
        pageSize: MEMORIES_PAGE_SIZE,
      });
      setMemories(result.memories);
      setHasMore(result.hasMore);
      setPage(0);
      setLoadState("ready");
      setErrorMessage(null);
    } catch (err: unknown) {
      console.warn("[memories] Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  // ─── Load More (Pagination) ───────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (
      !hasMore ||
      isLoadingMore ||
      isRefreshing ||
      !coupleKeyRef.current ||
      !user
    ) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const result = await fetchMemories({
        coupleKey: coupleKeyRef.current,
        userId: user.id,
        page: nextPage,
        pageSize: MEMORIES_PAGE_SIZE,
      });

      if (result.memories.length > 0) {
        setMemories((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const additions = result.memories.filter((m) => !existingIds.has(m.id));
          return [...prev, ...additions];
        });
        setPage(nextPage);
      }
      setHasMore(result.hasMore);
    } catch (err) {
      console.warn("[memories] Load more error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, isRefreshing, page, user]);

  // ─── Group Memories by Month ───────────────────────────────────────────────
  const groupedMemories = useMemo<MonthGroup[]>(() => {
    const groups: Map<string, Memory[]> = new Map();

    for (const mem of memories) {
      const d = new Date(mem.memory_date + "T00:00:00");
      const monthKey = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      const arr = groups.get(monthKey) ?? [];
      arr.push(mem);
      groups.set(monthKey, arr);
    }

    return Array.from(groups.entries()).map(([monthKey, data]) => ({
      monthKey,
      data,
    }));
  }, [memories]);

  // ─── Toggle Reaction ───────────────────────────────────────────────────────
  const handleToggleReaction = useCallback(
    async (memory: Memory) => {
      if (!user) return;
      const willReact = !memory.has_reacted;

      // Optimistic update in list
      setMemories((prev) =>
        prev.map((m) =>
          m.id === memory.id
            ? {
                ...m,
                has_reacted: willReact,
                reactions_count: willReact
                  ? m.reactions_count + 1
                  : Math.max(0, m.reactions_count - 1),
              }
            : m,
        ),
      );

      // Optimistic update in selected modal
      if (selectedMemory && selectedMemory.id === memory.id) {
        setSelectedMemory({
          ...selectedMemory,
          has_reacted: willReact,
          reactions_count: willReact
            ? selectedMemory.reactions_count + 1
            : Math.max(0, selectedMemory.reactions_count - 1),
        });
      }

      try {
        await toggleReaction({
          memoryId: memory.id,
          userId: user.id,
          hasReacted: memory.has_reacted,
        });
      } catch (err) {
        console.warn("[memories] Toggle reaction error, reverting:", err);
        // Revert on error
        setMemories((prev) =>
          prev.map((m) =>
            m.id === memory.id
              ? {
                  ...m,
                  has_reacted: memory.has_reacted,
                  reactions_count: memory.reactions_count,
                }
              : m,
          ),
        );
      }
    },
    [user, selectedMemory],
  );

  // ─── Delete Memory ─────────────────────────────────────────────────────────
  const handleDeleteMemory = useCallback(
    async (memory: Memory) => {
      // Optimistic removal
      setMemories((prev) => prev.filter((m) => m.id !== memory.id));
      setSelectedMemory(null);

      try {
        await deleteMemory({
          memoryId: memory.id,
          imagePath: memory.image_path,
        });
      } catch (err) {
        console.warn("[memories] Delete error, reloading:", err);
        handleRefresh();
      }
    },
    [handleRefresh],
  );

  // ─── Anniversary Date ──────────────────────────────────────────────────────
  const handleSaveAnniversaryDate = useCallback(
    async (dateStr: string) => {
      if (!user) return;
      try {
        await setAnniversaryDate(user.id, dateStr);
        setAnniversaryDateState(dateStr);
        setDaysTogether(computeDaysTogether(dateStr));
        setIsAnniversaryPickerOpen(false);
      } catch (err) {
        console.warn("[memories] Save anniversary error:", err);
      }
    },
    [user],
  );

  // ─── Memory Created ────────────────────────────────────────────────────────
  const handleMemoryCreated = useCallback((newMemory: Memory) => {
    setMemories((prev) => [newMemory, ...prev]);
  }, []);

  const retry = useCallback(() => {
    if (coupleKeyRef.current) {
      loadInitialMemories(coupleKeyRef.current);
    } else {
      initCouple().then((cKey) => {
        if (cKey) loadInitialMemories(cKey);
      });
    }
  }, [initCouple, loadInitialMemories]);

  return {
    loadState,
    errorMessage,
    hasPartner,
    coupleKey,
    memories,
    groupedMemories,
    isRefreshing,
    isLoadingMore,
    hasMore,
    daysTogether,
    anniversaryDate,
    selectedMemory,
    isAddModalOpen,
    isAnniversaryPickerOpen,
    handleRefresh,
    handleLoadMore,
    handleOpenAddModal: () => setIsAddModalOpen(true),
    handleCloseAddModal: () => setIsAddModalOpen(false),
    handleSelectMemory: (m) => setSelectedMemory(m),
    handleCloseDetailModal: () => setSelectedMemory(null),
    handleToggleReaction,
    handleDeleteMemory,
    handleSaveAnniversaryDate,
    handleOpenAnniversaryPicker: () => setIsAnniversaryPickerOpen(true),
    handleCloseAnniversaryPicker: () => setIsAnniversaryPickerOpen(false),
    handleMemoryCreated,
    retry,
  };
}
