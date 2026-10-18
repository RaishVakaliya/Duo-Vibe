import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { useHomeData } from "./use-home-data";
import { RedGreenFlagBanner } from "./components/red-green-flag-banner";
import { LoveToolsGrid } from "./components/love-tools-grid";
import { TodaysCard } from "./components/todays-card";
import { useDeferredReady } from "@/src/hooks/use-deferred-ready";

export default function HomeScreen() {
  const contentReady = useDeferredReady();
  const {
    hasPartner,
    greetingData,
    pendingReviews,
    handleToolPress,
    handleReviewPress,
    handleInvitePress,
    handleCardPress,
    handleRedGreenFlagPress,
  } = useHomeData();

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
          <View style={styles.greetingContainer}>
            <Text style={styles.appName}>Duo Vibe</Text>
            <View style={styles.statusBadge}>
              <Ionicons
                name={hasPartner ? "heart" : "time-outline"}
                size={12}
                color="#FF8FA3"
              />
              <Text style={styles.statusText}>
                {hasPartner ? "Connected Space" : "Partner Pending"}
              </Text>
            </View>
          </View>

          <Image
            source={require("@/assets/images/icon-nobg.png")}
            style={styles.headerLogo}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={150}
            accessibilityLabel="Duo Vibe Logo"
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: contentReady ? 0 : 1, translateY: contentReady ? 10 : 0 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: contentReady ? 280 : 0 }}
            style={styles.greetingSection}
          >
            <View style={styles.greetingTitleRow}>
              <Text style={styles.greetingTitle}>{greetingData.greeting}</Text>
              <Text style={styles.greetingEmoji}>{greetingData.emoji}</Text>
            </View>
            <Text style={styles.greetingSubtitle}>
              {"Let's find out what your heart is trying to say today..."}
            </Text>
          </MotiView>

          {contentReady && pendingReviews.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 280 }}
              style={styles.pendingReviewCard}
            >
              <View style={styles.pendingReviewLeft}>
                <View style={styles.pendingReviewIconWrap}>
                  <Ionicons name="clipboard" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.pendingReviewTextWrap}>
                  <Text style={styles.pendingReviewTitle}>
                    Partner Quiz Ready
                  </Text>
                  <Text style={styles.pendingReviewSubtitle}>
                    Your partner submitted a Couple Quiz. Tap to review.
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.pendingReviewButton}
                onPress={handleReviewPress}
                accessibilityRole="button"
                accessibilityLabel="Review quiz answers"
              >
                <Text style={styles.pendingReviewButtonText}>Review</Text>
              </Pressable>
            </MotiView>
          )}

          {contentReady && (
            <>
          <RedGreenFlagBanner onPress={handleRedGreenFlagPress} />

          <LoveToolsGrid onToolPress={handleToolPress} />

          <TodaysCard onPress={handleCardPress} />
            </>
          )}

          {contentReady && !hasPartner && (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 280 }}
              style={styles.inviteBanner}
            >
              <View style={styles.inviteBannerTextContainer}>
                <Text style={styles.inviteBannerTitle}>
                  {"Your partner hasn't joined yet"}
                </Text>
                <Text style={styles.inviteBannerSubtitle}>
                  Invite them now to unlock cards and answers together!
                </Text>
              </View>
              <Pressable
                style={styles.inviteBannerButton}
                onPress={handleInvitePress}
                accessibilityRole="button"
                accessibilityLabel="Invite Partner"
              >
                <Text style={styles.inviteBannerButtonText}>Invite</Text>
              </Pressable>
            </MotiView>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
