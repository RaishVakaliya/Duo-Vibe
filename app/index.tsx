import React, { useEffect } from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Path, Defs, LinearGradient, Stop, Line } from "react-native-svg";
import { MotiView } from "moti";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function Sparkle({
  size = 16,
  color = "#FF6B81",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z"
        fill={color}
      />
    </Svg>
  );
}

function OutlinedHeart({
  size = 28,
  color = "#FF6B81",
  strokeWidth = 2.5,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 28S4 19.5 4 11.5a7.5 7.5 0 0 1 12-5.5 7.5 7.5 0 0 1 12 5.5C28 19.5 16 28 16 28Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FilledHeart({
  size = 52,
  color = "#FF6B81",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 28S4 19.5 4 11.5a7.5 7.5 0 0 1 12-5.5 7.5 7.5 0 0 1 12 5.5C28 19.5 16 28 16 28Z"
        fill={color}
      />
    </Svg>
  );
}

function DiagonalLine() {
  return (
    <Svg width={24} height={40} viewBox="0 0 24 40" fill="none">
      <Line
        x1="22"
        y1="2"
        x2="2"
        y2="38"
        stroke="#FF6B81"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function BottomWave({ width }: { width: number }) {
  const height = 140;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Defs>
        <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FF4D6D" />
          <Stop offset="100%" stopColor="#FF8FA3" />
        </LinearGradient>
      </Defs>
      <Path
        d={`M 0 50 Q ${width * 0.28} 0, ${width * 0.58} 60 T ${width} 35 L ${width} ${height} L 0 ${height} Z`}
        fill="url(#waveGradient)"
      />
    </Svg>
  );
}

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2400);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.sparkleTopLeft}>
        <Sparkle size={14} color="#FF6B81" />
      </View>
      <View style={styles.sparkleMidLeft}>
        <Sparkle size={18} color="#FF8FA3" />
      </View>
      <View style={styles.sparkleRight}>
        <Sparkle size={12} color="#FF8FA3" />
      </View>

      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 600, delay: 50 }}
          style={styles.logoContainer}
        >
          <Image
            source={require("@/assets/images/icon-nobg.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 200 }}
        >
          <Text style={styles.wordmark}>Duo Vibe</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 350 }}
        >
          <Text style={styles.subtitle}>Love · Crush · Couple Games</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.92, translateY: 15 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 500 }}
          style={styles.taglineContainer}
        >
          <Text style={styles.tagline}>Better</Text>
          <Text style={styles.tagline}>Connections,</Text>
          <Text style={styles.tagline}>Bigger Smiles</Text>

          <View style={styles.accentRow}>
            <View style={styles.accentHeart}>
              <OutlinedHeart size={30} color="#FF8FA3" strokeWidth={2.5} />
            </View>
            <View style={styles.diagonalAccent}>
              <DiagonalLine />
            </View>
          </View>
        </MotiView>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: 600 }}
        style={styles.bottomSection}
      >
        <View style={styles.bottomSparkle1}>
          <Sparkle size={15} color="#FF8FA3" />
        </View>
        <View style={styles.bottomSparkle2}>
          <Sparkle size={12} color="#FF4D6D" />
        </View>

        <View style={styles.heartsContainer}>
          <View style={styles.filledHeartWrapper}>
            <FilledHeart size={68} color="#FF6B81" />
          </View>
          <View style={styles.outlinedHeartWrapper}>
            <OutlinedHeart size={54} color="#0D0B1A" strokeWidth={4} />
          </View>
          <View style={[styles.outlinedHeartWrapper, { zIndex: 3 }]}>
            <OutlinedHeart size={54} color="#FF8FA3" strokeWidth={3} />
          </View>
        </View>

        <BottomWave width={SCREEN_WIDTH} />
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0B1A",
    justifyContent: "space-between",
  },
  sparkleTopLeft: {
    position: "absolute",
    top: "18%",
    left: "8%",
    opacity: 0.8,
  },
  sparkleMidLeft: {
    position: "absolute",
    top: "55%",
    left: "10%",
    opacity: 0.9,
  },
  sparkleRight: {
    position: "absolute",
    top: "38%",
    right: "10%",
    opacity: 0.7,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 120,
  },
  wordmark: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 48,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: "#FF6B81",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 36,
    letterSpacing: 1.2,
  },
  taglineContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  tagline: {
    fontFamily: "Caveat_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: "#FFFFFF",
    textAlign: "center",
  },
  accentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: 140,
    position: "relative",
  },
  accentHeart: {
    transform: [{ rotate: "-8deg" }],
  },
  diagonalAccent: {
    position: "absolute",
    right: 0,
    top: -4,
    transform: [{ rotate: "15deg" }],
  },
  bottomSection: {
    width: "100%",
    position: "relative",
    alignItems: "center",
  },
  bottomSparkle1: {
    position: "absolute",
    top: -24,
    right: "18%",
    zIndex: 4,
  },
  bottomSparkle2: {
    position: "absolute",
    top: 6,
    right: "25%",
    zIndex: 4,
  },
  heartsContainer: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
    width: 130,
    height: 80,
    zIndex: 2,
  },
  filledHeartWrapper: {
    position: "absolute",
    right: 12,
    top: 0,
    transform: [{ rotate: "14deg" }],
  },
  outlinedHeartWrapper: {
    position: "absolute",
    left: 8,
    top: 14,
    transform: [{ rotate: "-16deg" }],
  },
});
