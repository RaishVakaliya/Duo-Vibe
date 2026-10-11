import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatementById } from "@/src/data/flagStatements";
import { styles } from "../styles";
import { PartnerResultProps } from "../types";

export const PartnerResult = React.memo(function PartnerResult({
  partnerName,
  summary,
  isSavedToMemories,
  isSavingMemory,
  onSaveToMemories,
  onPlayAgain,
  onBackToHome,
}: PartnerResultProps) {
  const agreedItems = useMemo(
    () => summary.items.filter((i) => i.is_agreement),
    [summary.items],
  );

  const disagreedItems = useMemo(
    () => summary.items.filter((i) => !i.is_agreement),
    [summary.items],
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <Pressable
          style={styles.headerBackButton}
          onPress={onBackToHome}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Couple Compatibility</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.resultScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Score Card */}
        <View style={styles.partnerScoreCard}>
          <Text style={styles.partnerScoreHeader}>Agreed Perspectives</Text>
          <Text style={styles.partnerScoreBig}>
            {summary.agreementsCount} / {summary.totalCount}
          </Text>
          <Text style={styles.partnerScoreSubtitle}>
            {summary.agreementsCount >= 16
              ? `Incredible sync! You and ${partnerName} see almost everything eye-to-eye.`
              : summary.agreementsCount >= 11
                ? `Great alignment with healthy differences to keep things interesting with ${partnerName}!`
                : `Plenty of fun perspectives to explore together with ${partnerName}!`}
          </Text>
        </View>

        {/* Section 1: Worth Talking About (Disagreements — The Core Payoff) */}
        {disagreedItems.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles" size={18} color="#FF6B81" />
              <Text style={styles.sectionTitle}>Worth Talking About</Text>
              <View
                style={[
                  styles.sectionCountBadge,
                  { backgroundColor: "rgba(239, 68, 68, 0.2)" },
                ]}
              >
                <Text
                  style={[styles.sectionCountText, { color: "#F87171" }]}
                >
                  {disagreedItems.length}
                </Text>
              </View>
            </View>

            <View style={styles.breakdownList}>
              {disagreedItems.map((item) => {
                const statement = getStatementById(item.statement_id);
                if (!statement) return null;

                const myVoteIsRed = item.my_vote === "red";
                const partnerVoteIsRed = item.partner_vote === "red";

                return (
                  <View
                    key={item.statement_id}
                    style={[
                      styles.breakdownCard,
                      styles.breakdownCardDisagreement,
                    ]}
                  >
                    <Text style={styles.breakdownStatement}>
                      {statement.text}
                    </Text>

                    <View style={styles.breakdownPillsRow}>
                      {/* My Answer */}
                      <View
                        style={[
                          styles.breakdownPill,
                          myVoteIsRed
                            ? styles.breakdownPillRed
                            : styles.breakdownPillGreen,
                        ]}
                      >
                        <Ionicons
                          name="flag"
                          size={12}
                          color={myVoteIsRed ? "#EF4444" : "#22C55E"}
                        />
                        <Text style={styles.breakdownPillText}>
                          You: {myVoteIsRed ? "Red Flag" : "Green Flag"}
                        </Text>
                      </View>

                      {/* Partner Answer */}
                      <View
                        style={[
                          styles.breakdownPill,
                          partnerVoteIsRed
                            ? styles.breakdownPillRed
                            : styles.breakdownPillGreen,
                        ]}
                      >
                        <Ionicons
                          name="flag"
                          size={12}
                          color={partnerVoteIsRed ? "#EF4444" : "#22C55E"}
                        />
                        <Text style={styles.breakdownPillText}>
                          {partnerName}:{" "}
                          {partnerVoteIsRed ? "Red Flag" : "Green Flag"}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Section 2: You Agreed */}
        {agreedItems.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={18} color="#34D399" />
              <Text style={styles.sectionTitle}>You Both Agreed</Text>
              <View
                style={[
                  styles.sectionCountBadge,
                  { backgroundColor: "rgba(34, 197, 94, 0.2)" },
                ]}
              >
                <Text
                  style={[styles.sectionCountText, { color: "#4ADE80" }]}
                >
                  {agreedItems.length}
                </Text>
              </View>
            </View>

            <View style={styles.breakdownList}>
              {agreedItems.map((item) => {
                const statement = getStatementById(item.statement_id);
                if (!statement) return null;
                const isRed = item.my_vote === "red";

                return (
                  <View key={item.statement_id} style={styles.breakdownCard}>
                    <Text style={styles.breakdownStatement}>
                      {statement.text}
                    </Text>

                    <View style={styles.breakdownPillsRow}>
                      <View
                        style={[
                          styles.breakdownPill,
                          isRed
                            ? styles.breakdownPillRed
                            : styles.breakdownPillGreen,
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color={isRed ? "#EF4444" : "#22C55E"}
                        />
                        <Text style={styles.breakdownPillText}>
                          Both called it a {isRed ? "Red Flag" : "Green Flag"}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.resultActionsContainer}>
          <Pressable
            style={[
              styles.saveMemoryButton,
              isSavedToMemories && styles.saveMemoryButtonSaved,
            ]}
            onPress={onSaveToMemories}
            disabled={isSavedToMemories || isSavingMemory}
            accessibilityRole="button"
            accessibilityLabel={
              isSavedToMemories
                ? "Saved to Memories"
                : "Save Result to Memories"
            }
          >
            {isSavingMemory ? (
              <ActivityIndicator size="small" color="#FF2D55" />
            ) : (
              <Ionicons
                name={isSavedToMemories ? "checkmark-circle" : "sparkles"}
                size={18}
                color={isSavedToMemories ? "#059669" : "#FF2D55"}
              />
            )}
            <Text
              style={[
                styles.saveMemoryButtonText,
                isSavedToMemories && styles.saveMemoryButtonTextSaved,
              ]}
            >
              {isSavedToMemories
                ? "Saved to Memories"
                : isSavingMemory
                  ? "Saving to Memories..."
                  : "Save to Memories"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={onPlayAgain}
            accessibilityRole="button"
            accessibilityLabel="Play a new round"
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.secondaryButtonText}>Play a New Round</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
});
