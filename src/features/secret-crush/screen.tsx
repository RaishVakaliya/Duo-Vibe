import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useSecretCrush } from "./use-secret-crush";
import { EnvelopeIllustration } from "./components/envelope-illustration";
import { SentMessageItem } from "./types";

const MAX_CHARS = 500;

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function SentCard({ item }: { item: SentMessageItem }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
      style={styles.sentCard}
    >
      <View style={styles.sentCardHeader}>
        <Text style={styles.sentCardDate}>{formatRelativeTime(item.created_at)}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === "sent" && styles.statusBadgeSent,
            item.status === "opened" && styles.statusBadgeOpened,
            item.status === "replied" && styles.statusBadgeReplied,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              item.status === "sent" && styles.statusTextSent,
              item.status === "opened" && styles.statusTextOpened,
              item.status === "replied" && styles.statusTextReplied,
            ]}
          >
            {item.status === "sent" ? "Sent" : item.status === "opened" ? "Opened" : "Replied"}
          </Text>
        </View>
      </View>

      <Text style={styles.sentCardMessage} numberOfLines={3}>
        {item.message}
      </Text>

      {item.reply_message && (
        <View style={styles.sentCardReply}>
          <Text style={styles.sentCardReplyLabel}>Their Reply</Text>
          <Text style={styles.sentCardReplyText}>{item.reply_message}</Text>
        </View>
      )}

      <Pressable
        style={styles.sentCardCopyRow}
        accessibilityRole="button"
        accessibilityLabel="Copy link for this message"
      >
        <Ionicons name="link-outline" size={13} color="#FF4D6D" />
        <Text style={styles.sentCardCopyText}>Copy Link</Text>
      </Pressable>
    </MotiView>
  );
}

