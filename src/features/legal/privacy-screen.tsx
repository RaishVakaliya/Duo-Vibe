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
            <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>

            <Text style={styles.paragraph}>
              Duo Vibe ("we", "our", "us") is a mobile application that helps
              couples connect through relationship games, daily challenges,
              messaging, shared memories, plans and other activities. This
              Privacy Policy explains what information we collect, how we use
              it, who can see it, and the choices you have.
            </Text>

            {/* ── 1. Information We Collect ───────────────────────────── */}
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>

            <Text style={styles.subSectionTitle}>Account information</Text>
            <Text style={styles.paragraph}>
              • Your name, email address and profile photo, received from your
              Google account when you tap "Continue with Google".{"\n"}
              • A profile photo you choose to upload, and any profile details
              you edit in the app.{"\n"}
              • Relationship details you choose to provide, such as relationship
              type and anniversary date.
            </Text>

            <Text style={styles.subSectionTitle}>
              Content you create and share with your partner
            </Text>
            <Text style={styles.paragraph}>
              • Chat messages and images you send.{"\n"}
              • Memories: photos, titles, dates, notes and heart reactions.{"\n"}
              • Plans: titles, dates, times and notes for upcoming plans.{"\n"}
              • Answers and progress in Couple Quiz, 21 Questions, Couple
              Challenge and Red Flag or Green Flag.{"\n"}
              • Results you choose to save, such as Love Match or quiz scores.
            </Text>

            <Text style={styles.subSectionTitle}>
              Content that stays private to you
            </Text>
            <Text style={styles.paragraph}>
              • "About Them" notes: details you save about your partner, such as
              birthdays, favourites, sizes and gift ideas. These are visible
              only to you and are never shown to your partner.{"\n"}
              • Reminders for birthdays, anniversaries and plans. These are
              scheduled on your own device.
            </Text>

            <Text style={styles.subSectionTitle}>
              Anonymous messages and statistics
            </Text>
            <Text style={styles.paragraph}>
              • Secret Crush messages you send, and the replies you receive.{"\n"}
              • Votes you make when playing Red Flag or Green Flag on your own.
              These are counted to show overall percentages and are only shown
              to other people as totals.
            </Text>

            <Text style={styles.subSectionTitle}>Technical information</Text>
            <Text style={styles.paragraph}>
              • A device push notification token, used to deliver
              notifications.{"\n"}
              • Your online status in the chat (whether you are currently using
              it), which your partner can see.{"\n"}
              • Basic sign-in and app usage logs, used for security and bug
              fixing.
            </Text>

            <Text style={styles.subSectionTitle}>Permissions</Text>
            <Text style={styles.paragraph}>
              We ask for access to your photo library only when you choose to
              add a photo, and for notification permission so we can deliver
              notifications. You can change these permissions at any time in
              your device settings.{"\n\n"}
              Names and dates you enter into tools such as Love Match and Crush
              Calculator are used to produce your result.
            </Text>

            {/* ── 2. How We Use Your Information ─────────────────────── */}
            <Text style={styles.sectionTitle}>
              2. How We Use Your Information
            </Text>
            <Text style={styles.paragraph}>
              • To provide core app functionality: sign-in, partner linking,
              chat, games, challenges, memories and plans.{"\n"}
              • To sync shared content in real time between linked partners.{"\n"}
              • To send push notifications about app activity, such as a new
              chat message or a partner finishing a quiz.{"\n"}
              • To show your partner's online status in the chat.{"\n"}
              • To calculate and show overall statistics for Red Flag or Green
              Flag.{"\n"}
              • To keep your account secure, prevent abuse and enforce our Terms
              of Service.{"\n"}
              • To diagnose bugs and improve app performance.
            </Text>
            <Text style={styles.paragraph}>
              We do not use your information for advertising, and we do not sell
              your data to anyone.
            </Text>

            {/* ── 3. How We Share Your Information ───────────────────── */}
            <Text style={styles.sectionTitle}>
              3. How We Share Your Information
            </Text>
            <Text style={styles.paragraph}>
              We do not share your personal information with third parties for
              their own marketing or advertising purposes.
            </Text>
            <Text style={styles.paragraph}>
              We use the following service providers to operate the app. They
              process data only as needed to provide their service to us:{"\n"}
              • Supabase — our database, authentication, file storage for photos
              and images, and real-time sync.{"\n"}
              • Google — Google Sign-In, and Firebase Cloud Messaging for
              delivering push notifications on Android.{"\n"}
              • Expo — push notification service.
            </Text>
            <Text style={styles.paragraph}>
              Our service providers may process data in countries other than
              your own. We may also disclose information if required by law, or
              where needed to protect the safety of our users or the app.
            </Text>

            {/* ── 4. What Your Partner Can and Cannot See ─────────────── */}
            <Text style={styles.sectionTitle}>
              4. What Your Partner Can and Cannot See
            </Text>
            <Text style={styles.paragraph}>
              Duo Vibe is built around a connected couple space. Once you link
              with a partner, the following becomes visible to them as part of
              the app's core features:{"\n"}
              • Chat messages and images you send each other, and your online
              status in the chat.{"\n"}
              • Memories, photos and reactions in your shared scrapbook.{"\n"}
              • Upcoming plans, your anniversary date and relationship
              details.{"\n"}
              • Quiz, challenge and game progress, and answers that are revealed
              once both of you have completed them.{"\n"}
              • Results you choose to save to Memories.
            </Text>
            <Text style={styles.paragraph}>
              What your partner cannot see:{"\n"}
              • Your "About Them" notes, which are private to you.{"\n"}
              • The identity of the sender of a Secret Crush message you send
              them.
            </Text>
            <Text style={styles.subSectionTitle}>About Secret Crush</Text>
            <Text style={styles.paragraph}>
              The person who receives a Secret Crush message is not shown who
              sent it. However, we store the sender's account ID so that the
              sender can see their sent messages and so that we can look into
              abuse reports. Anyone who has a Secret Crush link can open that
              message, so share links only with the person you intend.
            </Text>

            {/* ── 5. Data Retention and Deletion ─────────────────────── */}
            <Text style={styles.sectionTitle}>
              5. Data Retention and Deletion
            </Text>
            <Text style={styles.paragraph}>
              We keep your data until you delete it or delete your account. You
              can delete your account at any time from Profile → Edit Profile →
              Delete Account within the app, or by contacting us.
            </Text>
            <Text style={styles.paragraph}>
              When you delete your account we delete your profile, your chat
              messages and images, the memories and photos you added, your
              plans, your About Them notes, your quiz, challenge and game
              answers, and the Secret Crush messages you sent. Your partner is
              unlinked. Your partner's own account and their own content are not
              deleted.
            </Text>
            <Text style={styles.paragraph}>
              Basic sign-in logs are kept for up to 30 days after account
              deletion for fraud and abuse prevention, then permanently removed.
              Copies in backups are removed on a rolling basis within a
              reasonable period.
            </Text>

            {/* ── 6. Children's Privacy ───────────────────────────────── */}
            <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Duo Vibe is not directed at children and is not intended for
              anyone under 18. We do not knowingly collect information from
              children. If you believe a child has provided us with personal
              information, please contact us and we will delete it.
            </Text>

            {/* ── 7. Data Security ────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>7. Data Security</Text>
            <Text style={styles.paragraph}>
              We protect your information with encrypted connections (HTTPS/TLS),
              access-controlled database rules (row-level security), and private
              storage for photos and images that are shown only through
              time-limited links to the people who are allowed to see them.
            </Text>
            <Text style={styles.paragraph}>
              Your messages and content are stored on our servers and are not
              end-to-end encrypted. No method of transmission or storage is
              completely secure, and we cannot guarantee absolute security.
            </Text>

            {/* ── 8. Your Choices and Rights ──────────────────────────── */}
            <Text style={styles.sectionTitle}>8. Your Choices and Rights</Text>
            <Text style={styles.paragraph}>
              • Edit your profile and relationship details in the app at any
              time.{"\n"}
              • Delete memories, plans and messages you added.{"\n"}
              • Unlink from your partner at any time.{"\n"}
              • Turn off notifications, or revoke photo access, in your device
              settings.{"\n"}
              • Ask us for a copy of your data or for it to be deleted, by
              contacting us.
            </Text>
            <Text style={styles.paragraph}>
              Depending on where you live, you may have additional rights under
              applicable data protection laws. Contact us to use them.
            </Text>

            {/* ── 9. Reporting Abuse ──────────────────────────────────── */}
            <Text style={styles.sectionTitle}>9. Reporting Abuse</Text>
            <Text style={styles.paragraph}>
              If you receive an abusive, harassing or inappropriate message or
              content, please contact us at the email below with the details. We
              may remove content and suspend or delete accounts that break our
              Terms of Service.
            </Text>

            {/* ── 10. Changes to This Policy ──────────────────────────── */}
            <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will tell
              you about significant changes in the app or by updating the "Last
              updated" date above.
            </Text>

            {/* ── 11. Contact Us ──────────────────────────────────────── */}
            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have questions about this Privacy Policy or your data,
              contact us at:
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
