import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { styles } from "./styles";
import {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  RouteErrorBoundaryProps,
} from "./types";

export * from "./types";
export * from "./styles";

export function RouteErrorBoundary({ error, retry }: RouteErrorBoundaryProps) {
  const handleGoHome = () => {
    try {
      router.replace(ROUTES.HOME);
    } catch {
      router.replace(ROUTES.WELCOME);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />
      <View style={styles.content}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title} maxFontSizeMultiplier={1.2}>
          Something went wrong
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.2}>
          {"Don't worry, your love space is safe! Let's try reloading the screen."}
        </Text>

        {__DEV__ && error?.message ? (
          <View style={styles.devErrorBox}>
            <Text style={styles.devErrorText} numberOfLines={4}>
              {error.message}
            </Text>
          </View>
        ) : null}

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.retryButton}
            onPress={retry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <LinearGradient
              colors={[...GRADIENTS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                Try Again
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.homeButton}
            onPress={handleGoHome}
            accessibilityRole="button"
            accessibilityLabel="Go home"
          >
            <Text style={styles.homeButtonText} maxFontSizeMultiplier={1.2}>
              Go Home
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/**
 * React Component ErrorBoundary for enclosing JSX component trees.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = (): void => {
    this.setState({ hasError: false, error: null });
    try {
      router.replace(ROUTES.HOME);
    } catch {
      router.replace(ROUTES.WELCOME);
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <LinearGradient
            colors={[...GRADIENTS.background]}
            locations={[...GRADIENTS.backgroundLocations]}
            style={styles.gradientBackground}
          />
          <View style={styles.content}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title} maxFontSizeMultiplier={1.2}>
              Something went wrong
            </Text>
            <Text style={styles.subtitle} maxFontSizeMultiplier={1.2}>
              {"Don't worry, your love space is safe! Let's try reloading the screen."}
            </Text>

            {__DEV__ && this.state.error?.message ? (
              <View style={styles.devErrorBox}>
                <Text style={styles.devErrorText} numberOfLines={4}>
                  {this.state.error.message}
                </Text>
              </View>
            ) : null}

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.retryButton}
                onPress={this.handleReset}
                accessibilityRole="button"
                accessibilityLabel="Try again"
              >
                <LinearGradient
                  colors={[...GRADIENTS.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText} maxFontSizeMultiplier={1.2}>
                    Try Again
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                style={styles.homeButton}
                onPress={this.handleGoHome}
                accessibilityRole="button"
                accessibilityLabel="Go home"
              >
                <Text style={styles.homeButtonText} maxFontSizeMultiplier={1.2}>
                  Go Home
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
