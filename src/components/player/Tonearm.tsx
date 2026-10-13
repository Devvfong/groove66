import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Circle,
  Path,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  playing?: boolean;
};

export const Tonearm: React.FC<Props> = ({
  width = 135,
  height = 265,
  playing = false,
}) => {
  const liftAnim = useRef(new Animated.Value(playing ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(liftAnim, {
      toValue: playing ? 1 : 0,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [playing, liftAnim]);

  // Subtle cueing angle: when paused, arm lifts by -2.5 degrees
  const armRotation = liftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-2.5deg', '0deg'],
  });

  return (
    <View pointerEvents="none" style={[styles.container, { width, height }]}>
      <Animated.View
        style={[
          styles.animatedArmWrapper,
          {
            transform: [
              { rotate: armRotation },
              { scale: liftAnim.interpolate({ inputRange: [0, 1], outputRange: [0.985, 1] }) },
            ],
          },
        ]}
      >
        <Svg width={width} height={height} viewBox="0 0 145 270">
          <Defs>
            {/* Metallic cylindrical aluminum gradient for straight arm tube */}
            <LinearGradient id="tubeSilver" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#6C6761" />
              <Stop offset="25%" stopColor="#C8C3BC" />
              <Stop offset="50%" stopColor="#FFFFFF" />
              <Stop offset="75%" stopColor="#BCB7B0" />
              <Stop offset="100%" stopColor="#54504A" />
            </LinearGradient>

            {/* Headshell dark molded texture */}
            <LinearGradient id="headshellBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#322E2A" />
              <Stop offset="50%" stopColor="#1E1B18" />
              <Stop offset="100%" stopColor="#12100E" />
            </LinearGradient>

            {/* Brass / gold cartridge gradient */}
            <LinearGradient id="cartridgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F5D77F" />
              <Stop offset="50%" stopColor="#C8A048" />
              <Stop offset="100%" stopColor="#8A6822" />
            </LinearGradient>

            {/* Gimbal chrome ring */}
            <LinearGradient id="gimbalChrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#EAE5DE" />
              <Stop offset="50%" stopColor="#868078" />
              <Stop offset="100%" stopColor="#3E3A35" />
            </LinearGradient>
          </Defs>

          {/* 1. UPPER-RIGHT PIVOT & GIMBAL ASSEMBLY (Sitting cleanly outside platter rim) */}
          <G transform="translate(122, 30)">
            {/* Base mounting shadow */}
            <Circle cx="2" cy="4" r="20" fill="#0A0604" opacity="0.6" />

            {/* Outer Gimbal Base */}
            <Circle cx="0" cy="0" r="19" fill="#1C1814" stroke="#5E5850" strokeWidth="1.6" />
            <Circle cx="0" cy="0" r="15" fill="url(#gimbalChrome)" />
            <Circle cx="0" cy="0" r="9.5" fill="#282420" stroke="#7E776E" strokeWidth="1" />
            <Circle cx="0" cy="0" r="4" fill="#D5CFC7" />

            {/* Counterweight cylinder behind pivot */}
            <Rect x="-7" y="-26" width="14" height="16" rx="2.5" fill="url(#tubeSilver)" stroke="#4A453E" strokeWidth="0.8" />
            <Rect x="-8" y="-20" width="16" height="3" fill="#1E1A16" />
            <Rect x="-8" y="-14" width="16" height="2" fill="#1E1A16" />
          </G>

          {/* 2. REALISTIC DROP SHADOW UNDER TUBE & HEADSHELL */}
          <G opacity="0.32">
            <Path
              d="M 126 40 L 72 176 L 62 202"
              stroke="#0A0604"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Headshell shadow */}
            <Rect x="56" y="202" width="13" height="24" rx="3" fill="#0A0604" />
          </G>

          {/* 3. STRAIGHT BRUSHED ALUMINUM TUBE */}
          <G>
            {/* Main silver tonearm tube extending from pivot to cartridge */}
            <Path
              d="M 122 36 L 68 172"
              stroke="url(#tubeSilver)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Tube collar / bend toward headshell connector */}
            <Path
              d="M 68 172 L 58 196"
              stroke="url(#tubeSilver)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Headshell connector ring with knurled lock nut */}
            <Circle cx="58" cy="196" r="5" fill="#2E2A26" stroke="#9A948B" strokeWidth="1" />
            <Circle cx="58" cy="196" r="3.2" fill="url(#tubeSilver)" />

            {/* 4. CARTRIDGE & HEADSHELL (ANGLED ONTO VINYL GROOVES AT 4:30) */}
            <G transform="translate(58, 196) rotate(26)">
              {/* Molded black headshell body */}
              <Rect
                x="-6.5"
                y="0"
                width="13"
                height="24"
                rx="2.5"
                fill="url(#headshellBody)"
                stroke="#4C4740"
                strokeWidth="0.9"
              />

              {/* Cartridge cutouts / vents */}
              <Rect x="-3" y="3" width="6" height="3" rx="0.8" fill="#0D0B09" />
              <Rect x="-3" y="8" width="6" height="3" rx="0.8" fill="#0D0B09" />

              {/* Brushed Finger Lift Lever extending rightward */}
              <Path
                d="M 6.5 6 L 17 3 L 15 0"
                stroke="url(#tubeSilver)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Gold/Brass stylus cartridge body */}
              <Rect
                x="-4"
                y="16"
                width="8"
                height="7"
                rx="1"
                fill="url(#cartridgeGold)"
                stroke="#684E1A"
                strokeWidth="0.6"
              />

              {/* Stylus needle / diamond tip point */}
              <Circle cx="0" cy="24" r="1.3" fill="#FFFFFF" />
              <Circle cx="0" cy="24" r="0.7" fill="#E8D298" />
            </G>
          </G>

          {/* Cueing / arm rest lever bracket near pivot */}
          <Path
            d="M 134 50 Q 139 64 126 68"
            stroke="#1C1814"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx="126" cy="68" r="2" fill="url(#tubeSilver)" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: -6,
    top: -2,
    zIndex: 10,
  },
  animatedArmWrapper: {
    width: '100%',
    height: '100%',
    transformOrigin: 'top right',
  },
});
