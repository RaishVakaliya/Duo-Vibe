import React from "react";
import { View, Text, Image, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { loginStyles } from "@/styles/login.styles";
import { GRADIENTS } from "@/constants/colors";
import { useAuth } from "@/context/auth";
import { GoogleIcon } from "@/components/ui/google-icon";

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithGoogle, isLoading } = useAuth();

  const handleGoogleSignIn = async () => {
    const res = await signInWithGoogle();
    if (res.error) {
      if (!res.error.toLowerCase().includes("cancelled")) {
        Alert.alert("Sign In Error", res.error);
      }
      return;
    }
    if (!res.hasPartner) {
      router.push("/invite-partner");
    } else {
      router.replace("/home");
    }
  };

  return (
    <View style={loginStyles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={loginStyles.gradientBackground}
      />

      <View style={loginStyles.ambientBlobTop} pointerEvents="none" />
      <View style={loginStyles.ambientBlobBottom} pointerEvents="none" />

      <SafeAreaView style={loginStyles.safeArea}>
        <View style={loginStyles.header}>
          <Pressable
            style={loginStyles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={loginStyles.content}>
          <Image
            source={require("@/assets/icon-nobg.png")}
            style={loginStyles.logo}
            resizeMode="contain"
          />

          <Text style={loginStyles.title}>Duo Vibe</Text>
          <Text style={loginStyles.subtitle}>
            Stay close, wherever you are.
          </Text>

          <Pressable
            style={loginStyles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <View style={loginStyles.googleIconContainer}>
                  <GoogleIcon />
                </View>
                <Text style={loginStyles.googleButtonText}>
                  Sign in with Google
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={loginStyles.footer}>
          <Text style={loginStyles.footerText}>
            By signing in, I agree to the
          </Text>
          <View style={loginStyles.linksRow}>
            <Text style={loginStyles.linkText}>Terms of Service</Text>
            <Text style={loginStyles.andText}> and </Text>
            <Text style={loginStyles.linkText}>Privacy Policy</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
