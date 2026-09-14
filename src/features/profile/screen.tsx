import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Switch,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import { styles } from "./styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { supabase } from "@/src/lib/supabase";
import { registerForPushNotificationsAsync } from "@/src/lib/notifications";
import {
  BottomTabBar,
  TabItem,
} from "@/src/components/navigation/bottom-tab-bar";

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    userName,
    avatarUrl,
    hasPartner,
    relationshipType,
    setRelationshipType,
    signOut,
    deleteAccount,
  } = useAuth();
  const { showAlert } = useAlert();

  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState<string | null>(null);

  const appVersion = Constants?.expoConfig?.version ?? "1.0.0";
  const appBuildNumber =
    Constants?.expoConfig?.android?.versionCode ??
    Constants?.expoConfig?.ios?.buildNumber ??
    "1";

  const isUrl = (val: string | null): boolean => {
    if (!val) return false;
    return (
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("file://") ||
      val.startsWith("data:")
    );
  };

  const getInitial = (name: string | null): string => {
    if (!name || !name.trim()) return "D";
    return name.trim().charAt(0).toUpperCase();
  };

  // Fetch actual partner name if connected
  useEffect(() => {
    if (!user || !hasPartner) return;
    const fetchPartnerProfile = async () => {
      try {
        const { data: myProfile } = await supabase
          .from("profiles")
          .select("partner_id")
          .eq("id", user.id)
          .maybeSingle();

        let partnerId = myProfile?.partner_id;
        if (!partnerId) {
          const { data: couple } = await supabase
            .from("couples")
            .select("user1_id, user2_id")
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .eq("status", "connected")
            .maybeSingle();
          if (couple) {
            partnerId =
              couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
          }
        }

        if (partnerId) {
          const { data: pProfile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", partnerId)
            .maybeSingle();
          if (pProfile?.full_name) {
            setPartnerName(pProfile.full_name);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch partner info:", err);
      }
    };
    fetchPartnerProfile();
  }, [user, hasPartner]);

  // Handle relationship type toggle
  const handleToggleRelationship = async (isLongDistance: boolean): Promise<void> => {
    if (!hasPartner) {
      showAlert({
        title: "Partner Required",
        message: "Pair with a partner first to change your relationship type 💕",
      });
      return;
    }
    Haptics.selectionAsync();
    const newType = isLongDistance ? "long_distance" : "local";
    await setRelationshipType(newType);
  };

  const handleRelationshipCardPress = (): void => {
    if (!hasPartner) {
      showAlert({
        title: "Partner Required",
        message: "Pair with a partner first to change your relationship type 💕",
      });
    }
  };

  const handleToggleNotifications = async (value: boolean): Promise<void> => {
    setPushNotificationsEnabled(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (value && user) {
      try {
        await registerForPushNotificationsAsync(user.id);
      } catch (err) {
        console.warn("Error re-registering push token:", err);
      }
    }
  };

  const handleSupportEmail = async (): Promise<void> => {
    const email = "support@duovibe.app";
    const subject = encodeURIComponent("Duo Vibe App Support");
    const mailtoUrl = `mailto:${email}?subject=${subject}`;
    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        showAlert({
          title: "Support Email",
          message: `Reach out to our support team at: ${email}`,
        });
      }
    } catch {
      showAlert({
        title: "Support Email",
        message: `Reach out to our support team at: ${email}`,
      });
    }
  };

  const handleSignOut = (): void => {
    showAlert({
      title: "Sign Out",
      message: "Are you sure you want to sign out of Duo Vibe?",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setIsActionLoading(true);
            try {
              await signOut();
              router.replace(ROUTES.WELCOME);
            } catch {
              showAlert({
                title: "Error",
                message: "Failed to sign out. Please try again.",
              });
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ],
    });
  };

  const handleDeleteAccount = (): void => {
    showAlert({
      title: "Delete Account",
      message:
        "Are you sure you want to permanently delete your Duo Vibe account? This will disconnect your partner and erase your private data.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsActionLoading(true);
            try {
              await deleteAccount();
              router.replace(ROUTES.WELCOME);
            } catch {
              showAlert({
                title: "Error",
                message: "Failed to delete account. Please try again.",
              });
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ],
    });
  };

  const handleTabPress = (_index: number, item: TabItem): void => {
    switch (item.id) {
      case "home":
        router.replace(ROUTES.HOME);
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
        break;
    }
  };

  const renderAvatarContent = () => {
    if (avatarUrl && isUrl(avatarUrl)) {
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

  const isLongDistance = relationshipType === "long_distance";

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
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
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
                    ? `Connected with ${partnerName} 💕`
                    : "Connected Space 💕"}
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
                <Text style={styles.waitingInviteLink}>Invite 🔗</Text>
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
            <Pressable
              style={[styles.settingsRow, styles.settingsRowBorder]}
              onPress={() => router.push(ROUTES.ABOUT)}
              accessibilityRole="button"
              accessibilityLabel="About Duo Vibe"
            >
              <View style={styles.settingsRowContent}>
                <Text style={styles.settingsRowTitle}>About the App</Text>
                <Text style={styles.settingsRowSubtitle}>
                  Our story and mission
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>

            <Pressable
              style={[styles.settingsRow, styles.settingsRowBorder]}
              onPress={() => router.push(ROUTES.FEEDBACK)}
              accessibilityRole="button"
              accessibilityLabel="Provide Feedback"
            >
              <View style={styles.settingsRowContent}>
                <Text style={styles.settingsRowTitle}>Provide Feedback</Text>
                <Text style={styles.settingsRowSubtitle}>
                  Share your thoughts & suggestions
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>

            <Pressable
              style={styles.settingsRow}
              onPress={handleSupportEmail}
              accessibilityRole="button"
              accessibilityLabel="Support Email"
            >
              <View style={styles.settingsRowContent}>
                <Text style={styles.settingsRowTitle}>Support Email</Text>
                <Text style={styles.settingsRowSubtitle}>
                  support@duovibe.app
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>
          </View>

          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.settingsGroup}>
            <Pressable
              style={[styles.settingsRow, styles.settingsRowBorder]}
              onPress={() => router.push(ROUTES.TERMS)}
              accessibilityRole="button"
              accessibilityLabel="Terms of Service"
            >
              <View style={styles.settingsRowContent}>
                <Text style={styles.settingsRowTitle}>Terms of Service</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>

            <Pressable
              style={styles.settingsRow}
              onPress={() => router.push(ROUTES.PRIVACY)}
              accessibilityRole="button"
              accessibilityLabel="Privacy Policy"
            >
              <View style={styles.settingsRowContent}>
                <Text style={styles.settingsRowTitle}>Privacy Policy</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>
          </View>

          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.settingsGroup}>
            <Pressable
              style={[styles.settingsRow, styles.settingsRowBorder]}
              onPress={handleSignOut}
              disabled={isActionLoading}
              accessibilityRole="button"
              accessibilityLabel="Sign Out"
            >
              <View style={styles.settingsRowContent}>
                <Text style={styles.settingsRowTitle}>Sign Out</Text>
                <Text style={styles.settingsRowSubtitle}>
                  Log out of your account
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>

            <Pressable
              style={styles.settingsRow}
              onPress={handleDeleteAccount}
              disabled={isActionLoading}
              accessibilityRole="button"
              accessibilityLabel="Delete Account"
            >
              <View style={styles.settingsRowContent}>
                <Text style={[styles.settingsRowTitle, styles.destructiveText]}>
                  Delete Account
                </Text>
                <Text style={styles.settingsRowSubtitle}>
                  Permanently remove account & unlink partner
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(239, 68, 68, 0.5)"
              />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.versionText}>
              Version {appVersion} • Build {appBuildNumber}
            </Text>
            <Text style={styles.copyrightText}>
              Duo Vibe • Made with 💕 for couples
            </Text>
          </View>
        </ScrollView>

        <BottomTabBar activeTab={4} onTabPress={handleTabPress} />
      </SafeAreaView>
    </View>
  );
}
