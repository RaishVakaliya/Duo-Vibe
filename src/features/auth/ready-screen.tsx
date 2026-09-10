import React from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { readyStyles } from "./ready-styles";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/context/auth";
import { useAlert } from "@/src/components/ui/alert-dialog";
import { GoogleIcon } from "@/src/components/ui/google-icon";

export default function ReadyScreen() {
  const router = useRouter();
  const { signInWithGoogle, isLoading } = useAuth();
  const { showAlert } = useAlert();

  const handleGoogleSignIn = async (): Promise<void> => {
    const res = await signInWithGoogle();
    if (res.error) {
      if (!res.error.toLowerCase().includes("cancelled")) {
        showAlert({
          title: "Sign In Error",
          message: res.error,
        });
      }
      return;
    }
    if (!res.hasPartner) {
      router.replace({
        pathname: ROUTES.INVITE_PARTNER,
        params: { source: "auth" },
      });
    } else {
      router.replace(ROUTES.HOME);
    }
  };

  return (
    <View style={readyStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={readyStyles.gradientBackground}
      />

      <SafeAreaView style={readyStyles.safeArea}>
        <View style={readyStyles.headerRow}>
          <Pressable
            style={readyStyles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={readyStyles.progressBarTrack}>
            <LinearGradient
              colors={[...GRADIENTS.progressBar]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[readyStyles.progressBarFill, { width: "100%" }]}
            />
          </View>
        </View>

        <View style={readyStyles.content}>
          <View style={readyStyles.headerTextContainer}>
            <Text style={readyStyles.title}>Your space is almost ready</Text>
            <Text style={readyStyles.subtitle}>
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
            style={readyStyles.illustrationContainer}
          >
            <Image
              source={require("@/assets/heart_in_cloud.png")}
              style={readyStyles.illustration}
              resizeMode="contain"
            />
          </MotiView>
        </View>

        <View style={readyStyles.footer}>
          <Pressable
            style={readyStyles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <View style={readyStyles.googleIconContainer}>
                  <GoogleIcon />
                </View>
                <Text style={readyStyles.googleButtonText}>
                  Sign in with Google
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
