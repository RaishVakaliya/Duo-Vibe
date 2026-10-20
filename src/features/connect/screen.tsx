import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ROUTES } from "@/src/constants/routes";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { ConnectGridCard } from "./components/connect-grid-card";
import { AboutThemCard } from "./components/about-them-card";
import { CoupleBadge } from "./components/couple-badge";
import { useConnectData } from "./use-connect-data";
import { useDeferredReady } from "@/src/hooks/use-deferred-ready";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "@/src/constants/colors";
import { styles } from "./styles";

export default function ConnectHubScreen() {
  const router = useRouter();
  const contentReady = useDeferredReady();
  const {
    hasPartner,
    filledNotesCount,
    totalNotesCount,
    reloadStats,
    myName,
    myAvatarUrl,
    partnerName,
    partnerAvatarUrl,
    daysTogether,
  } = useConnectData();

  useEffect(() => {
    if (contentReady) {
      reloadStats();
    }
  }, [contentReady, reloadStats]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...GRADIENTS.background]}
        locations={[...GRADIENTS.backgroundLocations]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Connect"
            subtitle="More ways to connect"
            hideBackButton
            align="start"
            style={{ paddingHorizontal: 0 }}
          />

          {contentReady && (
            <>
              {/* Couple badge — always shown, handles no-partner state */}
              <CoupleBadge
                myName={myName}
                myAvatarUrl={myAvatarUrl}
                partnerName={partnerName}
                partnerAvatarUrl={partnerAvatarUrl}
                hasPartner={hasPartner}
                daysTogether={daysTogether}
                onPress={hasPartner ? undefined : () => router.push(ROUTES.INVITE_PARTNER)}
              />

              {/* 2-Column Grid */}
              <View style={styles.gridRow}>
                <View style={styles.gridCardWrapper}>
                  <ConnectGridCard
                    title="Upcoming"
                    subtitle="What is next..."
                    iconName="calendar"
                    isGradient
                    needsPartner
                    hasPartner={hasPartner}
                    onPress={() => router.push(ROUTES.UPCOMING_PLANS)}
                    onLinkPartnerPress={() => router.push(ROUTES.INVITE_PARTNER)}
                  />
                </View>
                <View style={styles.gridCardWrapper}>
                  <ConnectGridCard
                    title="Canvas"
                    subtitle="Draw them something"
                    iconName="brush"
                    isComingSoon
                  />
                </View>
              </View>

              {/* Row 2 */}
              <View style={styles.gridRow}>
                <View style={styles.gridCardWrapper}>
                  <ConnectGridCard
                    title="Notes"
                    subtitle="Sweet words to share"
                    iconName="reader-outline"
                    isComingSoon
                  />
                </View>
                <View style={styles.gridCardWrapper} />
              </View>

              {/* Full-width About Them Card */}
              <View style={styles.fullWidthSection}>
                <AboutThemCard
                  filledCount={filledNotesCount}
                  totalCount={totalNotesCount}
                  onPress={() => router.push(ROUTES.ABOUT_THEM)}
                />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
