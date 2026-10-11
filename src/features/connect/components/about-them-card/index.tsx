import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";
import { AboutThemCardProps } from "./types";
import { styles } from "./styles";

export const AboutThemCard: React.FC<AboutThemCardProps> = ({
  filledCount,
  totalCount,
  onPress,
}) => {
  const percentage =
    totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.titleLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="heart-circle" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.titlesCol}>
            <Text style={styles.cardTitle}>About Them</Text>
            <View style={styles.privacyRow}>
              <Ionicons
                name="lock-closed"
                size={12}
                color={COLORS.primaryLight}
              />
              <Text style={styles.privacyText}>Only you can see this</Text>
            </View>
          </View>
        </View>

        <View style={styles.chevronButton}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="rgba(255, 255, 255, 0.7)"
          />
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressLabelsRow}>
          <Text style={styles.progressText}>
            {filledCount} of {totalCount} filled
          </Text>
          <Text style={styles.progressPercent}>{percentage}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%` },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
};
