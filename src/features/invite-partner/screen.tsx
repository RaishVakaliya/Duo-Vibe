import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Share,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { useCountdown } from "@/src/hooks/use-countdown";

export default function InvitePartnerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string }>();
  const isFromHome = params.source === "home";
  const { inviteCode, codeExpiresAt, refreshInviteCode, connectPartnerCode } =
    useAuth();
  const { showAlert } = useAlert();
  const [partnerCode, setPartnerCode] = useState<string>("");
  const { timeLeft, reset, formatMinutesSeconds, isFinished } =
    useCountdown(codeExpiresAt);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    reset(codeExpiresAt);
  }, [codeExpiresAt, reset]);

  const handleRefreshCode = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await refreshInviteCode();
    } catch (err: unknown) {
      console.warn("Error refreshing code:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [router]),
  );

  const handleShareInvite = async (): Promise<void> => {
    try {
      await Share.share({
        message: `Join me on Duo Vibe! 💕 Connect our shared space using my invite code: ${inviteCode}\nDownload the app to get started!`,
      });
    } catch (err: unknown) {
      console.warn("Share action error:", err);
    }
  };

  const handlePasteCode = async (): Promise<void> => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        const cleaned = text.trim().toUpperCase().slice(0, 6);
        if (cleaned.length > 0) {
          setPartnerCode(cleaned);
        } else {
          showAlert({
            title: "Clipboard Empty",
            message: "No code found in clipboard.",
          });
        }
      } else {
        showAlert({
          title: "Clipboard Empty",
          message: "No code found in clipboard.",
        });
      }
    } catch (err: unknown) {
      showAlert({
        title: "Clipboard Error",
        message: "Unable to access clipboard. Please type code manually.",
      });
      console.warn("Clipboard read error:", err);
    }
  };

  const handleConnect = async (): Promise<void> => {
    if (!partnerCode.trim()) {
      showAlert({
        title: "Partner Code Required",
        message: "Please enter your partner's 6-character code.",
      });
      return;
    }
    setIsConnecting(true);
    try {
      const result = await connectPartnerCode(partnerCode);
      if (result.success) {
        router.replace(ROUTES.HOME);
      } else {
        showAlert({
          title: "Connection Failed",
          message:
            result.message ||
            "Could not connect with partner. Please try again.",
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      showAlert({
        title: "Connection Error",
        message: msg,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDoItLater = (): void => {
    router.replace(ROUTES.HOME);
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
        {isFromHome ? (
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace(ROUTES.HOME)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
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
                  onPress={handleRefreshCode}
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
                    onPress={handleRefreshCode}
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
                onPress={handleShareInvite}
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

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.partnerInputSection}>
              <View style={styles.partnerInputHeader}>
                <Text style={styles.inputLabel}>
                  {"Enter your partner's code"}
                </Text>
                <Pressable
                  style={styles.pasteButton}
                  onPress={handlePasteCode}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel="Paste partner code from clipboard"
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={14}
                    color="#FFFFFF"
                  />
                  <Text style={styles.pasteButtonText}>Paste code</Text>
                </Pressable>
              </View>

              <View style={styles.inputCard}>
                <TextInput
                  style={styles.textInput}
                  placeholder="ABCD12"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  value={partnerCode}
                  onChangeText={(text) =>
                    setPartnerCode(text.toUpperCase().slice(0, 6))
                  }
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={6}
                  accessibilityLabel="Partner invitation code input"
                />
              </View>

              {partnerCode.length >= 4 && (
                <MotiView
                  from={{ opacity: 0, translateY: -8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 300 }}
                >
                  <Pressable
                    style={styles.connectButton}
                    onPress={handleConnect}
                    disabled={isConnecting}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isConnecting
                        ? "Connecting partner code"
                        : "Connect partner space"
                    }
                  >
                    <LinearGradient
                      colors={[...GRADIENTS.progressBar]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.connectButtonGradient}
                    >
                      <Text style={styles.connectButtonText}>
                        {isConnecting ? "Connecting..." : "Connect Space"}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </MotiView>
              )}
            </View>
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
