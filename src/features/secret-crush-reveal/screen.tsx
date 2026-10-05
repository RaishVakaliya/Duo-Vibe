import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useSecretCrushReveal } from "./use-secret-crush-reveal";
import { EnvelopeIllustration } from "@/src/features/secret-crush/components/envelope-illustration";

const MAX_REPLY_CHARS = 400;

export default function SecretCrushRevealScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    mode,
    message,
    status,
    replyMessage,
    replyDraft,
    isSubmittingReply,
    setReplyDraft,
    handleSendReply,
    handleCopyLink,
  } = useSecretCrushReveal(id ?? "");

  function StatusBadge() {
    return (
      <View
        style={[
          styles.statusBadge,
          status === "sent" && styles.statusBadgeSent,
          status === "opened" && styles.statusBadgeOpened,
          status === "replied" && styles.statusBadgeReplied,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            status === "sent" && styles.statusTextSent,
            status === "opened" && styles.statusTextOpened,
            status === "replied" && styles.statusTextReplied,
          ]}
        >
          {status === "sent" ? "Sent" : status === "opened" ? "Opened" : "Replied"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* ─── Top Nav ──────────────────────────────────────────────── */}
        <View style={styles.topNavRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerTitleRow}>
            <Ionicons name="mail" size={20} color="#FF4D6D" />
            <Text style={styles.headerTitle}>Secret Crush</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* ─── Loading ───────────────────────────────────────────────── */}
        {mode === "loading" && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator color="#FF4D6D" size="large" />
            <Text style={styles.centeredSubtitle}>Opening your message...</Text>
          </View>
        )}

        {/* ─── Not found ────────────────────────────────────────────── */}
        {mode === "not_found" && (
          <View style={styles.centeredContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#4A3048" />
            <Text style={styles.centeredTitle}>Message Not Found</Text>
            <Text style={styles.centeredSubtitle}>
              This link may be invalid or the message has been removed.
            </Text>
          </View>
        )}

        {/* ─── Sender View ──────────────────────────────────────────── */}
        {mode === "sender" && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <MotiView
                from={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 14 }}
                style={styles.illustrationContainer}
              >
                <EnvelopeIllustration size={140} />
              </MotiView>

              <Text style={styles.senderTitle}>You sent this 💌</Text>
              <Text style={styles.senderSubtitle}>
                This is a message you created. Share the link so your crush can see it.
              </Text>

              <View style={styles.statusRow}>
                <StatusBadge />
              </View>

              <View style={styles.messageCard}>
                <Text style={styles.messageLabel}>Your Message</Text>
                <Text style={styles.messageText}>{message}</Text>
              </View>

              {replyMessage && (
                <MotiView
                  from={{ opacity: 0, translateY: 8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 350 }}
                  style={styles.replyCard}
                >
                  <Text style={styles.replyCardLabel}>💬 Their Reply</Text>
                  <Text style={styles.replyCardText}>{replyMessage}</Text>
                </MotiView>
              )}

              <Pressable
                style={styles.copyLinkButton}
                onPress={handleCopyLink}
                accessibilityRole="button"
                accessibilityLabel="Copy the secret crush link"
              >
                <Ionicons name="link-outline" size={18} color="#FF4D6D" />
                <Text style={styles.copyLinkText}>Copy Link</Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        {/* ─── Recipient View ───────────────────────────────────────── */}
        {mode === "recipient" && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <MotiView
                from={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                style={styles.illustrationContainer}
              >
                <EnvelopeIllustration size={140} />
              </MotiView>

              <Text style={styles.recipientHeadline}>
                💌 Someone has a secret message for you...
              </Text>
              <Text style={styles.recipientSubtitle}>
                Someone sent you this anonymously. Read it, and reply if you{"'"}d like — they{"'"}ll see your response.
              </Text>

              <MotiView
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400, delay: 150 }}
                style={styles.messageCard}
              >
                <Text style={styles.messageLabel}>Their Message</Text>
                <Text style={styles.messageText}>{message}</Text>
              </MotiView>

              {/* Reply input */}
              <MotiView
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400, delay: 280 }}
                style={styles.replyInputCard}
              >
                <Text style={styles.replyInputLabel}>Reply Anonymously (Optional)</Text>
                <TextInput
                  style={styles.replyTextArea}
                  placeholder="Write a reply... They won't know it's you."
                  placeholderTextColor="#4A3048"
                  value={replyDraft}
                  onChangeText={setReplyDraft}
                  multiline
                  maxLength={MAX_REPLY_CHARS}
                  accessibilityLabel="Reply message input"
                  textAlignVertical="top"
                />
                <Text style={styles.replyCharCount}>
                  {replyDraft.length}/{MAX_REPLY_CHARS}
                </Text>
              </MotiView>

              <Pressable
                style={[
                  styles.sendReplyButton,
                  (replyDraft.trim().length === 0 || isSubmittingReply) &&
                  styles.sendReplyButtonDisabled,
                ]}
                onPress={handleSendReply}
                disabled={replyDraft.trim().length === 0 || isSubmittingReply}
                accessibilityRole="button"
                accessibilityLabel="Send anonymous reply"
              >
                <LinearGradient
                  colors={["#FF2D6C", "#FF4D6D", "#FF758C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendReplyGradient}
                >
                  {isSubmittingReply ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="send" size={16} color="#FFFFFF" />
                      <Text style={styles.sendReplyButtonText}>Send Reply</Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        {/* ─── Replied Confirmation ─────────────────────────────────── */}
        {mode === "replied" && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 14 }}
              style={styles.illustrationContainer}
            >
              <EnvelopeIllustration size={140} />
            </MotiView>

            <View style={styles.confirmCard}>
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              <Text style={styles.confirmTitle}>Reply Sent! 💚</Text>
              <Text style={styles.confirmSubtitle}>
                Your anonymous reply has been sent. The sender will see it when they open the link.
              </Text>
            </View>

            <View style={styles.messageCard}>
              <Text style={styles.messageLabel}>Their Message</Text>
              <Text style={styles.messageText}>{message}</Text>
            </View>

            {replyMessage && (
              <View style={styles.replyCard}>
                <Text style={styles.replyCardLabel}>Your Reply</Text>
                <Text style={styles.replyCardText}>{replyMessage}</Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
