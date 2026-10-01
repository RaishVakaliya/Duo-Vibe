import React from "react";
import Svg, { Path, Rect, Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";

interface EnvelopeIllustrationProps {
  size?: number;
}

export function EnvelopeIllustration({ size = 140 }: EnvelopeIllustrationProps) {
  return (
    <Svg width={size} height={size * 0.75} viewBox="0 0 200 150">
      <Defs>
        <LinearGradient id="envGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FF2D6C" stopOpacity="1" />
          <Stop offset="1" stopColor="#FF8FA3" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="envBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3D1A2E" stopOpacity="1" />
          <Stop offset="1" stopColor="#2A0F20" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="sealGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FF4D6D" stopOpacity="1" />
          <Stop offset="1" stopColor="#E11D48" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Envelope body */}
      <Rect
        x="10"
        y="35"
        width="180"
        height="110"
        rx="10"
        fill="url(#envBodyGrad)"
        stroke="#FF2D6C"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />

      {/* Envelope flap */}
      <Path
        d="M10 35 L100 90 L190 35"
        fill="none"
        stroke="#FF2D6C"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
      <Path
        d="M10 35 L100 85 L190 35 L190 45 L100 95 L10 45 Z"
        fill="url(#envGrad)"
        fillOpacity="0.12"
      />

      {/* Top flap closed */}
      <Path
        d="M10 35 Q100 0 190 35"
        fill="#3D1A2E"
        stroke="#FF2D6C"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />

      {/* Bottom left diagonal line */}
      <Path
        d="M10 145 L80 95"
        stroke="#FF2D6C"
        strokeWidth="1.2"
        strokeOpacity="0.3"
      />
      {/* Bottom right diagonal line */}
      <Path
        d="M190 145 L120 95"
        stroke="#FF2D6C"
        strokeWidth="1.2"
        strokeOpacity="0.3"
      />

      {/* Heart seal */}
      <G>
        <Circle cx="100" cy="88" r="18" fill="url(#sealGrad)" opacity="0.95" />
        {/* Heart shape inside circle */}
        <Path
          d="M100 96 C100 96 88 88 88 82 C88 78 91.5 76 95 78 C97 79 99 81 100 83 C101 81 103 79 105 78 C108.5 76 112 78 112 82 C112 88 100 96 100 96 Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />
      </G>

      {/* Sparkles */}
      <Circle cx="28" cy="18" r="3" fill="#FF4D6D" fillOpacity="0.7" />
      <Circle cx="172" cy="20" r="2" fill="#FF8FA3" fillOpacity="0.6" />
      <Circle cx="155" cy="8" r="1.5" fill="#FF2D6C" fillOpacity="0.5" />
      <Circle cx="42" cy="10" r="1.5" fill="#FF4D6D" fillOpacity="0.5" />
    </Svg>
  );
}
