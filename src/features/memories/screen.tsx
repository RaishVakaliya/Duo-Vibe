import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  InteractionManager,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/src/context/auth-context";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { BottomTabBar, TabItem } from "@/src/components/navigation/bottom-tab-bar";
import { Memory } from "@/src/types";
import { styles } from "./styles";
import { useMemoriesData } from "./use-memories-data";
import { MemoryCard } from "./components/memory-card";
import { ResultCard } from "./components/result-card";
import { AnniversaryChip } from "./components/anniversary-chip";
import { AddMemoryBottomSheet } from "./components/add-memory-bottom-sheet";
import { MemoryDetailModal } from "./components/memory-detail-modal";

type TimelineItem =
  | { type: "header"; monthKey: string; id: string }
  | { type: "memory"; memory: Memory; index: number; id: string };

export default function MemoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // ─── Onboarding Animation State (if unauthenticated) ─────────────────────
  const [readyForAnimation, setReadyForAnimation] = useState<boolean>(false);
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setReadyForAnimation(true);
    });
    return () => task.cancel();
  }, []);

  // ─── Memories Data & Actions ─────────────────────────────────────────────
  const {
    loadState,
    errorMessage,
    hasPartner,
    coupleKey,
    memories,
    groupedMemories,
    isRefreshing,
    isLoadingMore,
    daysTogether,
    anniversaryDate,
    selectedMemory,
    isAddModalOpen,
    isAnniversaryPickerOpen,
    handleRefresh,
    handleLoadMore,
    handleOpenAddModal,
    handleCloseAddModal,
    handleSelectMemory,
    handleCloseDetailModal,
    handleToggleReaction,
    handleDeleteMemory,
    handleSaveAnniversaryDate,
    handleOpenAnniversaryPicker,
    handleCloseAnniversaryPicker,
    handleMemoryCreated,
    retry,
  } = useMemoriesData();

  // Bottom tab bar navigation handler
  const handleTabPress = useCallback(
    (_index: number, item: TabItem) => {
      switch (item.id) {
        case "home":
          router.replace(ROUTES.HOME);
          break;
        case "connect":
          router.replace(ROUTES.CONNECT);
          break;
        case "chat":
          router.replace(ROUTES.CHAT);
          break;
        case "profile":
          router.replace(ROUTES.PROFILE);
          break;
        case "memories":
          break;
      }
    },
    [router],
  );

  // Flatten grouped memories into flat timeline items with month headers
  const timelineItems = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];
    let globalIndex = 0;

    for (const group of groupedMemories) {
      items.push({
        type: "header",
        monthKey: group.monthKey,
        id: `header_${group.monthKey}`,
      });

      for (const memory of group.data) {
        items.push({
          type: "memory",
          memory,
          index: globalIndex,
          id: memory.id,
        });
        globalIndex += 1;
      }
    }

    return items;
  }, [groupedMemories]);

  // Handle anniversary date picker change
  const onAnniversaryPickerChange = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (Platform.OS === "android") {
      handleCloseAnniversaryPicker();
    }
    if (event.type === "set" && date) {
      const isoDate = date.toISOString().split("T")[0];
      if (isoDate) {
        handleSaveAnniversaryDate(isoDate);
      }
    }
  };

  // Safe bottom position for floating add button clear of tab bar
  const floatingButtonBottom =
    Math.max(insets.bottom, Platform.OS === "android" ? 16 : 0) + 84;

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 1: Unauthenticated user (Onboarding preview)
  // ─────────────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[...GRADIENTS.background]}
          locations={[...GRADIENTS.backgroundLocations]}
          style={styles.gradientBackground}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.onboardingHeaderRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.onboardingContent}>
            <Text style={styles.onboardingTitle}>
              Turn moments into Memories
            </Text>
            <Text style={styles.onboardingSubtitle}>
              Build a scrapbook of your love story
            </Text>

            <View style={styles.polaroidContainer}>
              <MotiView
                from={{ translateY: -3, rotate: "-9deg" }}
                animate={
                  readyForAnimation
                    ? { translateY: 5, rotate: "-7deg" }
                    : { translateY: -3, rotate: "-9deg" }
                }
                transition={{
                  type: "timing",
                  duration: 2600,
                  loop: readyForAnimation,
                  repeatReverse: true,
                }}
                style={[styles.previewCard, styles.previewLeft]}
              >
                <Image
                  source={require("@/assets/images/memory_beach.jpg")}
                  style={styles.previewImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </MotiView>

              <MotiView
                from={{ translateY: 4, rotate: "7deg" }}
                animate={
                  readyForAnimation
                    ? { translateY: -4, rotate: "5deg" }
                    : { translateY: 4, rotate: "7deg" }
                }
                transition={{
                  type: "timing",
                  duration: 3000,
                  loop: readyForAnimation,
                  repeatReverse: true,
                }}
                style={[styles.previewCard, styles.previewRight]}
              >
                <Image
                  source={require("@/assets/images/memory_stargazing.jpg")}
                  style={styles.previewImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </MotiView>

              <MotiView
                from={{ translateY: -5, rotate: "-1deg" }}
                animate={
                  readyForAnimation
                    ? { translateY: 5, rotate: "1deg" }
                    : { translateY: -5, rotate: "-1deg" }
                }
                transition={{
                  type: "timing",
                  duration: 2400,
                  loop: readyForAnimation,
                  repeatReverse: true,
                }}
                style={[styles.previewCard, styles.previewCenter]}
              >
                <Image
                  source={require("@/assets/images/memory_cafe.jpg")}
                  style={styles.previewImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </MotiView>
            </View>
          </View>

          <View style={styles.onboardingFooter}>
            <Pressable
              style={styles.continueButton}
              onPress={() => router.push(ROUTES.AUTH)}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <LinearGradient
                colors={[...GRADIENTS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 2: Authenticated user without linked partner (Blocking State)
  // ─────────────────────────────────────────────────────────────────────────
  if (!hasPartner || loadState === "no_partner") {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[...GRADIENTS.background]}
          locations={[...GRADIENTS.backgroundLocations]}
          style={styles.gradientBackground}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.blockingContainer}>
            <View style={styles.blockingIconCircle}>
              <Ionicons name="heart-half-outline" size={44} color="#FFE2E6" />
            </View>
            <Text style={styles.blockingTitle}>Connect with Partner</Text>
            <Text style={styles.blockingSubtitle}>
              Link your partner to start your shared scrapbook
            </Text>
            <Pressable
              style={styles.inviteButton}
              onPress={() =>
                router.push({
                  pathname: ROUTES.INVITE_PARTNER,
                  params: { source: "memories" },
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Link partner"
            >
              <LinearGradient
                colors={GRADIENTS.buttonCoralAmber}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.inviteButtonGradient}
              >
                <Ionicons name="link-outline" size={18} color="#FFFFFF" />
                <Text style={styles.inviteButtonText}>Link Your Partner</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </SafeAreaView>

        <BottomTabBar activeTab={3} onTabPress={handleTabPress} />
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 3: Authenticated user with partner (Full Memories Feature)
  // ─────────────────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: TimelineItem }) => {
    if (item.type === "header") {
      return (
        <View style={styles.monthHeader}>
          <Text style={styles.monthHeaderText}>{item.monthKey}</Text>
        </View>
      );
    }

    if (item.memory.kind === "result") {
      return (
        <ResultCard
          memory={item.memory}
          index={item.index}
          onPress={handleSelectMemory}
          onToggleReaction={handleToggleReaction}
        />
      );
    }

    return (
      <MemoryCard
        memory={item.memory}
        index={item.index}
        onPress={handleSelectMemory}
        onToggleReaction={handleToggleReaction}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Memories</Text>
            <Text style={styles.headerSubtitle}>
              Our story in snapshots
            </Text>
          </View>

          <View style={styles.headerRight}>
            <AnniversaryChip
              daysTogether={daysTogether}
              onPress={handleOpenAnniversaryPicker}
            />

            {daysTogether === null && (
              <Pressable
                style={styles.anniversaryChip}
                onPress={handleOpenAnniversaryPicker}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Set anniversary date"
              >
                <Ionicons name="calendar-outline" size={14} color="#FFE2E6" />
                <Text style={styles.anniversaryChipText}>Set Anniversary</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Timeline Content */}
        {loadState === "loading" && memories.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#FFE2E6" />
          </View>
        ) : loadState === "error" && memories.length === 0 ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={48} color="#FF4D6D" />
            <Text style={styles.errorText}>
              {errorMessage || "Unable to load memories."}
            </Text>
            <Pressable style={styles.retryButton} onPress={retry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        ) : memories.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyHeartCircle}>
              <Ionicons name="heart-outline" size={40} color="#FFE2E6" />
            </View>
            <Text style={styles.emptyTitle}>A moment worth keeping?</Text>
            <Text style={styles.emptySubtitle}>
              Capture your first shared memory together
            </Text>
          </View>
        ) : (
          <FlatList
            data={timelineItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.loadMoreContainer}>
                  <ActivityIndicator size="small" color="#FFE2E6" />
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>

      {/* Floating Coral-to-Amber "+" Button */}
      <Pressable
        style={[styles.floatingAddButton, { bottom: floatingButtonBottom }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleOpenAddModal();
        }}
        accessibilityRole="button"
        accessibilityLabel="Add new memory"
      >
        <LinearGradient
          colors={GRADIENTS.buttonCoralAmber}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatingAddGradient}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={3} onTabPress={handleTabPress} />

      {/* Add Memory Bottom Sheet */}
      <AddMemoryBottomSheet
        isOpen={isAddModalOpen}
        coupleKey={coupleKey}
        userId={user?.id ?? null}
        onClose={handleCloseAddModal}
        onMemoryCreated={handleMemoryCreated}
      />

      {/* Memory Detail Modal */}
      <MemoryDetailModal
        memory={selectedMemory}
        currentUserId={user?.id ?? null}
        onClose={handleCloseDetailModal}
        onToggleReaction={handleToggleReaction}
        onDelete={handleDeleteMemory}
      />

      {/* Anniversary Date Picker Modal */}
      {isAnniversaryPickerOpen && (
        <DateTimePicker
          value={
            anniversaryDate
              ? new Date(anniversaryDate + "T00:00:00")
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={onAnniversaryPickerChange}
        />
      )}
    </View>
  );
}
