import { useState, useCallback, useEffect } from "react";
import { Share, Linking, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/auth";
import { UseSecretCrushReturn, SentMessageItem } from "./types";

const APP_SCHEME = "duovibe://";
const MAX_CHARS = 500;

function buildRevealLink(messageId: string): string {
  return `${APP_SCHEME}secret-crush/${messageId}`;
}

export function useSecretCrush(): UseSecretCrushReturn {
  const router = useRouter();
  const { user } = useAuth();

  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdMessageId, setCreatedMessageId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "sent">("compose");
  const [sentMessages, setSentMessages] = useState<SentMessageItem[]>([]);
  const [isLoadingSent, setIsLoadingSent] = useState<boolean>(false);

  // ─── Fetch sent messages ──────────────────────────────────────────────
  const fetchSentMessages = useCallback(async () => {
    if (!user) return;
    setIsLoadingSent(true);
    try {
      const { data, error } = await supabase
        .from("secret_crush_messages")
        .select("id, message, status, reply_message, created_at, opened_at, replied_at")
        .eq("sender_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSentMessages((data ?? []) as SentMessageItem[]);
    } catch (err) {
      console.warn("[useSecretCrush] fetchSentMessages error:", err);
    } finally {
      setIsLoadingSent(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "sent") {
      fetchSentMessages();
    }
  }, [activeTab, fetchSentMessages]);

  // ─── Create message ───────────────────────────────────────────────────
  const handleCreate = useCallback(async (): Promise<void> => {
    if (!user || message.trim().length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("secret_crush_messages")
        .insert({
          sender_id: user.id,
          message: message.trim(),
        })
        .select("id")
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error("No message id returned");

      const link = buildRevealLink(data.id);
      setCreatedMessageId(data.id);
      setShareLink(link);
    } catch (err) {
      console.error("[useSecretCrush] handleCreate error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [user, message, isSubmitting]);

  // ─── Share actions ────────────────────────────────────────────────────
  const handleCopyLink = useCallback(async (): Promise<void> => {
    if (!shareLink) return;
    await Clipboard.setStringAsync(shareLink);
  }, [shareLink]);

  const handleShareNative = useCallback(async (): Promise<void> => {
    if (!shareLink) return;
    try {
      await Share.share({
        message: `💌 Someone has a secret message for you...\n\nOpen to find out who: ${shareLink}`,
        title: "Secret Crush Message",
      });
    } catch (err) {
      console.warn("[useSecretCrush] share error:", err);
    }
  }, [shareLink]);

  const handleWhatsApp = useCallback(async (): Promise<void> => {
    if (!shareLink) return;
    const text = encodeURIComponent(
      `💌 Someone has a secret message for you...\n\nOpen to find out: ${shareLink}`,
    );
    const url = `whatsapp://send?text=${text}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback: native share
        await handleShareNative();
      }
    } catch {
      await handleShareNative();
    }
  }, [shareLink, handleShareNative]);

  // ─── Reset to compose fresh ───────────────────────────────────────────
  const handleReset = useCallback((): void => {
    setMessage("");
    setCreatedMessageId(null);
    setShareLink(null);
  }, []);

  return {
    message,
    isSubmitting,
    createdMessageId,
    shareLink,
    activeTab,
    setMessage: (text: string) => {
      if (text.length <= MAX_CHARS) setMessage(text);
    },
    handleCreate,
    handleCopyLink,
    handleShareNative,
    handleWhatsApp,
    handleReset,
    setActiveTab,
    sentMessages,
    isLoadingSent,
  };
}
