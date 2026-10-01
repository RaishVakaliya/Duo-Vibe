// ─── Secret Crush Reveal Screen — Types ──────────────────────────────────────

export type RevealViewMode = "loading" | "not_found" | "sender" | "recipient" | "replied";

export interface UseSecretCrushRevealReturn {
  mode: RevealViewMode;
  message: string;
  status: "sent" | "opened" | "replied";
  replyMessage: string | null;
  replyDraft: string;
  isSubmittingReply: boolean;
  setReplyDraft: (text: string) => void;
  handleSendReply: () => Promise<void>;
  handleCopyLink: () => Promise<void>;
}
