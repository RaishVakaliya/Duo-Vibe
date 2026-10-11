import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "@/src/constants/colors";
import { ProgressRingProps } from "./types";
import { styles } from "./styles";

export const ProgressRing: React.FC<ProgressRingProps> = ({
  filled,
  total,
  size = 56,
  strokeWidth = 5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? Math.min(1, Math.max(0, filled / total)) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          origin={`${size / 2}, ${size / 2}`}
          rotation="-90"
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={styles.countText}>{filled}</Text>
        <Text style={styles.totalText}>/{total}</Text>
      </View>
    </View>
  );
};
