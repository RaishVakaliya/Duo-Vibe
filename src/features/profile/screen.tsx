import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import {
  BottomTabBar,
} from "@/src/components/navigation/bottom-tab-bar";
import { getInitial } from "@/src/lib/profile";
import { useProfileData } from "./use-profile-data";
import { ProfileMenuItem } from "./components/profile-menu-item";

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    userName,
    avatarUrl,
    hasPartner,
    partnerName,
    isLongDistance,
    pushNotificationsEnabled,
    isActionLoading,
    actionLoadingMessage,
    appVersion,
    appBuildNumber,
    handleToggleRelationship,
    handleRelationshipCardPress,
    handleToggleNotifications,
    handleSupportEmail,
    handleSignOut,
    handleDeleteAccount,
    handleTabPress,
  } = useProfileData();

  const renderAvatarContent = () => {
    if (avatarUrl) {
      return (
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      );
    }
    return <Text style={styles.avatarLetter}>{getInitial(userName)}</Text>;
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
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace(ROUTES.HOME)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Go back to Home"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerPlaceholder} />

          <Pressable
            style={styles.topEditButton}
            onPress={() => router.push(ROUTES.EDIT_PROFILE)}
            accessibilityRole="button"
            accessibilityLabel="Edit profile name and picture"
          >
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 350 }}
            style={styles.profileHero}
          >
            <View style={styles.avatarRing}>
              <View style={styles.avatarInner}>{renderAvatarContent()}</View>
            </View>

            <Text style={styles.userName}>
              {userName?.trim() || "Duo Partner"}
            </Text>

            {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}

            {hasPartner ? (
              <View style={styles.partnerStatusPill}>
                <View style={styles.partnerStatusDot} />
                <Text style={styles.partnerStatusText}>
                  {partnerName
                    ? `Connected with ${partnerName}`
                    : "Connected Space"}
                </Text>
              </View>
            ) : (
              <Pressable
                style={styles.waitingStatusPill}
                onPress={() =>
                  router.push({
                    pathname: ROUTES.INVITE_PARTNER,
                    params: { source: "profile" },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel="Invite partner"
              >
                <View style={styles.waitingStatusDot} />
                <Text style={styles.waitingStatusText}>Waiting for partner</Text>
                <Text style={styles.waitingInviteLink}>Invite</Text>
              </Pressable>
            )}
          </MotiView>

          <Text style={styles.relationSectionTitle}>Relationship Type</Text>
          <Pressable
            style={styles.relationCard}
            onPress={handleRelationshipCardPress}
            accessibilityRole="button"
            accessibilityLabel="Relationship Type switch"
          >
            <View style={styles.relationLeft}>
              <View style={styles.relationIconCol}>
                <Ionicons name="globe-outline" size={22} color="#FF7A59" />
              </View>
              <View style={styles.relationTextCol}>
                <Text style={styles.relationTitle}>
                  {isLongDistance ? "Long Distance" : "Local"}
                </Text>
                <Text style={styles.relationSubtitle}>
                  {hasPartner
                    ? "Tap switch to toggle Local / Long Distance"
                    : "Pair with a partner to change this"}
                </Text>
              </View>
            </View>
            <Switch
              value={isLongDistance}
              onValueChange={handleToggleRelationship}
              disabled={!hasPartner}
              trackColor={{
                false: "rgba(255, 255, 255, 0.15)",
                true: "#FF4D6D",
              }}
              thumbColor="#FFFFFF"
            />
          </Pressable>

          <Text style={styles.sectionHeader}>Preferences</Text>
          <View style={styles.settingsGroup}>
            <View style={styles.settingsRow}>
              <View style={styles.settingsRowContent}>
                <Text style={styles.settingsRowTitle}>Push Notifications</Text>
                <Text style={styles.settingsRowSubtitle}>
                  Daily sparks & partner activity alerts
                </Text>
              </View>
              <Switch
                value={pushNotificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{
                  false: "rgba(255, 255, 255, 0.15)",
                  true: "#FF4D6D",
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Feedback & Support</Text>
          <View style={styles.settingsGroup}>
            <ProfileMenuItem
              title="About the App"
              subtitle="Our story and mission"
              onPress={() => router.push(ROUTES.ABOUT)}
              accessibilityLabel="About Duo Vibe"
              hasBorder
            />
            <ProfileMenuItem
              title="Provide Feedback"
              subtitle="Share your thoughts & suggestions"
              onPress={() => router.push(ROUTES.FEEDBACK)}
              accessibilityLabel="Provide Feedback"
              hasBorder
            />
            <ProfileMenuItem
              title="Support Email"
              subtitle="support@duovibe.app"
              onPress={handleSupportEmail}
              accessibilityLabel="Support Email"
            />
          </View>

          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.settingsGroup}>
            <ProfileMenuItem
              title="Terms of Service"
              onPress={() => router.push(ROUTES.TERMS)}
              accessibilityLabel="Terms of Service"
              hasBorder
            />
            <ProfileMenuItem
              title="Privacy Policy"
              onPress={() => router.push(ROUTES.PRIVACY)}
              accessibilityLabel="Privacy Policy"
            />
          </View>

          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.settingsGroup}>
            <ProfileMenuItem
              title="Sign Out"
              subtitle="Log out of your account"
              onPress={handleSignOut}
              disabled={isActionLoading}
              accessibilityLabel="Sign Out"
              hasBorder
            />
            <ProfileMenuItem
              title="Delete Account"
              subtitle="Permanently remove account & unlink partner"
              onPress={handleDeleteAccount}
              disabled={isActionLoading}
              accessibilityLabel="Delete Account"
              isDestructive
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.versionText}>
              Version {appVersion} • Build {appBuildNumber}
            </Text>
            <Text style={styles.copyrightText}>
              Duo Vibe • Crafted for couples
            </Text>
          </View>
        </ScrollView>

        <BottomTabBar activeTab={4} onTabPress={handleTabPress} />

        {isActionLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#FF4D6D" />
              <Text style={styles.loadingText}>
                {actionLoadingMessage || "Please wait..."}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
