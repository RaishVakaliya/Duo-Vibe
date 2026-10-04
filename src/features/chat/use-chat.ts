import { useState, useCallback, useEffect, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/src/context/auth";
import { getPartnerId } from "@/src/lib/quizSession";
import {
  buildCoupleKey,
  fetchMessages,
  sendMessage,
  markMessagesRead,
  subscribeToNewMessages,
  subscribeToPartnerPresence,
} from "@/src/lib/chat";
import { supabase } from "@/src/lib/supabase";
import { ChatMessage } from "@/src/types";
import { UseChat, ChatLoadState, ChatTheme } from "./types";
import {
  DEFAULT_CHAT_THEME,
  loadSavedChatTheme,
  saveChatTheme,
} from "./chat-themes";

const PAGE_SIZE = 50;

// Generate a temporary client-side id for optimistic messages
function tempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function useChat(): UseChat {
  const { user, hasPartner } = useAuth();

  const [loadState, setLoadState] = useState<ChatLoadState>("loading");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string | null>(null);
  const [isPartnerOnline, setIsPartnerOnline] = useState<boolean>(false);
  const [partnerLastSeen, setPartnerLastSeen] = useState<string | null>(null);
  const [coupleKey, setCoupleKey] = useState<string | null>(null);
  const [draftText, setDraftText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [chatTheme, setChatTheme] = useState<ChatTheme>(DEFAULT_CHAT_THEME);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const unsubscribePresenceRef = useRef<(() => void) | null>(null);
  const partnerIdRef = useRef<string | null>(null);
  const coupleKeyRef = useRef<string | null>(null);

  // ─── Load saved theme on mount ─────────────────────────────────────────
  useEffect(() => {
    loadSavedChatTheme().then(setChatTheme);
  }, []);

  const updateChatTheme = useCallback((newTheme: ChatTheme) => {
    setChatTheme(newTheme);
    saveChatTheme(newTheme);
  }, []);

  // ─── Load initial data ────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!user) return;
    if (!hasPartner) {
      setLoadState("no_partner");
      return;
    }

    setLoadState("loading");
    try {
      const partnerId = await getPartnerId(user.id);
      if (!partnerId) {
        setLoadState("no_partner");
        return;
      }

      partnerIdRef.current = partnerId;
      const key = buildCoupleKey(user.id, partnerId);
      coupleKeyRef.current = key;
      setCoupleKey(key);

      // Fetch partner profile name, avatar & last activity
      const { data: pProfile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, updated_at")
        .eq("id", partnerId)
        .maybeSingle();

      setPartnerName(pProfile?.full_name ?? null);
      setPartnerAvatarUrl(pProfile?.avatar_url ?? null);
      if (pProfile?.updated_at) {
        setPartnerLastSeen(pProfile.updated_at);
      }

      // Fetch initial messages
      const msgs = await fetchMessages(key, PAGE_SIZE);
      setMessages(msgs);
      setHasMore(msgs.length === PAGE_SIZE);
      setLoadState("ready");

      // Subscribe to realtime messages
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = subscribeToNewMessages(key, (incoming) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === incoming.id)) return prev;
          const optimisticIdx = prev.findIndex(
            (m) =>
              m.id.startsWith("temp_") &&
              m.sender_id === incoming.sender_id &&
              m.content === incoming.content,
          );
          if (optimisticIdx !== -1) {
            const next = [...prev];
            next[optimisticIdx] = { ...incoming, status: "sent" };
            return next;
          }
          return [incoming, ...prev];
        });
      });

      // Subscribe to real-time presence (LIVE online / offline status)
      if (unsubscribePresenceRef.current) unsubscribePresenceRef.current();
      unsubscribePresenceRef.current = subscribeToPartnerPresence(
        key,
        user.id,
        partnerId,
        (isOnline, lastSeen) => {
          setIsPartnerOnline(isOnline);
          if (lastSeen) {
            setPartnerLastSeen(lastSeen);
          }
        },
      );
    } catch (err) {
      console.error("[useChat] load error:", err);
      setLoadState("error");
    }
  }, [user, hasPartner]);

  useEffect(() => {
    load();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (unsubscribePresenceRef.current) {
        unsubscribePresenceRef.current();
        unsubscribePresenceRef.current = null;
      }
    };
  }, [load]);

  // ─── Mark read on focus ───────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      const key = coupleKeyRef.current;
      const uid = user?.id;
      if (key && uid) {
        markMessagesRead(key, uid).catch(() => {});
      }
    }, [user?.id]),
  );

  // ─── Send message ─────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = draftText.trim();
    if (!text || !user || !coupleKeyRef.current || isSending) return;

    const key = coupleKeyRef.current;
    const optimisticMsg: ChatMessage = {
      id: tempId(),
      couple_key: key,
      sender_id: user.id,
      content: text,
      created_at: new Date().toISOString(),
      read_at: null,
      status: "sending",
    };

    setDraftText("");
    setIsSending(true);
    setMessages((prev) => [optimisticMsg, ...prev]);

    try {
      const myName = (user.user_metadata?.full_name as string | undefined) ?? undefined;
      const saved = await sendMessage(key, user.id, text, myName);
      // Replace optimistic entry with confirmed message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMsg.id ? { ...saved, status: "sent" } : m,
        ),
      );
    } catch (err) {
      console.error("[useChat] send error:", err);
      // Mark as failed so user can tap to retry
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMsg.id ? { ...m, status: "failed" } : m,
        ),
      );
    } finally {
      setIsSending(false);
    }
  }, [draftText, user, isSending]);

  // ─── Send image message ───────────────────────────────────────────────
  const handleSendImage = useCallback(
    async (uri: string) => {
      if (!user || !coupleKeyRef.current || isSending) return;

      const key = coupleKeyRef.current;
      const content = uri.startsWith("[image]") ? uri : `[image]${uri}`;

      const optimisticMsg: ChatMessage = {
        id: tempId(),
        couple_key: key,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
        read_at: null,
        status: "sending",
      };

      setIsSending(true);
      setMessages((prev) => [optimisticMsg, ...prev]);

      try {
        const myName = (user.user_metadata?.full_name as string | undefined) ?? undefined;
        const saved = await sendMessage(key, user.id, content, myName);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMsg.id ? { ...saved, status: "sent" } : m,
          ),
        );
      } catch (err) {
        console.error("[useChat] send image error:", err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMsg.id ? { ...m, status: "failed" } : m,
          ),
        );
      } finally {
        setIsSending(false);
      }
    },
    [user, isSending],
  );

  // ─── Retry failed message ─────────────────────────────────────────────
  const handleRetryMessage = useCallback(
    async (messageId: string) => {
      if (!user || !coupleKeyRef.current) return;
      const msg = messages.find((m) => m.id === messageId);
      if (!msg || msg.status !== "failed") return;

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: "sending" } : m)),
      );

      try {
        const myName = (user.user_metadata?.full_name as string | undefined) ?? undefined;
        const saved = await sendMessage(coupleKeyRef.current, user.id, msg.content, myName);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...saved, status: "sent" } : m,
          ),
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: "failed" } : m)),
        );
      }
    },
    [messages, user],
  );

  // ─── Load older messages ──────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !coupleKeyRef.current) return;

    const oldest = messages[messages.length - 1];
    if (!oldest) return;

    setIsLoadingMore(true);
    try {
      const older = await fetchMessages(
        coupleKeyRef.current,
        PAGE_SIZE,
        oldest.created_at,
      );
      setMessages((prev) => [...prev, ...older]);
      setHasMore(older.length === PAGE_SIZE);
    } catch (err) {
      console.warn("[useChat] loadMore error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, messages]);

  return {
    userId: user?.id,
    loadState,
    messages,
    partnerName,
    partnerAvatarUrl,
    isPartnerOnline,
    partnerLastSeen,
    draftText,
    isSending,
    isLoadingMore,
    hasMore,
    coupleKey,
    chatTheme,
    isThemeModalOpen,
    setIsThemeModalOpen,
    updateChatTheme,
    setDraftText,
    handleSend,
    handleSendImage,
    handleRetry: load,
    handleLoadMore,
    handleRetryMessage,
  };
}
