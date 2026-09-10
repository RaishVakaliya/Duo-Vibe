import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { homeStyles } from "@/styles/home.styles";
import { GRADIENTS } from "@/constants/colors";
import { useAuth } from "@/context/auth";

export default function HomeScreen() {
  const router = useRouter();
  const { hasPartner, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/welcome");
  };

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={homeStyles.gradientBackground}
      />

      <SafeAreaView style={homeStyles.safeArea}>
        <View style={homeStyles.header}>
          <View style={homeStyles.greetingContainer}>
            <Text style={homeStyles.appName}>Duo Vibe</Text>
            <View style={homeStyles.statusBadge}>
              <Ionicons
                name={hasPartner ? "heart" : "time-outline"}
                size={12}
                color="#FF8FA3"
              />
              <Text style={homeStyles.statusText}>
                {hasPartner ? "Connected Space 💕" : "Partner Pending"}
              </Text>
            </View>
          </View>

          <View style={homeStyles.avatarPair}>
            <View style={homeStyles.avatarCircle}>
              <Text style={homeStyles.avatarLetter}>U</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={homeStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={homeStyles.sparkCard}
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={homeStyles.sparkGradient}
            >
              <View style={homeStyles.sparkHeader}>
                <Text style={homeStyles.sparkTag}>Daily Spark</Text>
                <Ionicons name="sparkles" size={18} color="#FFE4E6" />
              </View>
              <Text style={homeStyles.sparkQuestion}>
                "What's one small moment from this week that made you smile
                thinking of me?"
              </Text>
              <Pressable style={homeStyles.sparkButton}>
                <Text style={homeStyles.sparkButtonText}>
                  Answer Daily Prompt
                </Text>
              </Pressable>
            </LinearGradient>
          </MotiView>

          <Text style={homeStyles.sectionTitle}>Explore Together</Text>

          <View style={homeStyles.gridRow}>
            <Pressable
              style={homeStyles.menuCard}
              onPress={() => router.push("/date-ideas")}
            >
              <View
                style={[
                  homeStyles.iconBox,
                  { backgroundColor: "rgba(249, 115, 22, 0.15)" },
                ]}
              >
                <Ionicons name="flame" size={22} color="#F97316" />
              </View>
              <Text style={homeStyles.menuCardTitle}>Date Ideas</Text>
              <Text style={homeStyles.menuCardSubtitle}>
                Swipe & pick your next date adventure
              </Text>
            </Pressable>

            <Pressable
              style={homeStyles.menuCard}
              onPress={() => router.push("/play-compare")}
            >
              <View
                style={[
                  homeStyles.iconBox,
                  { backgroundColor: "rgba(139, 92, 246, 0.15)" },
                ]}
              >
                <Ionicons name="game-controller" size={22} color="#8B5CF6" />
              </View>
              <Text style={homeStyles.menuCardTitle}>Couple Games</Text>
              <Text style={homeStyles.menuCardSubtitle}>
                Compare answers & play quizzes
              </Text>
            </Pressable>
          </View>

          <View style={homeStyles.gridRow}>
            <Pressable
              style={homeStyles.menuCard}
              onPress={() => router.push("/memories")}
            >
              <View
                style={[
                  homeStyles.iconBox,
                  { backgroundColor: "rgba(236, 72, 153, 0.15)" },
                ]}
              >
                <Ionicons name="images" size={22} color="#EC4899" />
              </View>
              <Text style={homeStyles.menuCardTitle}>Memories</Text>
              <Text style={homeStyles.menuCardSubtitle}>
                Your shared scrapbook of love moments
              </Text>
            </Pressable>

            <Pressable
              style={homeStyles.menuCard}
              onPress={() => router.push("/invite-partner")}
            >
              <View
                style={[
                  homeStyles.iconBox,
                  { backgroundColor: "rgba(56, 189, 248, 0.15)" },
                ]}
              >
                <Ionicons name="people" size={22} color="#38BDF8" />
              </View>
              <Text style={homeStyles.menuCardTitle}>Partner Code</Text>
              <Text style={homeStyles.menuCardSubtitle}>
                Share or enter invite code
              </Text>
            </Pressable>
          </View>

          {!hasPartner && (
            <MotiView
              from={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 500, delay: 200 }}
              style={homeStyles.inviteBanner}
            >
              <View style={homeStyles.inviteBannerTextContainer}>
                <Text style={homeStyles.inviteBannerTitle}>
                  Your partner hasn't joined yet
                </Text>
                <Text style={homeStyles.inviteBannerSubtitle}>
                  Invite them now so you can unlock answers together!
                </Text>
              </View>
              <Pressable
                style={homeStyles.inviteBannerButton}
                onPress={() => router.push("/invite-partner")}
              >
                <Text style={homeStyles.inviteBannerButtonText}>Invite</Text>
              </Pressable>
            </MotiView>
          )}

          <Pressable style={homeStyles.signOutRow} onPress={handleSignOut}>
            <Text style={homeStyles.signOutText}>Sign Out</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
