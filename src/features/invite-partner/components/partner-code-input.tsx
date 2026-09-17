import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { styles } from "../styles";
import { GRADIENTS } from "@/src/constants/colors";
import { PartnerCodeInputProps } from "../types";

export function PartnerCodeInput({
  partnerCode,
  onChangePartnerCode,
  onPasteCode,
  onConnect,
  isConnecting,
}: PartnerCodeInputProps) {
  return (
    <>
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
            onPress={onPasteCode}
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
            onChangeText={onChangePartnerCode}
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
              onPress={onConnect}
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
    </>
  );
}
