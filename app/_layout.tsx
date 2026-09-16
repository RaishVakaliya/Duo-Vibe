import "@/global.css";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/src/context/auth";
import { AlertProvider } from "@/src/components/ui/alert-dialog";
import { ErrorBoundary } from "@/src/components/error-boundary";
import { COLORS } from "@/src/constants/colors";
import {
  useFonts,
  Fredoka_400Regular,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import { Caveat_400Regular, Caveat_700Bold } from "@expo-google-fonts/caveat";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fredoka_400Regular,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Caveat_400Regular,
    Caveat_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: COLORS.darkOverlay }}
      >
        <GluestackUIProvider mode="dark">
          <AuthProvider>
            <AlertProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                  gestureEnabled: true,
                  contentStyle: { backgroundColor: COLORS.darkOverlay },
                }}
              >
                {/* Entry & Auth Welcome: Soft Crossfade */}
                <Stack.Screen name="index" options={{ animation: "fade" }} />
                <Stack.Screen name="welcome" options={{ animation: "fade" }} />

                {/* Onboarding & Core Flows: Smooth Native iOS/Android slide from right */}
                <Stack.Screen name="login" />
                <Stack.Screen name="onboarding-name" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="date-ideas" />
                <Stack.Screen name="play-compare" />
                <Stack.Screen name="memories" />
                <Stack.Screen name="ready" />
                <Stack.Screen name="invite-partner" />

                {/* Main Hubs: Clean crossfade */}
                <Stack.Screen name="home" options={{ animation: "fade" }} />
                <Stack.Screen name="profile" options={{ animation: "fade" }} />

                {/* Modal-style Presentation Screens */}
                <Stack.Screen
                  name="edit-profile"
                  options={{
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="feedback"
                  options={{
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />

                {/* Legal & Info Pages */}
                <Stack.Screen name="about" />
                <Stack.Screen name="terms" />
                <Stack.Screen name="privacy" />

                {/* Feature Action Screens */}
                <Stack.Screen name="love-match" />
                <Stack.Screen name="crush-calculator" />
                <Stack.Screen name="twenty-one-questions" />
                <Stack.Screen name="couple-quiz" />
                <Stack.Screen name="couple-quiz-play" />
                <Stack.Screen name="couple-quiz-review" />

                {/* Reveal Result Screens: Fade Transition for Delightful Reveal Moment */}
                <Stack.Screen
                  name="love-match-result"
                  options={{ animation: "fade_from_bottom" }}
                />
                <Stack.Screen
                  name="crush-calculator-result"
                  options={{ animation: "fade_from_bottom" }}
                />
                <Stack.Screen
                  name="couple-quiz-result"
                  options={{ animation: "fade_from_bottom" }}
                />
              </Stack>
            </AlertProvider>
          </AuthProvider>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
