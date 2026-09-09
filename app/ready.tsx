import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import Svg, { Path } from "react-native-svg";
import { readyStyles } from "@/styles/ready.styles";
import { GRADIENTS } from "@/constants/colors";

function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default function ReadyScreen() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    console.log("Initiating Google sign-in...");
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
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
          >
            <View style={readyStyles.googleIconContainer}>
              <GoogleIcon />
            </View>
            <Text style={readyStyles.googleButtonText}>
              Sign in with Google
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
