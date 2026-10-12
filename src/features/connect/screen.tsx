import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { ROUTES } from "@/src/constants/routes";
import { BottomTabBar } from "@/src/components/navigation/bottom-tab-bar";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { ConnectGridCard } from "./components/connect-grid-card";
import { AboutThemCard } from "./components/about-them-card";
import { useConnectData } from "./use-connect-data";
import { styles } from "./styles";

export default function ConnectHubScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const {
    hasPartner,
    filledNotesCount,
    totalNotesCount,
    handleTabPress,
    reloadStats,
  } = useConnectData();

  useEffect(() => {
    if (isFocused) {
      reloadStats();
    }
  }, [isFocused, reloadStats]);

  const handleUpcomingPress = () => {
    router.push(ROUTES.UPCOMING_PLANS);
  };

  const handleLinkPartnerPress = () => {
    router.push(ROUTES.INVITE_PARTNER);
  };

  const handleAboutThemPress = () => {
    router.push(ROUTES.ABOUT_THEM);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <ScreenHeader
            title="Connect"
            subtitle="More ways to connect"
            hideBackButton
            align="start"
            style={{ paddingHorizontal: 0 }}
          />

          {/* 2-Column Grid */}
          <View style={styles.gridRow}>
            <View style={styles.gridCardWrapper}>
              <ConnectGridCard
                title="Upcoming"
                subtitle="What’s next..."
                iconName="calendar"
                isGradient
                needsPartner
                hasPartner={hasPartner}
                onPress={handleUpcomingPress}
                onLinkPartnerPress={handleLinkPartnerPress}
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

          {/* Additional Grid Row with Notes */}
          <View style={styles.gridRow}>
            <View style={styles.gridCardWrapper}>
              <ConnectGridCard
                title="Notes"
                subtitle="Sweet words to share"
                iconName="reader-outline"
                isComingSoon
              />
            </View>
            {/* Empty placeholder column to balance grid */}
            <View style={styles.gridCardWrapper} />
          </View>

          {/* Full-width About Them Card */}
          <View style={styles.fullWidthSection}>
            <AboutThemCard
              filledCount={filledNotesCount}
              totalCount={totalNotesCount}
              onPress={handleAboutThemPress}
            />
          </View>
        </ScrollView>

        {/* Tab Bar kept visible on hub */}
        <BottomTabBar activeTab={1} onTabPress={handleTabPress} />
      </SafeAreaView>
    </View>
  );
}
