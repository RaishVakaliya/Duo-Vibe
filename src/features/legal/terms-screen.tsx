import React from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Terms of Service" align="center" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>

            {/* ── 1. Welcome ──────────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>1. Welcome to Duo Vibe</Text>
            <Text style={styles.paragraph}>
              By downloading or using Duo Vibe you agree to comply with and be
              bound by these Terms of Service. If you disagree with any portion
              of these terms, please discontinue use of the app.
            </Text>

            {/* ── 2. Eligibility ──────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>2. Eligibility</Text>
            <Text style={styles.paragraph}>
              Duo Vibe is intended for users who are 18 years of age or older.
              By using the app you confirm that you are at least 18. If you are
              under 18 you must not use the app.
            </Text>

            {/* ── 3. Mutual Respect & Safe Environment ────────────────── */}
            <Text style={styles.sectionTitle}>
              3. Mutual Respect &amp; Safe Environment
            </Text>
            <Text style={styles.paragraph}>
              Duo Vibe is built exclusively for partners to connect and grow
              together. Any abusive behaviour, harassment, impersonation, or
              non-consensual sharing of intimate materials is strictly
              prohibited and will result in immediate termination of the
              offending account.
            </Text>

            {/* ── 4. Account & Pair Connection ────────────────────────── */}
            <Text style={styles.sectionTitle}>
              4. Account &amp; Pair Connection
            </Text>
            <Text style={styles.paragraph}>
              You are responsible for keeping your account credentials and
              invite codes private. Only share your 6-character connection code
              with your trusted partner. You are responsible for all activity
              that occurs under your account.
            </Text>

            {/* ── 5. Acceptable Use ───────────────────────────────────── */}
            <Text style={styles.sectionTitle}>5. Acceptable Use</Text>
            <Text style={styles.paragraph}>
              You agree not to:{"\n"}
              • Use the app for any unlawful purpose or in any way that violates
              these Terms.{"\n"}
              • Upload or share illegal, hateful, defamatory, or sexually
              explicit content.{"\n"}
              • Attempt to reverse-engineer, hack, or disrupt the app or its
              servers.{"\n"}
              • Use automated scripts, bots or other means to access the app in
              an unauthorised way.
            </Text>

            {/* ── 6. Ownership of Memories & Content ──────────────────── */}
            <Text style={styles.sectionTitle}>
              6. Ownership of Memories &amp; Content
            </Text>
            <Text style={styles.paragraph}>
              All photos, scrapbook entries, quiz answers and other content you
              create inside your couple space belong entirely to you and your
              partner. Duo Vibe does not claim ownership of or a licence to your
              private moments.
            </Text>
            <Text style={styles.paragraph}>
              By uploading content you grant us a limited, non-exclusive licence
              to store and display it solely to provide the service to you.
            </Text>

            {/* ── 7. Third-Party Services ─────────────────────────────── */}
            <Text style={styles.sectionTitle}>7. Third-Party Services</Text>
            <Text style={styles.paragraph}>
              Duo Vibe uses Supabase, Google Sign-In and Firebase Cloud
              Messaging to operate. Your use of these services is also subject
              to their respective terms and privacy policies.
            </Text>

            {/* ── 8. Disclaimers ──────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>8. Disclaimers</Text>
            <Text style={styles.paragraph}>
              The app is provided "as is" without warranties of any kind. We do
              not guarantee that the app will be available at all times, free of
              errors, or that results from in-app tools (such as Love Match or
              Crush Calculator) are accurate or meaningful beyond entertainment.
            </Text>

            {/* ── 9. Termination ──────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>9. Termination</Text>
            <Text style={styles.paragraph}>
              You have the right to delete your account at any time via Profile
              → Edit Profile → Delete Account. Deletion will immediately
              disconnect your couple space and erase your personal data from
              active records, as described in our Privacy Policy.
            </Text>
            <Text style={styles.paragraph}>
              We reserve the right to suspend or terminate accounts that violate
              these Terms, without prior notice.
            </Text>

            {/* ── 10. Changes to These Terms ──────────────────────────── */}
            <Text style={styles.sectionTitle}>10. Changes to These Terms</Text>
            <Text style={styles.paragraph}>
              We may update these Terms of Service from time to time. We will
              notify you of significant changes in the app or by updating the
              "Last Updated" date above. Continued use after changes constitutes
              acceptance of the new terms.
            </Text>

            {/* ── 11. Contact ─────────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have questions about these Terms, contact us at:
            </Text>
          </View>

          <Text style={styles.footerNote}>
            Questions? Reach out to support@duovibe.app
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
