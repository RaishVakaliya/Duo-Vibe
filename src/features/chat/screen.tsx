import React, { useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Image,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./styles";
import { ROUTES } from "@/src/constants/routes";
import { useChat } from "./use-chat";
import { ChatBubble } from "./components/chat-bubble";
import { ThemeModal } from "./components/theme-modal";
import { ImageViewerModal } from "./components/image-viewer-modal";
import { getBgColors, getBubbleColors } from "./chat-themes";
import { ChatMessage } from "@/src/types";
import { useAlert } from "@/src/components/ui/alert-dialog";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isSameDay(iso1: string, iso2: string): boolean {
  try {
    const d1 = new Date(iso1);
    const d2 = new Date(iso2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch {
    return true;
  }
}

function formatDateChip(isoString: string): string {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    if (isToday) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
    if (isYesterday) return "Yesterday";

    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return d.toLocaleDateString("en-US", { weekday: "long" });
    }

    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const {
    userId,
    loadState,
    messages,
    partnerName,
    partnerAvatarUrl,
    isPartnerOnline,
    draftText,
    isSending,
    isLoadingMore,
    hasMore,
    chatTheme,
    isThemeModalOpen,
    fullScreenImageUri,
    setFullScreenImageUri,
    setIsThemeModalOpen,
    updateChatTheme,
    setDraftText,
    handleSend,
    handleSendImage,
    handleRetry,
    handleLoadMore,
    handleRetryMessage,
  } = useChat();

  const inputRef = useRef<TextInput>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState<boolean>(false);
  const restingBottomInsetRef = useRef<number>(insets.bottom);

  React.useEffect(() => {
    if (insets.bottom > 0) {
      restingBottomInsetRef.current = insets.bottom;
    }
  }, [insets.bottom]);

  React.useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setIsKeyboardOpen(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setIsKeyboardOpen(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Active theme gradient colors
  const activeBgColors = useMemo(() => {
    return getBgColors(chatTheme.bgId);
  }, [chatTheme.bgId]);

  const activeBubbleColors = useMemo(() => {
    return getBubbleColors(chatTheme.bubbleId);
  }, [chatTheme.bubbleId]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.HOME);
    }
  }, [router]);

  // Launch gallery and send picked image directly
  const handleAttachImage = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        showAlert({
          title: "Permission Required",
          message: "Please allow photo library access to send images.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset) {
          const imageUri = asset.base64
            ? `data:image/jpeg;base64,${asset.base64}`
            : asset.uri;
          if (imageUri) {
            await handleSendImage(imageUri);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to attach image:", err);
    }
  }, [handleSendImage, showAlert]);

  // Inverted FlatList: message index + 1 is older than index
  const renderBubbleItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const nextOlder = messages[index + 1];
      const showDateChip =
        !nextOlder || !isSameDay(item.created_at, nextOlder.created_at);

      return (
        <View>
          {showDateChip && (
            <View style={styles.dateSeparatorWrap}>
              <View style={styles.dateSeparator}>
                <Text style={styles.dateSeparatorText}>
                  {formatDateChip(item.created_at)}
                </Text>
              </View>
            </View>
          )}

          <ChatBubble
            message={item}
            isMine={
              item.sender_id === userId ||
              item.status === "sending" ||
              item.status === "failed"
            }
            bubbleColors={activeBubbleColors}
            onOpenImage={(url) => setFullScreenImageUri(url)}
            onRetry={handleRetryMessage}
          />
        </View>
      );
    },
    [messages, userId, activeBubbleColors, setFullScreenImageUri, handleRetryMessage],
  );

  const listFooter = hasMore ? (
    <Pressable
      style={styles.loadMoreButton}
      onPress={handleLoadMore}
      disabled={isLoadingMore}
      accessibilityRole="button"
      accessibilityLabel="Load older messages"
    >
      {isLoadingMore ? (
        <ActivityIndicator size="small" color="#8696A0" />
      ) : (
        <Text style={styles.loadMoreText}>Load older messages</Text>
      )}
    </Pressable>
  ) : null;

  const partnerInitial = (partnerName?.trim()?.charAt(0) || "P").toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Dynamic Wallpaper Background */}
      <LinearGradient
        colors={[...activeBgColors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* ── WhatsApp Header ────────────────────────────────────── */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#E9EDEF" />
            </Pressable>

            {/* Profile Avatar */}
            <View style={styles.avatarContainer}>
              {partnerAvatarUrl ? (
                <Image
                  source={{ uri: partnerAvatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarLetter}>{partnerInitial}</Text>
              )}
            </View>

            {/* Name + Live Online / Offline Status */}
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerName} numberOfLines={1}>
                {partnerName ?? "Partner"}
              </Text>
              <View style={styles.headerStatusRow}>
                {isPartnerOnline ? (
                  <Text style={styles.onlineText}>online</Text>
                ) : (
                  <Text style={styles.offlineText}>offline</Text>
                )}
              </View>
            </View>
          </View>

          {/* Header Action Icons */}
          <View style={styles.headerRight}>
            <Pressable
              style={styles.headerActionBtn}
              onPress={() => setIsThemeModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Change chat wallpaper and colors"
            >
              <Ionicons name="color-palette-outline" size={21} color="#E9EDEF" />
            </Pressable>
          </View>
        </View>

        {/* ── Content States ──────────────────────────────────────── */}
        {loadState === "loading" && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#00A884" />
          </View>
        )}

        {loadState === "error" && (
          <View style={styles.centeredContainer}>
            <Ionicons name="cloud-offline-outline" size={52} color="#8696A0" />
            <Text style={styles.centeredText}>
              Couldn{"'"}t connect to chat. Check your connection.
            </Text>
            <Pressable
              style={styles.actionButton}
              onPress={handleRetry}
              accessibilityRole="button"
              accessibilityLabel="Retry loading chat"
            >
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {loadState === "no_partner" && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 14 }}
            style={styles.blockingCard}
          >
            <View style={styles.blockingIconWrap}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={34}
                color="#00A884"
              />
            </View>
            <Text style={styles.blockingTitle}>Link Your Partner</Text>
            <Text style={styles.blockingText}>
              Connect with your partner first to chat privately on WhatsApp style Duo Spark.
            </Text>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push(ROUTES.INVITE_PARTNER)}
              accessibilityRole="button"
              accessibilityLabel="Invite or connect partner"
            >
              <Ionicons name="link-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Connect Partner</Text>
            </Pressable>
          </MotiView>
        )}

        {loadState === "ready" && (
          <KeyboardAvoidingView
            style={styles.keyboardAvoiding}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            {/* ── Message List ─── */}
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>👋</Text>
                <Text style={styles.emptyText}>
                  Say hi to {partnerName ?? "your partner"}!
                </Text>
                <Text style={styles.emptySubtext}>
                  Messages are end-to-end between the two of you.
                </Text>
              </View>
            ) : (
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderBubbleItem}
                inverted
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.15}
                ListFooterComponent={listFooter}
                initialNumToRender={25}
                maxToRenderPerBatch={15}
                windowSize={10}
                removeClippedSubviews={false}
              />
            )}

            {/* ── WhatsApp Style Floating Input Bar ────────────────── */}
            <View
              style={[
                styles.inputBarWrapper,
                {
                  paddingBottom: isKeyboardOpen
                    ? 6
                    : Math.max(
                        insets.bottom,
                        restingBottomInsetRef.current,
                        Platform.OS === "android" ? 16 : 8
                      ),
                },
              ]}
            >
              <View style={styles.inputRow}>
                {/* Rounded Pill Text Input */}
                <View style={styles.inputPill}>
                  <TextInput
                    ref={inputRef}
                    style={styles.inputField}
                    value={draftText}
                    onChangeText={setDraftText}
                    placeholder="Message"
                    placeholderTextColor="#8696A0"
                    multiline
                    textAlignVertical="center"
                    returnKeyType="default"
                    blurOnSubmit={false}
                    accessibilityLabel="Message input"
                  />

                  {/* Attach Image Button */}
                  <Pressable
                    style={styles.inputIconBtn}
                    onPress={handleAttachImage}
                    accessibilityRole="button"
                    accessibilityLabel="Attach image"
                  >
                    <Ionicons name="attach-outline" size={22} color="#8696A0" />
                  </Pressable>
                </View>

                {/* Circular Send Button (Always Send Icon) */}
                <Pressable
                  style={[
                    styles.sendButton,
                    (!draftText.trim() || isSending) && { opacity: 0.45 },
                  ]}
                  onPress={handleSend}
                  disabled={!draftText.trim() || isSending}
                  accessibilityRole="button"
                  accessibilityLabel="Send message"
                >
                  <LinearGradient
                    colors={[...activeBubbleColors]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendButtonGradient}
                  >
                    {isSending ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Ionicons name="send" size={18} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>

      {/* ── Theme Customization Modal ───────────────────────────────── */}
      <ThemeModal
        isVisible={isThemeModalOpen}
        currentTheme={chatTheme}
        onClose={() => setIsThemeModalOpen(false)}
        onSelectTheme={updateChatTheme}
      />

      {/* ── WhatsApp Style Full Screen Image Viewer Modal ──────────── */}
      <ImageViewerModal
        isVisible={Boolean(fullScreenImageUri)}
        imageUri={fullScreenImageUri}
        onClose={() => setFullScreenImageUri(null)}
      />
    </View>
  );
}
