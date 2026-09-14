import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
} from "react-native-svg";

interface CoupleIllustrationProps {
  width?: number;
  height?: number;
}

export function CoupleIllustration({
  width = 300,
  height = 150,
}: CoupleIllustrationProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 320 160">
        <Defs>
          <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFE8EF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFD8E4" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="hairBoy" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1E1B26" />
            <Stop offset="100%" stopColor="#2D2A37" />
          </LinearGradient>
          <LinearGradient id="hairGirl" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1C1924" />
            <Stop offset="100%" stopColor="#353140" />
          </LinearGradient>
          <LinearGradient id="shirtBoy" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FF4D6D" />
            <Stop offset="100%" stopColor="#E11D48" />
          </LinearGradient>
          <LinearGradient id="shirtGirl" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#4F46E5" />
          </LinearGradient>
        </Defs>

        <Rect
          x="4"
          y="4"
          width="312"
          height="152"
          rx="20"
          fill="url(#bgGrad)"
        />

        <G transform="translate(48, 42) scale(0.9)">
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#FF4D6D"
            opacity="0.8"
          />
        </G>
        <G transform="translate(245, 46) scale(0.9)">
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#FF4D6D"
            opacity="0.8"
          />
        </G>

        <G transform="translate(154, 76) scale(0.65)">
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#FF2D6C"
            opacity="0.9"
          />
        </G>

        <Path
          d="M80 160 C80 120, 110 115, 138 118 C155 120, 165 130, 168 160 Z"
          fill="url(#shirtBoy)"
        />
        <Path d="M128 117 C133 124, 143 124, 148 117 Z" fill="#FFE0D2" />
        <Rect x="130" y="104" width="16" height="16" rx="4" fill="#FCD5C5" />
        <Circle cx="138" cy="84" r="22" fill="#FCD5C5" />
        <Path
          d="M116 84 C116 64, 132 58, 148 60 C160 62, 162 70, 160 80 C154 74, 146 72, 138 74 C130 76, 122 82, 116 84 Z"
          fill="url(#hairBoy)"
        />
        <Circle cx="145" cy="84" r="2.5" fill="#2E2836" />
        <Circle cx="140" cy="89" r="3.5" fill="#FF8FA3" opacity="0.5" />
        <Path
          d="M144 91 Q148 95, 151 91"
          stroke="#2E2836"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        <Path
          d="M172 75 C164 62, 185 55, 205 60 C220 64, 226 78, 224 105 C222 135, 212 150, 205 160 L180 160 C175 140, 172 110, 172 75 Z"
          fill="url(#hairGirl)"
        />
        <Path
          d="M165 160 C168 132, 178 122, 195 120 C220 117, 246 122, 246 160 Z"
          fill="url(#shirtGirl)"
        />
        <Rect x="180" y="104" width="15" height="16" rx="4" fill="#FEE1D6" />
        <Circle cx="187" cy="85" r="21" fill="#FEE1D6" />
        <Path
          d="M170 82 C172 68, 185 62, 200 63 C214 65, 218 75, 215 85 C210 76, 198 72, 188 74 C180 76, 174 80, 170 82 Z"
          fill="url(#hairGirl)"
        />
        <Circle cx="180" cy="85" r="2.5" fill="#2E2836" />
        <Circle cx="183" cy="90" r="3.5" fill="#FF8FA3" opacity="0.6" />
        <Path
          d="M175 92 Q179 96, 183 92"
          stroke="#2E2836"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
  },
});
