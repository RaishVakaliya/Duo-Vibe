import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { LoveToolItem } from "./types";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { useAlert } from "@/src/components/ui/alert-dialog";
import {
  BottomTabBar,
  TabItem,
} from "@/src/components/navigation/bottom-tab-bar";

const LOVE_TOOLS: readonly LoveToolItem[] = [
  {
    id: "love-match",
    title: "Love Match",
    icon: "heart",
    iconColor: "#FF4D6D",
    backgroundColor: "rgba(255, 77, 109, 0.12)",
    borderColor: "rgba(255, 77, 109, 0.25)",
    route: ROUTES.LOVE_MATCH,
  },
  {
    id: "crush-test",
    title: "Crush Test",
    icon: "flame",
    iconColor: "#FF7A00",
    backgroundColor: "rgba(255, 122, 0, 0.12)",
    borderColor: "rgba(255, 122, 0, 0.25)",
    route: ROUTES.CRUSH_CALCULATOR,
  },
  {
    id: "couple-quiz",
    title: "Couple Quiz",
    icon: "people",
    iconColor: "#A855F7",
    backgroundColor: "rgba(168, 85, 247, 0.12)",
    borderColor: "rgba(168, 85, 247, 0.25)",
    route: ROUTES.PLAY_COMPARE,
  },
  {
    id: "21-questions",
    title: "21 Questions",
    icon: "chatbubble-ellipses",
    iconColor: "#0EA5E9",
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    borderColor: "rgba(14, 165, 233, 0.25)",
    route: ROUTES.TWENTY_ONE_QUESTIONS,
  },
  {
    id: "secret-crush",
    title: "Secret Crush",
    icon: "mail",
    iconColor: "#F43F5E",
    backgroundColor: "rgba(244, 63, 94, 0.12)",
    borderColor: "rgba(244, 63, 94, 0.25)",
    route: ROUTES.MEMORIES,
  },
  {
    id: "couple-challenge",
    title: "Couple Challenge",
    icon: "calendar",
    iconColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.25)",
    route: ROUTES.DATE_IDEAS,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { hasPartner, signOut } = useAuth();
  const { showAlert } = useAlert();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  const greetingData = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { greeting: "Good Morning", emoji: "☀️" };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good Afternoon", emoji: "🌤️" };
    } else if (hour >= 17 && hour < 21) {
      return { greeting: "Good Evening", emoji: "👋" };
    } else {
      return { greeting: "Good Night", emoji: "🌙" };
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setActiveTab(0);
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const handleSignOut = async (): Promise<void> => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace(ROUTES.WELCOME);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign out.";
      showAlert({
        title: "Sign Out Error",
        message,
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleTabPress = (index: number, item: TabItem): void => {
    setActiveTab(index);
    switch (item.id) {
      case "home":
        break;
      case "games":
        router.push(ROUTES.PLAY_COMPARE);
        break;
      case "chat":
        router.push(ROUTES.DATE_IDEAS);
        break;
      case "memories":
        router.push(ROUTES.MEMORIES);
        break;
      case "profile":
        router.push({
          pathname: ROUTES.INVITE_PARTNER,
          params: { source: "home" },
        });
        break;
    }
  };

  const handleToolPress = (tool: LoveToolItem): void => {
    if (tool.route) {
      router.push(tool.route);
    }
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
                {hasPartner ? "Connected Space 💕" : "Partner Pending"}
              </Text>
            </View>
          </View>

          <Image
            source={require("@/assets/icon-nobg.png")}
            style={styles.headerLogo}
            resizeMode="contain"
            accessibilityLabel="Duo Vibe Logo"
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
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

          <MotiView
            from={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 450, delay: 100 }}
            style={styles.heroCard}
          >
            <Pressable
              onPress={() => router.push(ROUTES.PLAY_COMPARE)}
              accessibilityRole="button"
              accessibilityLabel="Red flag or green flag couple game"
            >
              <LinearGradient
                colors={["#E11D48", "#BE123C", "#881337"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={styles.heroFlagsRow}>
                  <View style={styles.heroFlagBadgeLeft}>
                    <Ionicons name="flag" size={14} color="#FF6B81" />
                    <Text style={styles.heroFlagText}>Red Flag</Text>
                  </View>
                  <View style={styles.heroFlagBadgeRight}>
                    <Ionicons name="flag" size={14} color="#4ADE80" />
                    <Text style={styles.heroFlagText}>Green Flag</Text>
                  </View>
                </View>

                <View style={styles.heroCenterContent}>
                  <Text style={styles.heroTitle}>
                    {"Red Flag\nor\nGreen Flag?"}
                  </Text>
                  <Text style={styles.heroSubtitle}>
                    {"Is it a red flag or a green flag?\nFind out now.."}
                  </Text>
                </View>

                <View style={styles.heroFooter}>
                  <View style={styles.heroPlayBadge}>
                    <Ionicons name="play" size={14} color="#E11D48" />
                    <Text style={styles.heroPlayText}>Play now</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </MotiView>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={18} color="#FF4D6D" />
              <Text style={styles.sectionTitle}>Love Tools</Text>
            </View>

            <View style={styles.toolsGrid}>
              {LOVE_TOOLS.map((tool, idx) => (
                <MotiView
                  key={tool.id}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: "timing",
                    duration: 350,
                    delay: 150 + idx * 40,
                  }}
                  style={[
                    styles.toolCard,
                    {
                      backgroundColor: tool.backgroundColor,
                      borderColor: tool.borderColor,
                    },
                  ]}
                >
                  <Pressable
                    style={{ alignItems: "center", width: "100%" }}
                    onPress={() => handleToolPress(tool)}
                    accessibilityRole="button"
                    accessibilityLabel={tool.title}
                  >
                    <View
                      style={[
                        styles.toolIconContainer,
                        { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                      ]}
                    >
                      <Ionicons
                        name={tool.icon}
                        size={22}
                        color={tool.iconColor}
                      />
                    </View>
                    <Text style={styles.toolTitle} numberOfLines={2}>
                      {tool.title}
                    </Text>
                  </Pressable>
                </MotiView>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles" size={18} color="#FF4D6D" />
              <Text style={styles.sectionTitle}>{"Today's Card"}</Text>
            </View>

            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 350 }}
            >
              <Pressable
                style={styles.todaysCard}
                onPress={() => router.push(ROUTES.PLAY_COMPARE)}
                accessibilityRole="button"
                accessibilityLabel="Answer Today's Prompt Card"
              >
                <View style={styles.todaysCardLeft}>
                  <Text style={styles.todaysCardQuote}>
                    {
                      '"What\'s one thing you secretly want your partner to understand?"'
                    }
                  </Text>
                  <Text style={styles.todaysCardTapPrompt}>
                    {"Tap to reveal & answer 💌"}
                  </Text>
                </View>

                <View style={styles.todaysCardRight}>
                  <Ionicons name="albums" size={24} color="#FF4D6D" />
                </View>
              </Pressable>
            </MotiView>
          </View>

          {!hasPartner && (
            <MotiView
              from={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 500, delay: 200 }}
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
                onPress={() =>
                  router.push({
                    pathname: ROUTES.INVITE_PARTNER,
                    params: { source: "home" },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel="Invite Partner"
              >
                <Text style={styles.inviteBannerButtonText}>Invite</Text>
              </Pressable>
            </MotiView>
          )}

          <Pressable
            style={styles.signOutRow}
            onPress={handleSignOut}
            disabled={isSigningOut}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            accessibilityRole="button"
            accessibilityLabel="Sign Out of Account"
          >
            {isSigningOut ? (
              <ActivityIndicator color="#FF8FA3" size="small" />
            ) : (
              <Text style={styles.signOutText}>Sign Out</Text>
            )}
          </Pressable>
        </ScrollView>

        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </SafeAreaView>
    </View>
  );
}
