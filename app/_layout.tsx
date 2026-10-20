import "@/global.css";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/src/context/auth-provider";
import { AlertProvider } from "@/src/components/ui/alert-dialog";
import { ErrorBoundary } from "@/src/components/error-boundary";
import { COLORS } from "@/src/constants/colors";
import { useNotificationRouting } from "@/src/hooks/use-notification-routing";
import {
  useFonts,
  Fredoka_400Regular,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import { Caveat_400Regular, Caveat_700Bold } from "@expo-google-fonts/caveat";

import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore native splash prevent auto hide errors if already hidden or unsupported
});

function RootNavigationStack() {
  useNotificationRouting();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 250,
        gestureEnabled: true,
        contentStyle: { backgroundColor: COLORS.darkOverlay },
        statusBarStyle: "light",
        statusBarTranslucent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ animation: "fade", animationDuration: 250 }}
      />
      <Stack.Screen
        name="welcome"
        options={{ animation: "fade", animationDuration: 250 }}
      />

      <Stack.Screen name="date-ideas" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="invite-partner" options={{ gestureDirection: "horizontal" }} />

      <Stack.Screen
        name="(tabs)"
        options={{ animation: "fade", animationDuration: 250 }}
      />

      <Stack.Screen name="about-them" />
      <Stack.Screen name="upcoming-plans" />

      <Stack.Screen
        name="edit-profile"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          animationDuration: 250,
        }}
      />
      <Stack.Screen
        name="feedback"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          animationDuration: 250,
        }}
      />

      <Stack.Screen name="about" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="privacy" />

      <Stack.Screen name="love-match" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="crush-calculator" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="twenty-one-questions" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="couple-quiz" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="couple-quiz-play" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="couple-quiz-review" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="secret-crush" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen
        name="secret-crush/[id]"
        options={{ animation: "fade", animationDuration: 250 }}
      />
      <Stack.Screen name="couple-challenge" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="couple-challenge-all" options={{ gestureDirection: "horizontal" }} />
      <Stack.Screen name="red-green-flag" options={{ gestureDirection: "horizontal" }} />

      <Stack.Screen
        name="love-match-result"
        options={{ animation: "fade", animationDuration: 250 }}
      />
      <Stack.Screen
        name="crush-calculator-result"
        options={{ animation: "fade", animationDuration: 250 }}
      />
      <Stack.Screen
        name="couple-quiz-result"
        options={{ animation: "fade", animationDuration: 250 }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontTimeout, setFontTimeout] = React.useState(false);
  const [loaded, error] = useFonts({
    Fredoka_400Regular,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Caveat_400Regular,
    Caveat_700Bold,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFontTimeout(true);
      SplashScreen.hideAsync().catch(() => { });
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [loaded, error]);

  if (!loaded && !error && !fontTimeout) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: COLORS.darkOverlay }}
      >
        <KeyboardProvider>
          <GluestackUIProvider mode="dark">
            <AuthProvider>
              <AlertProvider>
                <RootNavigationStack />
              </AlertProvider>
            </AuthProvider>
          </GluestackUIProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export { RouteErrorBoundary as ErrorBoundary } from "@/src/components/error-boundary";
