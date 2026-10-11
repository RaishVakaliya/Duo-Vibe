import React, { useCallback } from "react";
import { View, BackHandler, ActivityIndicator, Text, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { GRADIENTS } from "@/src/constants/colors";
import { ROUTES } from "@/src/constants/routes";
import { useRedGreenFlag } from "./use-red-green-flag";
import { ModeSelect } from "./components/mode-select";
import { SwipeDeck } from "./components/swipe-deck";
import { WaitingScreen } from "./components/waiting-screen";
import { SoloResult } from "./components/solo-result";
import { PartnerResult } from "./components/partner-result";
import { styles } from "./styles";

export default function RedGreenFlagScreen() {
  const router = useRouter();
  const {
    step,
    mode,
    partnerName,
    hasPartner,
    partnerSessionStatus,
    statements,
    currentIndex,
    canUndo,
    isAnimating,
    currentStatToast,
    isSubmitting,
    submitError,
    soloSummary,
    partnerSummary,
    isSavedToMemories,
    isSavingMemory,
    handleSelectMode,
    handleVote,
    handleUndo,
    handleRetrySubmit,
    handlePlayAgain,
    handleBackToModeSelect,
    handleSaveToMemories,
    handleShareSoloResult,
    handleInvitePartner,
  } = useRedGreenFlag();

  // Hardware Back Handler
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (step === "mode_select") {
          router.replace(ROUTES.HOME);
          return true;
        }
        if (step === "swiping") {
          handleBackToModeSelect();
          return true;
        }
        if (step === "waiting" || step === "solo_result" || step === "partner_result") {
          router.replace(ROUTES.HOME);
          return true;
        }
        return false;
      };

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => sub.remove();
    }, [step, handleBackToModeSelect, router]),
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={GRADIENTS.background}
        locations={GRADIENTS.backgroundLocations}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Offline / Submit Error Banner */}
        {submitError && (
          <View style={styles.retryBanner}>
            <Text style={styles.retryBannerText}>{submitError}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={handleRetrySubmit}
              accessibilityRole="button"
              accessibilityLabel="Retry submission"
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Submitting Loading Overlay */}
        {isSubmitting && !submitError && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              backgroundColor: "rgba(10, 4, 19, 0.8)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#FFA07A" />
            <Text
              style={{
                fontFamily: "Fredoka_600SemiBold",
                fontSize: 15,
                color: "#FFFFFF",
                marginTop: 14,
              }}
            >
              Saving your answers...
            </Text>
          </View>
        )}

        {/* View Routing */}
        {step === "mode_select" && (
          <ModeSelect
            partnerName={partnerName}
            hasPartner={hasPartner}
            partnerSessionStatus={partnerSessionStatus}
            onSelectSolo={() => handleSelectMode("solo")}
            onSelectPartner={() => handleSelectMode("partner")}
            onInvitePartner={handleInvitePartner}
            onBack={() => router.replace(ROUTES.HOME)}
          />
        )}

        {(step === "swiping" || step === "submitting") && (
          <SwipeDeck
            mode={mode}
            statements={statements}
            currentIndex={currentIndex}
            canUndo={canUndo}
            isAnimating={isAnimating}
            statToast={currentStatToast}
            onVote={handleVote}
            onUndo={handleUndo}
            onBack={handleBackToModeSelect}
          />
        )}

        {step === "waiting" && (
          <WaitingScreen
            partnerName={partnerName}
            onBack={() => router.replace(ROUTES.HOME)}
          />
        )}

        {step === "solo_result" && soloSummary && (
          <SoloResult
            summary={soloSummary}
            onShare={handleShareSoloResult}
            onPlayAgain={handlePlayAgain}
            onBackToHome={() => router.replace(ROUTES.HOME)}
          />
        )}

        {step === "partner_result" && partnerSummary && (
          <PartnerResult
            partnerName={partnerName}
            summary={partnerSummary}
            isSavedToMemories={isSavedToMemories}
            isSavingMemory={isSavingMemory}
            onSaveToMemories={handleSaveToMemories}
            onPlayAgain={handlePlayAgain}
            onBackToHome={() => router.replace(ROUTES.HOME)}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
