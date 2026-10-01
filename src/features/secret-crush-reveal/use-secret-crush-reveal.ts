import { useState, useEffect, useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/auth";
import { UseSecretCrushRevealReturn, RevealViewMode } from "./types";

const APP_SCHEME = "duovibe://";
const MAX_REPLY_CHARS = 400;

export function useSecretCrushReveal(messageId: string): UseSecretCrushRevealReturn {
  const { user } = useAuth();

  const [mode, setMode] = useState<RevealViewMode>("loading");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"sent" | "opened" | "replied">("sent");
  const [replyMessage, setReplyMessage] = useState<string | null>(null);
  const [replyDraft, setReplyDraftState] = useState<string>("");
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  // ─── Load message on mount ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!messageId) {
        setMode("not_found");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("secret_crush_messages")
          .select("id, sender_id, message, status, reply_message, opened_at, replied_at")
          .eq("id", messageId)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          setMode("not_found");
          return;
        }

        setMessage(data.message);
        setStatus(data.status);
        setReplyMessage(data.reply_message ?? null);

        const isSender = user?.id === data.sender_id;

        if (isSender) {
          setMode("sender");
          return;
        }

        // ── Recipient path ──────────────────────────────────────────────
        if (data.status === "replied") {
          setMode("replied");
          return;
        }

        // Mark as opened if it was in 'sent' state
        if (data.status === "sent") {
          const { error: updateError } = await supabase
            .from("secret_crush_messages")
            .update({ status: "opened", opened_at: new Date().toISOString() })
            .eq("id", messageId);

          if (!cancelled && !updateError) {
            setStatus("opened");
          }
        }

        setMode("recipient");
      } catch (err) {
        if (!cancelled) {
          console.error("[useSecretCrushReveal] load error:", err);
          setMode("not_found");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [messageId, user?.id]);

  // ─── Send reply ───────────────────────────────────────────────────────
  const handleSendReply = useCallback(async (): Promise<void> => {
    if (replyDraft.trim().length === 0 || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const { error } = await supabase
        .from("secret_crush_messages")
        .update({
          status: "replied",
          reply_message: replyDraft.trim(),
          replied_at: new Date().toISOString(),
        })
        .eq("id", messageId);

      if (error) throw error;

      setStatus("replied");
      setReplyMessage(replyDraft.trim());
      setMode("replied");
    } catch (err) {
      console.error("[useSecretCrushReveal] handleSendReply error:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  }, [messageId, replyDraft, isSubmittingReply]);

  // ─── Copy link ────────────────────────────────────────────────────────
  const handleCopyLink = useCallback(async (): Promise<void> => {
    const link = `${APP_SCHEME}secret-crush/${messageId}`;
    await Clipboard.setStringAsync(link);
  }, [messageId]);

  return {
    mode,
    message,
    status,
    replyMessage,
    replyDraft,
    isSubmittingReply,
    setReplyDraft: (text: string) => {
      if (text.length <= MAX_REPLY_CHARS) setReplyDraftState(text);
    },
    handleSendReply,
    handleCopyLink,
  };
}
