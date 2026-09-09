import React, { useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Path, Defs, LinearGradient, Stop, Line } from "react-native-svg";
import { MotiView } from "moti";
import { splashStyles } from "@/styles/splash.styles";

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
      router.replace("/welcome");
    }, 2400);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={splashStyles.container}>
      <StatusBar style="light" />

      <View style={splashStyles.sparkleTopLeft}>
        <Sparkle size={14} color="#FF6B81" />
      </View>
      <View style={splashStyles.sparkleMidLeft}>
        <Sparkle size={18} color="#FF8FA3" />
      </View>
      <View style={splashStyles.sparkleRight}>
        <Sparkle size={12} color="#FF8FA3" />
      </View>

      <View style={splashStyles.content}>
        <MotiView
          from={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 600, delay: 50 }}
          style={splashStyles.logoContainer}
        >
          <Image
            source={require("@/assets/icon-nobg.png")}
            style={splashStyles.logo}
            resizeMode="contain"
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 200 }}
        >
          <Text style={splashStyles.wordmark}>Duo Vibe</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 350 }}
        >
          <Text style={splashStyles.subtitle}>Love · Crush · Couple Games</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.92, translateY: 15 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 500 }}
          style={splashStyles.taglineContainer}
        >
          <Text style={splashStyles.tagline}>Better</Text>
          <Text style={splashStyles.tagline}>Connections,</Text>
          <Text style={splashStyles.tagline}>Bigger Smiles</Text>

          <View style={splashStyles.accentRow}>
            <View style={splashStyles.accentHeart}>
              <OutlinedHeart size={30} color="#FF8FA3" strokeWidth={2.5} />
            </View>
            <View style={splashStyles.diagonalAccent}>
              <DiagonalLine />
            </View>
          </View>
        </MotiView>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: 600 }}
        style={splashStyles.bottomSection}
      >
        <View style={splashStyles.bottomSparkle1}>
          <Sparkle size={15} color="#FF8FA3" />
        </View>
        <View style={splashStyles.bottomSparkle2}>
          <Sparkle size={12} color="#FF4D6D" />
        </View>

        <View style={splashStyles.heartsContainer}>
          <View style={splashStyles.filledHeartWrapper}>
            <FilledHeart size={68} color="#FF6B81" />
          </View>
          <View style={splashStyles.outlinedHeartWrapper}>
            <OutlinedHeart size={54} color="#0D0B1A" strokeWidth={4} />
          </View>
          <View style={[splashStyles.outlinedHeartWrapper, { zIndex: 3 }]}>
            <OutlinedHeart size={54} color="#FF8FA3" strokeWidth={3} />
          </View>
        </View>

        <BottomWave width={SCREEN_WIDTH} />
      </MotiView>
    </View>
  );
}
