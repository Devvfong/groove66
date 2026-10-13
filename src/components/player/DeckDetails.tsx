import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { typography } from '../../theme/tokens';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  G,
  Rect,
} from 'react-native-svg';

export const MetalKnob: React.FC<{ size?: number }> = ({ size = 38 }) => {
  const [knobAngle, setKnobAngle] = useState(0);

  const handleTurnKnob = () => {
    setKnobAngle((prev) => (prev + 30) % 360);
  };

  return (
    <Pressable
      onPress={handleTurnKnob}
      accessibilityRole="button"
      accessibilityLabel="Vintage deck volume and tone knob"
      style={[styles.knobContainer, { width: size, height: size }]}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Defs>
          {/* Beveled outer rim */}
          <LinearGradient id="knobRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#C4BDB5" />
            <Stop offset="50%" stopColor="#5E564E" />
            <Stop offset="100%" stopColor="#2D2824" />
          </LinearGradient>

          {/* Brushed champagne face */}
          <RadialGradient id="knobFace" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#E6DFD5" />
            <Stop offset="65%" stopColor="#BEB5A8" />
            <Stop offset="100%" stopColor="#8A8074" />
          </RadialGradient>

          {/* Anisotropic metallic specular sheen */}
          <LinearGradient id="knobSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <Stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
            <Stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </LinearGradient>
        </Defs>

        {/* Outer dark base & shadow ring */}
        <Circle cx="20" cy="20" r="19.5" fill="#1C1612" />
        <Circle cx="20" cy="20" r="18.5" fill="url(#knobRim)" stroke="#423B33" strokeWidth="0.8" />

        {/* Face of the knob with dynamic rotation on tap */}
        <G transform={`rotate(${knobAngle}, 20, 20)`}>
          <Circle cx="20" cy="20" r="15" fill="url(#knobFace)" />
          <Circle cx="20" cy="20" r="15" fill="url(#knobSheen)" />

          {/* Fine concentric brushed ring texture */}
          <Circle cx="20" cy="20" r="12" stroke="#8A8074" strokeWidth="0.6" fill="none" opacity="0.4" />
          <Circle cx="20" cy="20" r="8" stroke="#8A8074" strokeWidth="0.6" fill="none" opacity="0.3" />

          {/* Index marker notch (small dark dot/notch on top) */}
          <Circle cx="20" cy="8" r="1.6" fill="#1F1A15" />

          {/* Center indented spindle / concave button */}
          <Circle cx="20" cy="20" r="3.8" fill="#756C61" stroke="#3D372F" strokeWidth="0.8" />
          <Circle cx="20" cy="20" r="1.5" fill="#423C34" />
        </G>
      </Svg>
    </Pressable>
  );
};

export const StereoBadge: React.FC = () => {
  return (
    <View style={styles.stereoBadgeOuter}>
      <View style={styles.stereoBadgeInner}>
        <Text style={styles.stereoText}>STEREO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  knobContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 6,
  },
  stereoBadgeOuter: {
    borderWidth: 1.2,
    borderColor: '#C6B287',
    borderRadius: 3,
    padding: 1.5,
    backgroundColor: 'rgba(28, 14, 8, 0.65)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  stereoBadgeInner: {
    borderWidth: 0.8,
    borderColor: 'rgba(198, 178, 135, 0.7)',
    borderRadius: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  stereoText: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 9.5,
    fontWeight: '900',
    color: '#EFE1BD',
    letterSpacing: 2,
  },
});
