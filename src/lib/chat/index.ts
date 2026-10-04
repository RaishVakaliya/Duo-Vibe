// Barrel export for clean imports: import { sendMessage, fetchMessages, ... } from "@/src/lib/chat"
export { fetchMessages } from "./fetch-messages";
export { sendMessage } from "./send-message";
export { markMessagesRead, getUnreadCount } from "./mark-messages-read";
export { subscribeToNewMessages, subscribeToUnreadBadge } from "./subscribe-to-messages";
export { subscribeToPartnerPresence } from "./presence";
// Re-export the couple_key builder from challenge lib to avoid duplication
export { buildCoupleKey } from "@/src/lib/challenge";
