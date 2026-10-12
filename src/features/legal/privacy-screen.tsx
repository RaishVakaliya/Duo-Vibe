import React from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Privacy Policy" align="center" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.lastUpdated}>Last Updated: September 2026</Text>

            <Text style={styles.sectionTitle}>1. Our Privacy Pledge</Text>
            <Text style={styles.paragraph}>
              At Duo Vibe, we believe relationships are private and sacred. We
              hold your data to the highest standards of confidentiality and
              never monetize your personal moments.
            </Text>

            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.paragraph}>
              - Account Data: Your name, email, and authentication ID (via Google
              Sign-In or Email).
            </Text>
            <Text style={styles.paragraph}>
              - Couple Moments: The sparks you answer, your quiz scores, date
              selections, and memories you choose to upload.
            </Text>
            <Text style={styles.paragraph}>
              - Device Tokens: Push notification tokens strictly used to inform you
              when your partner completes an activity.
            </Text>

            <Text style={styles.sectionTitle}>3. Zero Ad-Tracking & No Selling Data</Text>
            <Text style={styles.paragraph}>
              We do not track you across third-party apps, build advertising
              profiles, or sell your personal data to data brokers or advertisers.
            </Text>

            <Text style={styles.sectionTitle}>4. Row-Level Security & Encryption</Text>
            <Text style={styles.paragraph}>
              Your shared content is protected using Supabase Row-Level Security
              (RLS) policies. Only you and your verified connected partner have
              access to read or update your shared space.
            </Text>

            <Text style={styles.sectionTitle}>5. Right to Permanent Deletion</Text>
            <Text style={styles.paragraph}>
              Whenever you choose to delete your account, your profile, partner
              linkage, and personal submissions are permanently deleted from our
              databases without retention delays.
            </Text>
          </View>

          <Text style={styles.footerNote}>
            Your privacy matters. Inquiries: privacy@duovibe.app
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
