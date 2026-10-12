import React from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { authStyles } from "./auth-styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth-context";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { GoogleIcon } from "@/src/components/ui/google-icon";

export default function AuthScreen() {
  const router = useRouter();
  const { continueWithGoogle, isLoading } = useAuth();
  const { showAlert } = useAlert();

  const handleContinueWithGoogle = async (): Promise<void> => {
    const res = await continueWithGoogle();
    if (res.cancelled) {
      // User cancelled account picker: show nothing, reset button
      return;
    }
    if (res.error) {
      if (res.error.toLowerCase().includes("cancelled")) {
        return;
      }
      showAlert({
        title: "Authentication Failed",
        message: res.error || "Unable to continue with Google. Please try again.",
      });
      return;
    }
    if (res.user) {
      if (!res.hasPartner) {
        router.replace({
          pathname: ROUTES.INVITE_PARTNER,
          params: { source: "auth" },
        });
      } else {
        router.replace(ROUTES.HOME);
      }
    }
  };

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.MEMORIES);
    }
  };

  return (
    <View style={authStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={authStyles.gradientBackground}
      />

      <SafeAreaView style={authStyles.safeArea}>
        <View style={authStyles.headerRow}>
          <Pressable
            style={authStyles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back to memories"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={authStyles.content}>
          <View style={authStyles.headerTextContainer}>
            <Text style={authStyles.title}>Your space is almost ready</Text>
            <Text style={authStyles.subtitle}>
              Secure your account to keep your shared space safe
            </Text>
          </View>

          <MotiView
            from={{ scale: 0.97, translateY: -4 }}
            animate={{ scale: 1.02, translateY: 4 }}
            transition={{
              type: "timing",
              duration: 2500,
              loop: true,
              repeatReverse: true,
            }}
            style={authStyles.illustrationContainer}
          >
            <Image
              source={require("@/assets/images/heart_in_cloud.png")}
              style={authStyles.illustration}
              resizeMode="contain"
            />
          </MotiView>
        </View>

        <View style={authStyles.footer}>
          <Pressable
            style={authStyles.googleButton}
            onPress={handleContinueWithGoogle}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <View style={authStyles.googleIconContainer}>
                  <GoogleIcon />
                </View>
                <Text style={authStyles.googleButtonText}>
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>

          <View style={authStyles.termsContainer}>
            <Text style={authStyles.termsText}>
              By continuing, you agree to our{" "}
              <Text
                style={authStyles.termsLink}
                onPress={() => router.push(ROUTES.TERMS)}
                accessibilityRole="link"
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={authStyles.termsLink}
                onPress={() => router.push(ROUTES.PRIVACY)}
                accessibilityRole="link"
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
