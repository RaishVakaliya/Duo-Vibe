import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/src/constants/colors";
import { getInitial } from "@/src/lib/profile";

export interface CoupleBadgeProps {
  /** Current user */
  myName: string | null;
  myAvatarUrl: string | null;
  /** Partner */
  partnerName: string | null;
  partnerAvatarUrl: string | null;
  /** Whether the couple is actually connected */
  hasPartner: boolean;
  /** Days together — omit or pass 0 to hide */
  daysTogether?: number;
  onPress?: () => void;
}

function Avatar({
  name,
  avatarUrl,
  size = 56,
}: {
  name: string | null;
  avatarUrl: string | null;
  size?: number;
}) {
  const initial = getInitial(name ?? "");
  const radius = size / 2;

  return (
    <View
      style={[
        avatarStyles.ring,
        { width: size + 6, height: size + 6, borderRadius: (size + 6) / 2 },
      ]}
    >
      <View
        style={[
          avatarStyles.inner,
          { width: size, height: size, borderRadius: radius },
        ]}
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: size, height: size, borderRadius: radius }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={150}
          />
        ) : initial ? (
          <LinearGradient
            colors={["#FF4D6D", "#FF8FA3"]}
            style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}
          />
        ) : (
          <View style={[avatarStyles.placeholder, { borderRadius: radius }]}>
            <Text style={avatarStyles.placeholderEmoji}>?</Text>
          </View>
        )}
        {!avatarUrl && initial ? (
          <Text style={[avatarStyles.initial, { fontSize: size * 0.38 }]}>
            {initial}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4D6D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  inner: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
  },
  initial: {
    position: "absolute",
    fontFamily: "Fredoka_700Bold",
    color: "#FFFFFF",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  placeholderEmoji: {
    fontSize: 22,
    color: "rgba(255,255,255,0.4)",
  },
});

export function CoupleBadge({
  myName,
  myAvatarUrl,
  partnerName,
  partnerAvatarUrl,
  hasPartner,
  daysTogether = 0,
  onPress,
}: CoupleBadgeProps) {
  return (
    <Pressable
      onPress={onPress}
      style={badgeStyles.card}
      accessibilityRole="button"
      accessibilityLabel="Couple status"
    >
      {/* Pink gradient background */}
      <LinearGradient
        colors={["rgba(255,77,109,0.18)", "rgba(255,143,163,0.08)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Avatars row */}
      <View style={badgeStyles.avatarsRow}>
        <Avatar name={myName} avatarUrl={myAvatarUrl} size={100} />

        <View style={badgeStyles.heartWrap}>
          <Ionicons
            name={hasPartner ? "heart" : "heart-outline"}
            size={20}
            color={hasPartner ? "#FF4D6D" : "rgba(255,255,255,0.3)"}
          />
        </View>

        <Avatar
          name={hasPartner ? partnerName : null}
          avatarUrl={hasPartner ? partnerAvatarUrl : null}
          size={100}
        />
      </View>

      {/* Labels */}
      <View style={badgeStyles.labelsRow}>
        <Text style={badgeStyles.name} numberOfLines={1}>
          {myName?.split(" ")[0] ?? "You"}
        </Text>
        <View style={badgeStyles.labelCenter} />
        <Text style={badgeStyles.name} numberOfLines={1}>
          {hasPartner
            ? (partnerName?.split(" ")[0] ?? "Partner")
            : "No partner yet"}
        </Text>
      </View>

      {/* Day counter or invite prompt */}
      {hasPartner && daysTogether > 0 ? (
        <View style={badgeStyles.daysBadge}>
          <Ionicons name="calendar-outline" size={12} color="#FF8FA3" />
          <Text style={badgeStyles.daysText}>
            Day {daysTogether} together ❤️
          </Text>
        </View>
      ) : !hasPartner ? (
        <View style={badgeStyles.inviteBadge}>
          <Ionicons name="link-outline" size={12} color="#FF8FA3" />
          <Text style={badgeStyles.inviteText}>Invite your partner</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const badgeStyles = StyleSheet.create({
  card: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 109, 0.22)",
    backgroundColor: "rgba(255, 77, 109, 0.06)",
    alignItems: "center",
    gap: 10,
  },
  avatarsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heartWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,77,109,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  labelsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
  },
  name: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    flex: 1,
    textAlign: "center",
  },
  labelCenter: {
    width: 52,
  },
  daysBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,77,109,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  daysText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "#FF8FA3",
  },
  inviteBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inviteText: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
  },
});
