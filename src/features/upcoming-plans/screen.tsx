import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { LinkPartnerPrompt } from "@/src/components/ui/link-partner-prompt";
import { ScreenState } from "@/src/components/ui/screen-state";
import { HeroPlanCard } from "./components/hero-plan-card";
import { PlanRowCard } from "./components/plan-row-card";
import { AddPlanBottomSheet } from "./components/add-plan-bottom-sheet";
import { useUpcomingPlans } from "./use-upcoming-plans";
import { styles } from "./styles";

export default function UpcomingPlansScreen() {
  const {
    loading,
    hasPartner,
    user,
    grouped,
    handleAddPlan,
    handleToggleDone,
    handleDeletePlan,
    handleSaveToMemories,
  } = useUpcomingPlans();

  const [addSheetVisible, setAddSheetVisible] = useState<boolean>(false);
  const [doneExpanded, setDoneExpanded] = useState<boolean>(false);

  const hasAnyPlans =
    Boolean(grouped.nextPlan) ||
    grouped.today.length > 0 ||
    grouped.thisWeek.length > 0 ||
    grouped.later.length > 0 ||
    grouped.done.length > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header */}
        <ScreenHeader
          title="Upcoming Plans"
          subtitle="Special moments on your calendar"
          backIcon="arrow-back"
          rightElement={
            hasPartner ? (
              <Pressable
                style={styles.addButton}
                onPress={() => setAddSheetVisible(true)}
                hitSlop={10}
              >
                <Ionicons name="add" size={24} color={COLORS.white} />
              </Pressable>
            ) : undefined
          }
        />

        {loading ? (
          <ScreenState variant="loading" />
        ) : !hasPartner ? (
          <LinkPartnerPrompt
            description="Connect with your partner to plan dates, trips, and romantic adventures together."
          />
        ) : !hasAnyPlans ? (
          <ScreenState
            variant="empty"
            icon="calendar-clear-outline"
            title="No plans scheduled yet"
            message="Plan your next movie night, romantic dinner, or weekend getaway!"
            actionLabel="Plan Something Special"
            onAction={() => setAddSheetVisible(true)}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Card for Next Plan */}
            {grouped.nextPlan && (
              <View>
                <HeroPlanCard
                  plan={grouped.nextPlan}
                  onMarkDone={(id) => handleToggleDone(id, false)}
                  onDelete={handleDeletePlan}
                  canDelete={grouped.nextPlan.created_by === user?.id}
                />
              </View>
            )}

            {/* Today Group */}
            {grouped.today.length > 0 && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Today</Text>
                  <Text style={styles.sectionCount}>
                    {grouped.today.length}
                  </Text>
                </View>
                {grouped.today.map((item) => (
                  <PlanRowCard
                    key={item.id}
                    plan={item}
                    currentUserId={user?.id}
                    onToggleDone={handleToggleDone}
                    onDelete={handleDeletePlan}
                    onSaveToMemories={handleSaveToMemories}
                  />
                ))}
              </View>
            )}

            {/* This Week Group */}
            {grouped.thisWeek.length > 0 && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>This Week</Text>
                  <Text style={styles.sectionCount}>
                    {grouped.thisWeek.length}
                  </Text>
                </View>
                {grouped.thisWeek.map((item) => (
                  <PlanRowCard
                    key={item.id}
                    plan={item}
                    currentUserId={user?.id}
                    onToggleDone={handleToggleDone}
                    onDelete={handleDeletePlan}
                    onSaveToMemories={handleSaveToMemories}
                  />
                ))}
              </View>
            )}

            {/* Later Group */}
            {grouped.later.length > 0 && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Later</Text>
                  <Text style={styles.sectionCount}>
                    {grouped.later.length}
                  </Text>
                </View>
                {grouped.later.map((item) => (
                  <PlanRowCard
                    key={item.id}
                    plan={item}
                    currentUserId={user?.id}
                    onToggleDone={handleToggleDone}
                    onDelete={handleDeletePlan}
                    onSaveToMemories={handleSaveToMemories}
                  />
                ))}
              </View>
            )}

            {/* Collapsed Done Section */}
            {grouped.done.length > 0 && (
              <View>
                <Pressable
                  style={styles.doneAccordionHeader}
                  onPress={() => setDoneExpanded((prev) => !prev)}
                >
                  <View style={styles.doneAccordionLeft}>
                    <Ionicons
                      name="checkmark-done-circle"
                      size={18}
                      color={COLORS.success}
                    />
                    <Text style={styles.doneAccordionTitle}>
                      Completed Moments ({grouped.done.length})
                    </Text>
                  </View>
                  <Ionicons
                    name={doneExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                </Pressable>

                {doneExpanded && (
                  <View style={{ marginTop: 10 }}>
                    {grouped.done.map((item) => (
                      <PlanRowCard
                        key={item.id}
                        plan={item}
                        currentUserId={user?.id}
                        onToggleDone={handleToggleDone}
                        onDelete={handleDeletePlan}
                        onSaveToMemories={handleSaveToMemories}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        )}

        {/* Add Plan Bottom Sheet */}
        <AddPlanBottomSheet
          visible={addSheetVisible}
          onClose={() => setAddSheetVisible(false)}
          onSubmit={handleAddPlan}
        />
      </SafeAreaView>
    </View>
  );
}