export default function SecretCrushScreen() {
  const router = useRouter();
  const {
    message,
    setMessage,
    isSubmitting,
    shareLink,
    activeTab,
    setActiveTab,
    handleCreate,
    handleCopyLink,
    handleShareNative,
    handleWhatsApp,
    handleReset,
    sentMessages,
    isLoadingSent,
  } = useSecretCrush();

  const isFormValid = message.trim().length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* ─── Header ──────────────────────────────────────────────── */}
        <View style={styles.headerContainer}>
          <View style={styles.topNavRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace(ROUTES.HOME)}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>

            <View style={styles.headerTitleRow}>
              <Ionicons name="mail" size={20} color="#FF4D6D" />
              <Text style={styles.headerTitle}>Secret Crush</Text>
            </View>

            <View style={styles.headerSpacer} />
          </View>

          {/* ─── Tab Bar ────────────────────────────────────────────── */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === "compose" && styles.tabActive]}
              onPress={() => setActiveTab("compose")}
              accessibilityRole="tab"
              accessibilityLabel="Compose new message"
            >
              <Text style={[styles.tabText, activeTab === "compose" && styles.tabTextActive]}>
                💌 New Message
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === "sent" && styles.tabActive]}
              onPress={() => setActiveTab("sent")}
              accessibilityRole="tab"
              accessibilityLabel="View sent messages"
            >
              <Text style={[styles.tabText, activeTab === "sent" && styles.tabTextActive]}>
                📬 Sent
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ─── Content ─────────────────────────────────────────────── */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ══ COMPOSE TAB ══════════════════════════════════════ */}
            {activeTab === "compose" && (
              <>
                {/* Envelope illustration */}
                <MotiView
                  from={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 14 }}
                  style={styles.illustrationContainer}
                >
                  <EnvelopeIllustration size={160} />
                </MotiView>

                {/* Message textarea OR share card */}
                {!shareLink ? (
                  <MotiView
                    from={{ opacity: 0, translateY: 12 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", duration: 380, delay: 80 }}
                    style={{ width: "100%" }}
                  >
                    <View style={styles.composeCard}>
                      <Text style={styles.composeLabel}>Your Secret Message</Text>
                      <TextInput
                        style={styles.textArea}
                        placeholder="Write something sweet, honest, or a little mysterious... 🌹"
                        placeholderTextColor="#4A3048"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={MAX_CHARS}
                        accessibilityLabel="Secret message input"
                        textAlignVertical="top"
                      />
                      <Text style={styles.charCount}>
                        {message.length}/{MAX_CHARS}
                      </Text>
                    </View>

                    <Pressable
                      style={[
                        styles.createButton,
                        (!isFormValid || isSubmitting) && styles.createButtonDisabled,
                      ]}
                      onPress={handleCreate}
                      disabled={!isFormValid || isSubmitting}
                      accessibilityRole="button"
                      accessibilityLabel="Create secret crush link"
                    >
                      <LinearGradient
                        colors={["#FF2D6C", "#FF4D6D", "#FF758C"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.createGradient}
                      >
                        {isSubmitting ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <>
                            <Ionicons name="link" size={18} color="#FFFFFF" />
                            <Text style={styles.createButtonText}>Create Link 💌</Text>
                          </>
                        )}
                      </LinearGradient>
                    </Pressable>
                  </MotiView>
                ) : (
                  /* ── Share Card after creation ── */
                  <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 14 }}
                    style={{ width: "100%" }}
                  >
                    <View style={styles.linkCard}>
                      <Ionicons name="checkmark-circle" size={40} color="#10B981" />
                      <Text style={styles.linkCardTitle}>Your Secret Link is Ready! 💖</Text>
                      <Text style={styles.linkCardSubtitle}>
                        Share this link with your crush. They{"'"}ll see your message when they open it.
                      </Text>

                      <Text style={styles.linkText} numberOfLines={1}>
                        {shareLink}
                      </Text>

                      <View style={styles.shareRow}>
                        <Pressable
                          style={styles.shareButton}
                          onPress={handleCopyLink}
                          accessibilityRole="button"
                          accessibilityLabel="Copy link"
                        >
                          <Ionicons name="copy-outline" size={16} color="#FFFFFF" />
                          <Text style={styles.shareButtonText}>Copy</Text>
                        </Pressable>

                        <Pressable
                          style={styles.shareButton}
                          onPress={handleWhatsApp}
                          accessibilityRole="button"
                          accessibilityLabel="Share on WhatsApp"
                        >
                          <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                          <Text style={styles.shareButtonText}>WhatsApp</Text>
                        </Pressable>

                        <Pressable
                          style={styles.shareButton}
                          onPress={handleShareNative}
                          accessibilityRole="button"
                          accessibilityLabel="Share via other apps"
                        >
                          <Ionicons name="share-outline" size={16} color="#FFFFFF" />
                          <Text style={styles.shareButtonText}>More</Text>
                        </Pressable>
                      </View>
                    </View>

                    <Pressable
                      style={styles.resetButton}
                      onPress={handleReset}
                      accessibilityRole="button"
                      accessibilityLabel="Create another message"
                    >
                      <Text style={styles.resetButtonText}>+ Create another message</Text>
                    </Pressable>
                  </MotiView>
                )}
              </>
            )}

            {/* ══ SENT TAB ══════════════════════════════════════════ */}
            {activeTab === "sent" && (
              <>
                {isLoadingSent ? (
                  <ActivityIndicator
                    color="#FF4D6D"
                    size="large"
                    style={{ marginTop: 48 }}
                  />
                ) : sentMessages.length === 0 ? (
                  <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", duration: 350 }}
                    style={styles.sentEmptyContainer}
                  >
                    <Ionicons name="mail-open-outline" size={52} color="#4A3048" />
                    <Text style={styles.sentEmptyText}>No messages yet</Text>
                    <Text style={styles.sentEmptySubtext}>
                      Create your first secret message and share the link with someone special. 💌
                    </Text>
                  </MotiView>
                ) : (
                  <View style={styles.sentList}>
                    {sentMessages.map((item) => (
                      <SentCard key={item.id} item={item} />
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
