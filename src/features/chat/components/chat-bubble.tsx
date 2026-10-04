import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";
import { ChatBubbleProps } from "../types";

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

  const imageUrl = isImage ? message.content.replace(/^\[image\]/, "") : "";

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
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.bubbleImage}
                    resizeMode="cover"
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
                </View>
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
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.bubbleImage}
                resizeMode="cover"
              />
              <View style={styles.imageTimeBadgePartner}>
                <Text style={styles.timePartnerText} numberOfLines={1}>
                  {timeString}
                </Text>
              </View>
            </View>
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
