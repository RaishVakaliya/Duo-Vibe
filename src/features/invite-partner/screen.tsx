import React from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { useInvitePartner } from "./use-invite-partner";
import { InviteCodeDisplay } from "./components/invite-code-display";
import { PartnerCodeInput } from "./components/partner-code-input";

export default function InvitePartnerScreen() {
  const {
    isFromHome,
    inviteCode,
    partnerCode,
    setPartnerCode,
    timeLeft,
    isFinished,
    isRefreshing,
    isConnecting,
    formatMinutesSeconds,
    handleRefreshCode,
    handleShareInvite,
    handlePasteCode,
    handleConnect,
    handleDoItLater,
    handleBack,
  } = useInvitePartner();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        {isFromHome ? (
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : (
          <View style={{ height: 16 }} />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
              style={styles.titleContainer}
            >
              <Text style={styles.title}>
                Invite your partner{"\n"}to Duo Vibe.
              </Text>
              <Text style={styles.subtitle}>
                Connect your accounts and start your shared space together.
              </Text>
            </MotiView>

            <InviteCodeDisplay
              inviteCode={inviteCode}
              timeLeft={timeLeft}
              isFinished={isFinished}
              isRefreshing={isRefreshing}
              onRefreshCode={handleRefreshCode}
              onShareInvite={handleShareInvite}
              formatMinutesSeconds={formatMinutesSeconds}
            />

            <PartnerCodeInput
              partnerCode={partnerCode}
              onChangePartnerCode={(text) =>
                setPartnerCode(text.toUpperCase().slice(0, 6))
              }
              onPasteCode={handlePasteCode}
              onConnect={handleConnect}
              isConnecting={isConnecting}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        {!isFromHome && (
          <View style={styles.footer}>
            <Pressable
              style={styles.laterButton}
              onPress={handleDoItLater}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="I will do it later"
            >
              <Text style={styles.laterButtonText}>I will do it later!</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
