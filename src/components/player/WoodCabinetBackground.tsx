import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  G,
} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

export const WoodCabinetBackground: React.FC<Props> = ({ width, height }) => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          {/* Base walnut gradient from top to bottom */}
          <LinearGradient id="walnutBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4A2612" />
            <Stop offset="28%" stopColor="#381B0D" />
            <Stop offset="62%" stopColor="#281106" />
            <Stop offset="100%" stopColor="#150803" />
          </LinearGradient>

          {/* Warm overhead directional lamp glow behind the turntable platter */}
          <RadialGradient
            id="lampGlow"
            cx="50%"
            cy="35%"
            rx="56%"
            ry="42%"
            fx="50%"
            fy="32%"
          >
            <Stop offset="0%" stopColor="#9E5426" stopOpacity="0.46" />
            <Stop offset="42%" stopColor="#6E3415" stopOpacity="0.28" />
            <Stop offset="75%" stopColor="#401C0A" stopOpacity="0.10" />
            <Stop offset="100%" stopColor="#1E0C04" stopOpacity="0" />
          </RadialGradient>

          {/* Edge vignette */}
          <RadialGradient id="edgeVignette" cx="50%" cy="50%" r="55%">
            <Stop offset="70%" stopColor="#000000" stopOpacity="0" />
            <Stop offset="100%" stopColor="#0A0402" stopOpacity="0.65" />
          </RadialGradient>
        </Defs>

        {/* 1. Base Dark Walnut Wood */}
        <Rect x="0" y="0" width={width} height={height} fill="url(#walnutBase)" />

        {/* 2. Warm Lamp Glow */}
        <Rect x="0" y="0" width={width} height={height} fill="url(#lampGlow)" />

        {/* 3. Subtle Vertical Wood Planks / Grain Striations */}
        <G opacity={0.18}>
          {Array.from({ length: 18 }).map((_, i) => {
            const x = (i * width) / 18;
            const strokeColor = i % 2 === 0 ? '#C47E45' : '#140803';
            const opacity = 0.2 + (i % 3) * 0.15;
            return (
              <Path
                key={i}
                d={`M ${x} 0 Q ${x + (i % 2 === 0 ? 3 : -3)} ${height * 0.5} ${x} ${height}`}
                stroke={strokeColor}
                strokeWidth={1.2}
                opacity={opacity}
              />
            );
          })}
        </G>

        {/* Fine organic grain waves */}
        <G opacity={0.1}>
          <Path
            d={`M 0 ${height * 0.22} Q ${width * 0.5} ${height * 0.25} ${width} ${height * 0.22}`}
            stroke="#D48B4E"
            strokeWidth="0.8"
          />
          <Path
            d={`M 0 ${height * 0.48} Q ${width * 0.5} ${height * 0.45} ${width} ${height * 0.48}`}
            stroke="#D48B4E"
            strokeWidth="0.8"
          />
          <Path
            d={`M 0 ${height * 0.72} Q ${width * 0.5} ${height * 0.75} ${width} ${height * 0.72}`}
            stroke="#140803"
            strokeWidth="0.8"
          />
        </G>

        {/* 4. Outer Vignette */}
        <Rect x="0" y="0" width={width} height={height} fill="url(#edgeVignette)" />
      </Svg>
    </View>
  );
};
