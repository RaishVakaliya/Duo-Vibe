import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { styles } from "../styles";
import { GRADIENTS } from "@/src/constants/colors";
import { InviteCodeDisplayProps } from "../types";

export function InviteCodeDisplay({
  inviteCode,
  timeLeft,
  isFinished,
  isRefreshing,
  onRefreshCode,
  onShareInvite,
  formatMinutesSeconds,
}: InviteCodeDisplayProps) {
  return (
    <>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 500, delay: 150 }}
        style={styles.codeCard}
      >
        <Text style={styles.codeText}>{inviteCode}</Text>
        {isFinished ? (
          <Pressable
            style={styles.refreshRow}
            onPress={onRefreshCode}
            disabled={isRefreshing}
            accessibilityRole="button"
            accessibilityLabel="Refresh expired code"
          >
            <Ionicons name="refresh" size={14} color="#FF8FA3" />
            <Text style={styles.refreshText}>
              {isRefreshing
                ? "Refreshing..."
                : "Code expired • Tap to generate new code"}
            </Text>
          </Pressable>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.expiryText}>
              Expires in {formatMinutesSeconds(timeLeft)}
            </Text>
            <Pressable
              style={[styles.refreshRow, { marginTop: 10 }]}
              onPress={onRefreshCode}
              disabled={isRefreshing}
              accessibilityRole="button"
              accessibilityLabel="Refresh invite code"
            >
              <Ionicons name="refresh" size={12} color="#FF8FA3" />
              <Text style={[styles.refreshText, { fontSize: 12 }]}>
                {isRefreshing ? "Refreshing..." : "Generate fresh code"}
              </Text>
            </Pressable>
          </View>
        )}
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 250 }}
      >
        <Pressable
          style={styles.inviteButton}
          onPress={onShareInvite}
          accessibilityRole="button"
          accessibilityLabel="Invite my partner with shared link"
        >
          <LinearGradient
            colors={[...GRADIENTS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inviteButtonGradient}
          >
            <Ionicons
              name="share-outline"
              size={20}
              color="#FFFFFF"
              style={styles.inviteButtonIcon}
            />
            <Text style={styles.inviteButtonText}>Invite my partner</Text>
          </LinearGradient>
        </Pressable>
      </MotiView>
    </>
  );
}
