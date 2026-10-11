import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";
import { WaitingScreenProps } from "../types";

export const WaitingScreen = React.memo(function WaitingScreen({
  partnerName,
  onBack,
}: WaitingScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.headerBackButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Waiting for Partner</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.waitingScroll}>
        <View style={styles.waitingCard}>
          <View style={styles.waitingIconWrap}>
            <Ionicons name="hourglass-outline" size={36} color="#FF4D6D" />
          </View>

          <Text style={styles.waitingTitle}>You{"'"}re All Done!</Text>
          <Text style={styles.waitingDesc}>
            Your answers are saved. Once {partnerName} finishes their deck,
            your results and agreements will automatically reveal here.
          </Text>

          <View style={styles.waitingLiveIndicator}>
            <ActivityIndicator size="small" color="#FFA07A" />
            <Text style={styles.waitingLiveText}>
              Listening live for {partnerName}{"'"}s answers...
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});
