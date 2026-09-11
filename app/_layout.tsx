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
                  contentStyle: { backgroundColor: COLORS.darkOverlay },
                }}
              >
                <Stack.Screen name="index" options={{ animation: "fade" }} />
                <Stack.Screen name="welcome" options={{ animation: "fade" }} />
                <Stack.Screen
                  name="login"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="date-ideas"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="play-compare"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="memories"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="ready"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="invite-partner"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen name="home" options={{ animation: "fade" }} />
                <Stack.Screen
                  name="love-match"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="love-match-result"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="crush-calculator"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="crush-calculator-result"
                  options={{ animation: "slide_from_right" }}
                />
                <Stack.Screen
                  name="twenty-one-questions"
                  options={{ animation: "slide_from_right" }}
                />
              </Stack>
            </AlertProvider>
          </AuthProvider>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
