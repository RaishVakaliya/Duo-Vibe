import React, { useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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
import { ScreenState } from "@/src/components/ui/screen-state";
import { LinkPartnerPrompt } from "@/src/components/ui/link-partner-prompt";

import { isSameDay, formatDateChip } from "@/src/utils/date";

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const {
    userId,
    loadState,
    messages,
    partnerProfile,
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

  const partnerName = partnerProfile?.full_name ?? null;
  const partnerAvatarUrl = partnerProfile?.avatar_url ?? null;

  const inputRef = useRef<TextInput>(null);

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
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset && asset.uri) {
          await handleSendImage(asset.uri);
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
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={150}
                  placeholder="rgba(255, 255, 255, 0.1)"
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
          <ScreenState variant="loading" />
        )}

        {loadState === "error" && (
          <ScreenState
            variant="error"
            message="Couldn't connect to chat. Check your connection."
            onRetry={handleRetry}
          />
        )}

        {loadState === "no_partner" && (
          <LinkPartnerPrompt
            title="Link Your Partner"
            description="Connect with your partner first to chat privately."
            icon="chatbubble-ellipses-outline"
          />
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
                { paddingBottom: Math.max(insets.bottom, 8) },
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
