import React, { useState, useCallback } from "react";
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
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { useAlert } from "@/src/components/ui/alert-dialog";

export default function HomeScreen() {
  const router = useRouter();
  const { hasPartner, signOut } = useAuth();
  const { showAlert } = useAlert();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
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
            <View style={styles.titleRow}>
              <Image
                source={require("@/assets/icon-nobg.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Duo Vibe</Text>
            </View>
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

          <View style={styles.avatarPair}>
            <View
              style={styles.avatarCircle}
              accessibilityLabel="User Profile Avatar"
            >
              <Text style={styles.avatarLetter}>U</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={styles.sparkCard}
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sparkGradient}
            >
              <View style={styles.sparkHeader}>
                <Text style={styles.sparkTag}>Daily Spark</Text>
                <Ionicons name="sparkles" size={18} color="#FFE4E6" />
              </View>
              <Text style={styles.sparkQuestion}>
                {
                  '"What\'s one small moment from this week that made you smile thinking of me?"'
                }
              </Text>
              <Pressable
                style={styles.sparkButton}
                accessibilityRole="button"
                accessibilityLabel="Answer daily spark prompt"
                onPress={() => router.push(ROUTES.PLAY_COMPARE)}
              >
                <Text style={styles.sparkButtonText}>Answer Daily Prompt</Text>
              </Pressable>
            </LinearGradient>
          </MotiView>

          <Text style={styles.sectionTitle}>Explore Together</Text>

          <View style={styles.gridRow}>
            <Pressable
              style={styles.menuCard}
              onPress={() => router.push(ROUTES.DATE_IDEAS)}
              accessibilityRole="button"
              accessibilityLabel="Explore Date Ideas"
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(249, 115, 22, 0.15)" },
                ]}
              >
                <Ionicons name="flame" size={22} color="#F97316" />
              </View>
              <Text style={styles.menuCardTitle}>Date Ideas</Text>
              <Text style={styles.menuCardSubtitle}>
                Swipe & pick your next date adventure
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuCard}
              onPress={() => router.push(ROUTES.PLAY_COMPARE)}
              accessibilityRole="button"
              accessibilityLabel="Explore Couple Games"
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(139, 92, 246, 0.15)" },
                ]}
              >
                <Ionicons name="game-controller" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.menuCardTitle}>Couple Games</Text>
              <Text style={styles.menuCardSubtitle}>
                Compare answers & play quizzes
              </Text>
            </Pressable>
          </View>

          <View style={styles.gridRow}>
            <Pressable
              style={styles.menuCard}
              onPress={() => router.push(ROUTES.MEMORIES)}
              accessibilityRole="button"
              accessibilityLabel="View Memories Scrapbook"
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(236, 72, 153, 0.15)" },
                ]}
              >
                <Ionicons name="images" size={22} color="#EC4899" />
              </View>
              <Text style={styles.menuCardTitle}>Memories</Text>
              <Text style={styles.menuCardSubtitle}>
                Your shared scrapbook of love moments
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuCard}
              onPress={() =>
                router.push({
                  pathname: ROUTES.INVITE_PARTNER,
                  params: { source: "home" },
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Open Partner Code screen"
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(56, 189, 248, 0.15)" },
                ]}
              >
                <Ionicons name="people" size={22} color="#38BDF8" />
              </View>
              <Text style={styles.menuCardTitle}>Partner Code</Text>
              <Text style={styles.menuCardSubtitle}>
                Share or enter invite code
              </Text>
            </Pressable>
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
                  Invite them now so you can unlock answers together!
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
      </SafeAreaView>
    </View>
  );
}
