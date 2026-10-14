import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";
import { ChatBubbleProps } from "../types";
import { useStorageImageUrl } from "@/src/hooks/use-storage-image-url";

function formatMessageTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
      .toLowerCase();
  } catch {
    return "";
  }
}

export function ChatBubble({
  message,
  isMine,
  bubbleColors,
  onRetry,
  onOpenImage,
}: ChatBubbleProps) {
  const isFailed = message.status === "failed";
  const isSending = message.status === "sending";
  const isRead = Boolean(message.read_at);
  const timeString = formatMessageTime(message.created_at);

  const isImage =
    message.content.startsWith("[image]") ||
    message.content.startsWith("data:image/") ||
    (message.content.startsWith("http") &&
      (message.content.endsWith(".jpg") ||
        message.content.endsWith(".jpeg") ||
        message.content.endsWith(".png") ||
        message.content.includes("supabase.co/storage")));

  const rawImagePath = isImage ? message.content.replace(/^\[image\]/, "") : "";
  const displayImageUrl = useStorageImageUrl(rawImagePath, "chat-images");

  if (isMine) {
    return (
      <View style={styles.bubbleRowMine}>
        <View style={styles.bubbleMineWrapper}>
          <View style={styles.bubbleMine}>
            <LinearGradient
              colors={[...bubbleColors]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bubbleMineGradient}
            >
              {isImage ? (
                <Pressable
                  style={styles.imageContainer}
                  onPress={() => onOpenImage?.(displayImageUrl || rawImagePath)}
                  accessibilityRole="imagebutton"
                  accessibilityLabel="View full screen photo"
                >
                  <Image
                    source={{ uri: displayImageUrl || undefined }}
                    style={styles.bubbleImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={150}
                    placeholder="rgba(255, 255, 255, 0.08)"
                  />
                  <View style={styles.imageTimeBadgeMine}>
                    <Text style={styles.timeMineText} numberOfLines={1}>
                      {timeString}
                    </Text>

                    {isSending && (
                      <Ionicons
                        name="time-outline"
                        size={11}
                        color="rgba(255,255,255,0.85)"
                      />
                    )}

                    {!isSending && !isFailed && (
                      <Ionicons
                        name="checkmark-done"
                        size={14}
                        color={isRead ? "#53BDEB" : "rgba(255,255,255,0.85)"}
                      />
                    )}
                  </View>
                </Pressable>
              ) : (
                <View style={styles.bubbleContentRow}>
                  <Text style={styles.bubbleMineText}>{message.content}</Text>

                  <View style={styles.metaRowMine}>
                    <Text style={styles.timeMineText} numberOfLines={1}>
                      {timeString}
                    </Text>

                    {isSending && (
                      <Ionicons
                        name="time-outline"
                        size={11}
                        color="rgba(255,255,255,0.75)"
                      />
                    )}

                    {!isSending && !isFailed && (
                      <Ionicons
                        name="checkmark-done"
                        size={14}
                        color={isRead ? "#53BDEB" : "rgba(255,255,255,0.75)"}
                        style={styles.tickIcon}
                      />
                    )}
                  </View>
                </View>
              )}
            </LinearGradient>
          </View>

          {isFailed && (
            <Pressable
              style={styles.failedRow}
              onPress={() => onRetry?.(message.id)}
              accessibilityRole="button"
              accessibilityLabel="Tap to retry sending this message"
            >
              <Ionicons name="alert-circle" size={12} color="#EF4444" />
              <Text style={styles.failedText}>Not sent · tap to retry</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // Partner's Bubble (WhatsApp Dark Gray)
  return (
    <View style={styles.bubbleRowPartner}>
      <View style={styles.bubblePartnerWrapper}>
        <View style={styles.bubblePartner}>
          {isImage ? (
            <Pressable
              style={styles.imageContainer}
              onPress={() => onOpenImage?.(displayImageUrl || rawImagePath)}
              accessibilityRole="imagebutton"
              accessibilityLabel="View full screen photo"
            >
              <Image
                source={{ uri: displayImageUrl || undefined }}
                style={styles.bubbleImage}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={150}
                placeholder="rgba(255, 255, 255, 0.08)"
              />
              <View style={styles.imageTimeBadgePartner}>
                <Text style={styles.timePartnerText} numberOfLines={1}>
                  {timeString}
                </Text>
              </View>
            </Pressable>
          ) : (
            <View style={styles.bubbleContentRow}>
              <Text style={styles.bubblePartnerText}>{message.content}</Text>

              <View style={styles.metaRowPartner}>
                <Text style={styles.timePartnerText} numberOfLines={1}>
                  {timeString}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
