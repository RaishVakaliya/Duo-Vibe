import { useState, useCallback, useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/src/context/auth-context";
import { getPartnerId } from "@/src/lib/quiz";
import { usePartnerProfile } from "@/src/lib/shared/profileCache";
import { useUnreadBadge } from "@/src/lib/shared/unreadBadge";
import {
  buildCoupleKey,
  fetchMessages,
  sendMessage,
  markMessagesRead,
  subscribeToNewMessages,
  subscribeToPartnerPresence,
} from "@/src/lib/chat";
import { ChatMessage } from "@/src/types";
import { UseChat, ChatLoadState, ChatTheme } from "./types";
import {
  DEFAULT_CHAT_THEME,
  loadSavedChatTheme,
  saveChatTheme,
} from "./chat-themes";
import { clearAppBadge } from "@/src/lib/notifications";
import { uploadChatImage } from "@/src/lib/chat/upload-chat-image";
import {
  getSignedUrlsBatch,
  setCachedSignedUrl,
} from "@/src/lib/memories/signed-url-cache";

const PAGE_SIZE = 50;

function extractImagePaths(messageList: ChatMessage[]): string[] {
  return messageList
    .map((m) => m.content.replace(/^\[image\]/, "").trim())
    .filter(
      (c) =>
        Boolean(c) &&
        !c.startsWith("data:") &&
        !c.startsWith("file:") &&
        !c.startsWith("content:") &&
        !c.startsWith("http://") &&
        !c.startsWith("https://") &&
        c.includes("/"),
    );
}

// Generate a temporary client-side id for optimistic messages
function tempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function useChat(): UseChat {
  const { user, hasPartner } = useAuth();

  const [loadState, setLoadState] = useState<ChatLoadState>("loading");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [coupleKey, setCoupleKey] = useState<string | null>(null);
  const partnerProfile = usePartnerProfile(partnerId ?? undefined);
  const unreadChatCount = useUnreadBadge(coupleKey, user?.id ?? null);
  const [draftText, setDraftText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [chatTheme, setChatTheme] = useState<ChatTheme>(DEFAULT_CHAT_THEME);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [fullScreenImageUri, setFullScreenImageUri] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const unsubscribePresenceRef = useRef<(() => void) | null>(null);
  const partnerIdRef = useRef<string | null>(null);
  const coupleKeyRef = useRef<string | null>(null);
  const lastMarkReadRef = useRef<number>(0);

  // ─── Load saved theme on mount ─────────────────────────────────────────
  useEffect(() => {
    loadSavedChatTheme().then(setChatTheme);
  }, []);

  const updateChatTheme = useCallback((newTheme: ChatTheme) => {
    setChatTheme(newTheme);
    saveChatTheme(newTheme);
  }, []);

  const mergeIncoming = useCallback((incoming: ChatMessage) => {
    const incomingPaths = extractImagePaths([incoming]);
    if (incomingPaths.length > 0) {
      getSignedUrlsBatch(incomingPaths, "chat-images").catch(() => {});
    }
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
      setPartnerId(partnerId);
      partnerIdRef.current = partnerId;
      const key = buildCoupleKey(user.id, partnerId);
      setCoupleKey(key);
      coupleKeyRef.current = key;

      setLoadState("loading");
      // Fetch initial messages
      const msgs = await fetchMessages(key, PAGE_SIZE);
      setMessages(msgs);
      setHasMore(msgs.length === PAGE_SIZE);
      setLoadState("ready");

      // Pre-warm signed URLs
      const imagePaths = extractImagePaths(msgs);
      if (imagePaths.length > 0) {
        getSignedUrlsBatch(imagePaths, "chat-images").catch(() => {});
      }

      // Subscribe to realtime messages
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = subscribeToNewMessages(key, mergeIncoming);

      // Subscribe to presence
      if (unsubscribePresenceRef.current) unsubscribePresenceRef.current();
      unsubscribePresenceRef.current = subscribeToPartnerPresence(
        key,
        user.id,
        partnerId,
        (isOnline, lastSeen) => {
          // No longer storing locally; UI can read from presence channel if needed
        },
      );
    } catch (err) {
      console.error("[useChat] load error:", err);
      setLoadState("error");
    }
  }, [user, hasPartner, mergeIncoming]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      load();
    });
    return () => {
      task.cancel();
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

  // ─── Mark read + clear OS badge on focus; poll as realtime backup ─────
  useFocusEffect(
    useCallback(() => {
      const key = coupleKey ?? coupleKeyRef.current;
      const uid = user?.id;
      const now = Date.now();
      if (key && uid && now - lastMarkReadRef.current > 60_000) {
        lastMarkReadRef.current = now;
        markMessagesRead(key, uid).catch(() => {});
        clearAppBadge().catch(() => {});
      }

      if (!key) return undefined;

      const pollLatest = () => {
        fetchMessages(key, 20)
          .then((latest) => {
            latest.forEach((msg) => mergeIncoming(msg));
          })
          .catch(() => {});
      };

      pollLatest();
      const interval = setInterval(pollLatest, 2500);
      return () => clearInterval(interval);
    }, [user?.id, coupleKey, mergeIncoming]),
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
      const messageId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );

      const optimisticMsg: ChatMessage = {
        id: tempId(),
        couple_key: key,
        sender_id: user.id,
        content: `[image]${uri}`,
        created_at: new Date().toISOString(),
        read_at: null,
        status: "sending",
      };

      setIsSending(true);
      setMessages((prev) => [optimisticMsg, ...prev]);

      try {
        // Compress & upload image to private 'chat-images' bucket
        const { storagePath, localUri } = await uploadChatImage(
          uri,
          key,
          messageId,
        );

        // Store path in the message row: [image]{couple_key}/{message_id}.jpg
        const content = `[image]${storagePath}`;
        setCachedSignedUrl(storagePath, localUri, "chat-images");

        const myName =
          (user.user_metadata?.full_name as string | undefined) ?? undefined;
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

      const olderImagePaths = extractImagePaths(older);
      if (olderImagePaths.length > 0) {
        getSignedUrlsBatch(olderImagePaths, "chat-images").catch(() => {});
      }
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
    partnerProfile,
    isPartnerOnline: false,
    draftText,
    isSending,
    isLoadingMore,
    hasMore,
    coupleKey,
    chatTheme,
    isThemeModalOpen,
    fullScreenImageUri,
    setFullScreenImageUri,
    setIsThemeModalOpen,
    updateChatTheme,
    setDraftText,
    handleSend,
    handleSendImage,
    handleRetry: load,
    handleLoadMore,
    handleRetryMessage,
    unreadChatCount,
  };
}
