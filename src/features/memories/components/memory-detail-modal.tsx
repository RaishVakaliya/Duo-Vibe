import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { MemoryDetailModalProps } from "../types";
import { componentStyles } from "./component-styles";

export function MemoryDetailModal({
  memory,
  currentUserId,
  onClose,
  onToggleReaction,
  onDelete,
}: MemoryDetailModalProps) {
  const { showAlert } = useAlert();

  if (!memory) return null;

  const isCreator = memory.created_by === currentUserId;

  const formattedDate = new Date(
    memory.memory_date + "T00:00:00",
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleDeletePress = () => {
    showAlert({
      title: "Delete Memory",
      message:
        "Are you sure you want to permanently delete this memory? This cannot be undone.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onDelete(memory);
          },
        },
      ],
    });
  };

  const handleHeartPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleReaction(memory);
  };

  const payload = memory.payload || {};
  const score =
    payload.score !== undefined
      ? `${payload.score}%`
      : payload.overall !== undefined
      ? `${payload.overall}%`
      : payload.headline
      ? String(payload.headline)
      : null;

  return (
    <Modal
      visible={Boolean(memory)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={componentStyles.detailBackdrop}>
        <SafeAreaView style={componentStyles.detailSafeArea}>
          {/* Top Bar */}
          <View style={componentStyles.detailTopBar}>
            <Pressable
              style={componentStyles.detailCloseButton}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Close detail view"
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>

            {isCreator && (
              <Pressable
                style={componentStyles.detailDeleteButton}
                onPress={handleDeletePress}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Delete memory"
              >
                <Ionicons name="trash-outline" size={18} color="#FF4D6D" />
              </Pressable>
            )}
          </View>

          <ScrollView
            style={componentStyles.detailScroll}
            contentContainerStyle={componentStyles.detailScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Main Visual */}
            {memory.kind === "photo" && memory.image_url ? (
              <View style={componentStyles.detailImageWrapper}>
                <Image
                  source={{ uri: memory.image_url }}
                  style={componentStyles.detailImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={150}
                  placeholder="rgba(255, 255, 255, 0.08)"
                />
              </View>
            ) : memory.kind === "result" ? (
              <View style={[componentStyles.detailImageWrapper, { height: 180 }]}>
                <LinearGradient
                  colors={["#E11D48", "#BE123C", "#881337"]}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                  }}
                >
                  <Ionicons name="sparkles" size={32} color="#FFFFFF" />
                  {score && (
                    <Text
                      style={{
                        fontFamily: "Fredoka_700Bold",
                        fontSize: 38,
                        color: "#FFFFFF",
                        marginTop: 8,
                      }}
                    >
                      {score}
                    </Text>
                  )}
                </LinearGradient>
              </View>
            ) : null}

            {/* Content Details */}
            <View style={componentStyles.detailCard}>
              <View style={componentStyles.detailTitleRow}>
                <Text style={componentStyles.detailTitle}>{memory.title}</Text>
              </View>

              <Text style={componentStyles.detailDate}>{formattedDate}</Text>

              {memory.note ? (
                <Text style={componentStyles.detailNote}>{memory.note}</Text>
              ) : null}

              <View style={componentStyles.detailMetaRow}>
                <View style={componentStyles.detailCreatorRow}>
                  {memory.creator?.avatarUrl ? (
                    <Image
                      source={{ uri: memory.creator.avatarUrl }}
                      style={componentStyles.detailCreatorAvatar}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                      transition={150}
                      placeholder="rgba(255, 255, 255, 0.1)"
                    />
                  ) : (
                    <View
                      style={[
                        componentStyles.detailCreatorAvatar,
                        {
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#FFE4E6",
                        },
                      ]}
                    >
                      <Ionicons name="person" size={16} color="#FF2D55" />
                    </View>
                  )}
                  <View>
                    <Text style={componentStyles.detailCreatorName}>
                      {memory.creator?.fullName || "Your partner"}
                    </Text>
                    <Text style={componentStyles.detailCreatorSubtext}>
                      Added this memory
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={[
                    componentStyles.detailHeartToggle,
                    memory.has_reacted &&
                      componentStyles.detailHeartToggleActive,
                  ]}
                  onPress={handleHeartPress}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle heart reaction"
                >
                  <Ionicons
                    name={memory.has_reacted ? "heart" : "heart-outline"}
                    size={20}
                    color={memory.has_reacted ? "#FF2D55" : "#FFFFFF"}
                  />
                  {memory.reactions_count > 0 && (
                    <Text style={componentStyles.detailHeartCount}>
                      {memory.reactions_count}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
