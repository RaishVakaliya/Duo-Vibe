// ─── Chat Screen — Types ──────────────────────────────────────────────────────

import { ChatMessage } from "@/src/types";

export type ChatLoadState = "loading" | "error" | "no_partner" | "ready";

export interface ChatTheme {
  bgId: string;
  bubbleId: string;
}

export interface BgThemeOption {
  id: string;
  name: string;
  colors: readonly [string, string];
}

export interface BubbleThemeOption {
  id: string;
  name: string;
  colors: readonly [string, string];
}

export interface ChatBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  bubbleColors: readonly [string, string];
  showTail?: boolean;
  onRetry?: (messageId: string) => void;
  onOpenImage?: (imageUrl: string) => void;
}

export interface ThemeModalProps {
  isVisible: boolean;
  currentTheme: ChatTheme;
  onClose: () => void;
  onSelectTheme: (newTheme: ChatTheme) => void;
}

export interface ImageViewerModalProps {
  isVisible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

export interface UseChat {
  userId: string | undefined;
  loadState: ChatLoadState;
  messages: ChatMessage[];
  partnerName: string | null;
  partnerAvatarUrl: string | null;
  isPartnerOnline: boolean;
  partnerLastSeen: string | null;
  draftText: string;
  isSending: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  coupleKey: string | null;
  chatTheme: ChatTheme;
  isThemeModalOpen: boolean;
  fullScreenImageUri: string | null;
  setFullScreenImageUri: (uri: string | null) => void;
  setIsThemeModalOpen: (open: boolean) => void;
  updateChatTheme: (newTheme: ChatTheme) => void;
  setDraftText: (text: string) => void;
  handleSend: () => Promise<void>;
  handleSendImage: (uri: string) => Promise<void>;
  handleRetry: () => void;
  handleLoadMore: () => Promise<void>;
  handleRetryMessage: (messageId: string) => Promise<void>;
}
