import { useState, useEffect } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth-context";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { getPartnerId } from "@/src/lib/quiz";
import { usePartnerProfile } from "@/src/lib/shared/profileCache";
import { registerForPushNotificationsAsync } from "@/src/lib/notifications";
import { TabItem } from "@/src/components/navigation/bottom-tab-bar";

export function useProfileData() {
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
  const [actionLoadingMessage, setActionLoadingMessage] = useState<string>("");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const partnerProfile = usePartnerProfile(partnerId ?? undefined);
  const partnerName = partnerProfile?.full_name ?? null;

  const appVersion = Constants?.expoConfig?.version ?? "1.0.0";
  const appBuildNumber =
    Constants?.expoConfig?.android?.versionCode ??
    Constants?.expoConfig?.ios?.buildNumber ??
    "1";

  // Resolve partner id once; profile is cached by usePartnerProfile
  useEffect(() => {
    if (!user || !hasPartner) { setPartnerId(null); return; }
    getPartnerId(user.id).then((pid) => setPartnerId(pid)).catch(() => {});
  }, [user, hasPartner]);

  const handleToggleRelationship = async (
    isLongDistance: boolean,
  ): Promise<void> => {
    if (!hasPartner) {
      showAlert({
        title: "Partner Required",
        message: "Pair with a partner first to change your relationship type.",
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
        message: "Pair with a partner first to change your relationship type.",
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
            setActionLoadingMessage("Signing out...");
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
              setActionLoadingMessage("");
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
            setActionLoadingMessage("Deleting account...");
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
              setActionLoadingMessage("");
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
      case "connect":
        router.replace(ROUTES.CONNECT);
        break;
      case "chat":
        router.replace(ROUTES.CHAT);
        break;
      case "memories":
        router.replace(ROUTES.MEMORIES);
        break;
      case "profile":
        break;
    }
  };

  const isLongDistance = relationshipType === "long_distance";

  return {
    user,
    userName,
    avatarUrl,
    hasPartner,
    partnerName,
    relationshipType,
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
  };
}
