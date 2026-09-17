import { useState, useEffect, useCallback } from "react";
import { Share, BackHandler } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { useCountdown } from "@/src/hooks/use-countdown";
import { InvitePartnerParams } from "./types";

export function useInvitePartner() {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string }>();
  const isFromHome = params.source === "home";
  const { inviteCode, codeExpiresAt, refreshInviteCode, connectPartnerCode } =
    useAuth();
  const { showAlert } = useAlert();
  const [partnerCode, setPartnerCode] = useState<string>("");
  const { timeLeft, reset, formatMinutesSeconds, isFinished } =
    useCountdown(codeExpiresAt);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    reset(codeExpiresAt);
  }, [codeExpiresAt, reset]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [router]),
  );

  const handleRefreshCode = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await refreshInviteCode();
    } catch (err: unknown) {
      console.warn("Error refreshing code:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShareInvite = async (): Promise<void> => {
    try {
      await Share.share({
        message: `Join me on Duo Vibe! 💕 Connect our shared space using my invite code: ${inviteCode}\nDownload the app to get started!`,
      });
    } catch (err: unknown) {
      console.warn("Share action error:", err);
    }
  };

  const handlePasteCode = async (): Promise<void> => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        const cleaned = text.trim().toUpperCase().slice(0, 6);
        if (cleaned.length > 0) {
          setPartnerCode(cleaned);
        } else {
          showAlert({
            title: "Clipboard Empty",
            message: "No code found in clipboard.",
          });
        }
      } else {
        showAlert({
          title: "Clipboard Empty",
          message: "No code found in clipboard.",
        });
      }
    } catch (err: unknown) {
      showAlert({
        title: "Clipboard Error",
        message: "Unable to access clipboard. Please type code manually.",
      });
      console.warn("Clipboard read error:", err);
    }
  };

  const handleConnect = async (): Promise<void> => {
    if (!partnerCode.trim()) {
      showAlert({
        title: "Partner Code Required",
        message: "Please enter your partner's 6-character code.",
      });
      return;
    }
    setIsConnecting(true);
    try {
      const result = await connectPartnerCode(partnerCode);
      if (result.success) {
        router.replace(ROUTES.HOME);
      } else {
        showAlert({
          title: "Connection Failed",
          message:
            result.message ||
            "Could not connect with partner. Please try again.",
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      showAlert({
        title: "Connection Error",
        message: msg,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDoItLater = (): void => {
    router.replace(ROUTES.HOME);
  };

  const handleBack = (): void => {
    router.replace(ROUTES.HOME);
  };

  return {
    isFromHome,
    inviteCode,
    partnerCode,
    setPartnerCode,
    timeLeft,
    isFinished,
    isRefreshing,
    isConnecting,
    formatMinutesSeconds,
    handleRefreshCode,
    handleShareInvite,
    handlePasteCode,
    handleConnect,
    handleDoItLater,
    handleBack,
  };
}
