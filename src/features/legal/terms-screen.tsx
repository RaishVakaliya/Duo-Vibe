import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>Terms of Service</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.lastUpdated}>Last Updated: September 2026</Text>

            <Text style={styles.sectionTitle}>1. Welcome to Duo Vibe</Text>
            <Text style={styles.paragraph}>
              By using Duo Vibe, you agree to comply with and be bound by these
              Terms of Service. If you disagree with any portion of these terms,
              please discontinue use of the app.
            </Text>

            <Text style={styles.sectionTitle}>2. Mutual Respect & Safe Environment</Text>
            <Text style={styles.paragraph}>
              Duo Vibe is built exclusively for partners to connect and grow
              together in love. Any abusive behavior, harassment, impersonation,
              or non-consensual sharing of intimate materials is strictly
              prohibited and will result in immediate termination of the offending
              account.
            </Text>

            <Text style={styles.sectionTitle}>3. Account & Pair Connection</Text>
            <Text style={styles.paragraph}>
              You are responsible for keeping your account credentials and invite
              codes private. Only share your 6-character connection code with your
              trusted partner.
            </Text>

            <Text style={styles.sectionTitle}>4. Ownership of Memories & Content</Text>
            <Text style={styles.paragraph}>
              All photos, scrapbooks, spark responses, and quiz answers created
              inside your couple space belong entirely to you and your partner.
              Duo Vibe does not claim ownership or license your private moments.
            </Text>

            <Text style={styles.sectionTitle}>5. Termination</Text>
            <Text style={styles.paragraph}>
              You have the right to delete your account at any time via the
              Delete Account button in settings. Deletion will immediately
              disconnect your couple space and erase your personal data from
              active records.
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
