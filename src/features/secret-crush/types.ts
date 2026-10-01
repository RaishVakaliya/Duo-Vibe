// ─── Secret Crush Create/Send Screen — Types ─────────────────────────────────

export interface SecretCrushViewState {
  message: string;
  isSubmitting: boolean;
  createdMessageId: string | null;
  shareLink: string | null;
  activeTab: "compose" | "sent";
}

export interface UseSecretCrushReturn extends SecretCrushViewState {
  setMessage: (text: string) => void;
  handleCreate: () => Promise<void>;
  handleCopyLink: () => Promise<void>;
  handleShareNative: () => Promise<void>;
  handleWhatsApp: () => Promise<void>;
  handleReset: () => void;
  setActiveTab: (tab: "compose" | "sent") => void;
  sentMessages: SentMessageItem[];
  isLoadingSent: boolean;
}

export interface SentMessageItem {
  id: string;
  message: string;
  status: "sent" | "opened" | "replied";
  reply_message: string | null;
  created_at: string;
  opened_at: string | null;
  replied_at: string | null;
}
