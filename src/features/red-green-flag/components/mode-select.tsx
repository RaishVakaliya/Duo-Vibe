import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { styles } from "../styles";
import { ModeSelectProps } from "../types";

export const ModeSelect = React.memo(function ModeSelect({
  partnerName,
  hasPartner,
  partnerSessionStatus,
  onSelectSolo,
  onSelectPartner,
  onInvitePartner,
  onBack,
}: ModeSelectProps) {
  const getPartnerStatusText = () => {
    switch (partnerSessionStatus) {
      case "waiting_for_partner":
        return `You've finished. Waiting for ${partnerName} 💭`;
      case "partner_finished":
        return `${partnerName} finished. Your turn! 🔥`;
      case "both_finished":
        return "Both finished! Tap to view results 🎉";
      default:
        return null;
    }
  };

  const partnerStatus = getPartnerStatusText();

  return (
    <View style={{ flex: 1 }}>
      {/* Top Header */}
      <ScreenHeader
        title="Red Flag or Green Flag"
        align="center"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.modeSelectScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Badges & Title */}
        <View style={styles.modeSelectHeader}>
          <View style={styles.modeSelectBadgeRow}>
            <View style={styles.modeSelectBadgeRed}>
              <Ionicons name="flag" size={13} color="#EF4444" />
              <Text style={styles.modeSelectBadgeText}>Red Flag</Text>
            </View>
            <View style={styles.modeSelectBadgeGreen}>
              <Ionicons name="flag" size={13} color="#22C55E" />
              <Text style={styles.modeSelectBadgeText}>Green Flag</Text>
            </View>
          </View>

          <Text style={styles.modeSelectMainTitle}>Where Do You Stand?</Text>
          <Text style={styles.modeSelectSubtitle}>
            Swipe through 20 real relationship situations. Play solo for your
            verdict, or play together to see where you agree and differ.
          </Text>
        </View>

        {/* Mode Cards */}
        <View style={styles.modeCardsContainer}>
          {/* Card 1: Play Solo */}
          <Pressable
            style={styles.modeCard}
            onPress={onSelectSolo}
            accessibilityRole="button"
            accessibilityLabel="Play solo mode"
          >
            <LinearGradient
              colors={["#241530", "#180E22"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modeCardGradient}
            >
              <View style={styles.modeCardIconRow}>
                <View style={styles.modeCardIconBox}>
                  <Ionicons name="person" size={24} color="#FFA07A" />
                </View>
                <View style={styles.modeCardTag}>
                  <Text style={styles.modeCardTagText}>Solo Round</Text>
                </View>
              </View>

              <Text style={styles.modeCardTitle}>Play Solo</Text>
              <Text style={styles.modeCardDesc}>
                Explore your personal instincts, see community statistics, and
                get your relationship vibe breakdown.
              </Text>

              <View style={styles.modeCardActionRow}>
                <Text style={styles.modeCardActionText}>Start Solo Deck</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFA07A" />
              </View>
            </LinearGradient>
          </Pressable>

          {/* Card 2: Play with Partner */}
          <Pressable
            style={[styles.modeCard, !hasPartner && styles.modeCardDisabled]}
            onPress={hasPartner ? onSelectPartner : onInvitePartner}
            accessibilityRole="button"
            accessibilityLabel={`Play with ${partnerName}`}
          >
            <LinearGradient
              colors={["#30162A", "#1D0D19"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modeCardGradient}
            >
              <View style={styles.modeCardIconRow}>
                <View style={styles.modeCardIconBox}>
                  <Ionicons name="heart" size={24} color="#FF4D6D" />
                </View>
                <View
                  style={[
                    styles.modeCardTag,
                    { backgroundColor: "rgba(255, 77, 109, 0.2)" },
                  ]}
                >
                  <Text
                    style={[styles.modeCardTagText, { color: "#FF8FA3" }]}
                  >
                    Couples Mode
                  </Text>
                </View>
              </View>

              <Text style={styles.modeCardTitle}>
                {hasPartner ? `Play with ${partnerName}` : "Play with Partner"}
              </Text>
              <Text style={styles.modeCardDesc}>
                Both answer the same 20 statements privately. Results reveal
                where you agree and what{"'"}s worth talking about!
              </Text>

              {/* Status if active session exists */}
              {hasPartner && partnerStatus && (
                <View style={styles.modeCardStatusRow}>
                  <Ionicons name="time-outline" size={16} color="#FBBF24" />
                  <Text style={styles.modeCardStatusText}>{partnerStatus}</Text>
                </View>
              )}

              {/* Action row or Link Partner CTA */}
              {hasPartner ? (
                <View style={styles.modeCardActionRow}>
                  <Text
                    style={[
                      styles.modeCardActionText,
                      { color: "#FF758C" },
                    ]}
                  >
                    {partnerSessionStatus === "both_finished"
                      ? "View Results"
                      : partnerSessionStatus === "waiting_for_partner"
                        ? "Check Status"
                        : "Start Couple Round"}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FF758C" />
                </View>
              ) : (
                <Pressable
                  style={styles.linkPartnerButton}
                  onPress={onInvitePartner}
                  accessibilityRole="button"
                  accessibilityLabel="Link your partner"
                >
                  <Ionicons name="link-outline" size={16} color="#FF4D6D" />
                  <Text style={styles.linkPartnerButtonText}>
                    Link your partner to play together
                  </Text>
                </Pressable>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
});
