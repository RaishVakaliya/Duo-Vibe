import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Share,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { MotiView } from "moti";
import { invitePartnerStyles } from "@/styles/invite-partner.styles";
import { GRADIENTS } from "@/constants/colors";
import { useAuth } from "@/context/auth";

export default function InvitePartnerScreen() {
  const router = useRouter();
  const { inviteCode, connectPartnerCode } = useAuth();
  const [partnerCode, setPartnerCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 20); // 28:20
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: `Join me on Duo Vibe! 💕 Connect our shared space using my invite code: ${inviteCode}\nDownload the app to get started!`,
      });
    } catch {
      // ignore
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        const cleaned = text.trim().toUpperCase().slice(0, 6);
        setPartnerCode(cleaned);
      }
    } catch {
      // ignore
    }
  };

  const handleConnect = async () => {
    if (!partnerCode.trim()) {
      Alert.alert(
        "Partner Code Required",
        "Please enter your partner's 6-character code.",
      );
      return;
    }
    setIsConnecting(true);
    const result = await connectPartnerCode(partnerCode);
    setIsConnecting(false);

    if (result.success) {
      router.replace("/home");
    } else {
      Alert.alert(
        "Notice",
        result.message || "Could not connect. Please try again.",
      );
    }
  };

  const handleDoItLater = () => {
    router.replace("/home");
  };

  return (
    <View style={invitePartnerStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={invitePartnerStyles.gradientBackground}
      />

      <SafeAreaView style={invitePartnerStyles.safeArea}>
        <View style={invitePartnerStyles.headerRow}>
          <Pressable
            style={invitePartnerStyles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={invitePartnerStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
              style={invitePartnerStyles.titleContainer}
            >
              <Text style={invitePartnerStyles.title}>
                Invite your partner{"\n"}to Duo Vibe.
              </Text>
              <Text style={invitePartnerStyles.subtitle}>
                Connect your accounts and start your shared space together.
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 500, delay: 150 }}
              style={invitePartnerStyles.codeCard}
            >
              <Text style={invitePartnerStyles.codeText}>{inviteCode}</Text>
              <Text style={invitePartnerStyles.expiryText}>
                Expires in {formatTime(timeLeft)}
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 250 }}
            >
              <Pressable
                style={invitePartnerStyles.inviteButton}
                onPress={handleShareInvite}
                accessibilityRole="button"
                accessibilityLabel="Invite my partner"
              >
                <LinearGradient
                  colors={[...GRADIENTS.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={invitePartnerStyles.inviteButtonGradient}
                >
                  <Ionicons
                    name="share-outline"
                    size={20}
                    color="#FFFFFF"
                    style={invitePartnerStyles.inviteButtonIcon}
                  />
                  <Text style={invitePartnerStyles.inviteButtonText}>
                    Invite my partner
                  </Text>
                </LinearGradient>
              </Pressable>
            </MotiView>

            <View style={invitePartnerStyles.dividerRow}>
              <View style={invitePartnerStyles.dividerLine} />
              <Text style={invitePartnerStyles.dividerText}>or</Text>
              <View style={invitePartnerStyles.dividerLine} />
            </View>

            <View style={invitePartnerStyles.partnerInputSection}>
              <View style={invitePartnerStyles.partnerInputHeader}>
                <Text style={invitePartnerStyles.inputLabel}>
                  Enter your partner's code
                </Text>
                <Pressable
                  style={invitePartnerStyles.pasteButton}
                  onPress={handlePasteCode}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Paste code from clipboard"
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={14}
                    color="#FFFFFF"
                  />
                  <Text style={invitePartnerStyles.pasteButtonText}>
                    Paste code
                  </Text>
                </Pressable>
              </View>

              <View style={invitePartnerStyles.inputCard}>
                <TextInput
                  style={invitePartnerStyles.textInput}
                  placeholder="ABCD12"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  value={partnerCode}
                  onChangeText={(text) =>
                    setPartnerCode(text.toUpperCase().slice(0, 6))
                  }
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={6}
                />
              </View>

              {partnerCode.length >= 4 && (
                <MotiView
                  from={{ opacity: 0, translateY: -8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 300 }}
                >
                  <Pressable
                    style={invitePartnerStyles.connectButton}
                    onPress={handleConnect}
                    disabled={isConnecting}
                  >
                    <LinearGradient
                      colors={[...GRADIENTS.progressBar]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={invitePartnerStyles.connectButtonGradient}
                    >
                      <Text style={invitePartnerStyles.connectButtonText}>
                        {isConnecting ? "Connecting..." : "Connect Space"}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </MotiView>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={invitePartnerStyles.footer}>
          <Pressable
            style={invitePartnerStyles.laterButton}
            onPress={handleDoItLater}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="I will do it later"
          >
            <Text style={invitePartnerStyles.laterButtonText}>
              I will do it later!
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
