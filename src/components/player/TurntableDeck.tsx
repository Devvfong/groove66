import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  AccessibilityInfo,
} from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { type Track } from '../../data/musicData';

type Props = {
  track: Track;
  playing: boolean;
  size: number;
};

export const TurntableDeck: React.FC<Props> = ({ track, playing, size }) => {
  const rotationValue = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check reduced motion setting
  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) setReduceMotion(enabled);
      })
      .catch(() => {});

    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => setReduceMotion(enabled)
    );
    return () => {
      isMounted = false;
      listener?.remove();
    };
  }, []);

  // Track rotation value to preserve continuity when paused
  useEffect(() => {
    const id = rotationValue.addListener(({ value }) => {
      currentRotation.current = value;
    });
    return () => {
      rotationValue.removeListener(id);
    };
  }, [rotationValue]);

  // Continuous rotation with smooth pause/resume
  useEffect(() => {
    if (reduceMotion) {
      if (animationRef.current) animationRef.current.stop();
      return;
    }

    if (playing) {
      const durationPerRev = 1800; // 33 1/3 RPM natural spin (~1.8s per rev)
      let isSpinning = true;

      const spinLoop = () => {
        if (!isSpinning) return;
        const startVal = currentRotation.current;
        const targetVal = startVal + 1;

        animationRef.current = Animated.timing(rotationValue, {
          toValue: targetVal,
          duration: durationPerRev,
          easing: Easing.linear,
          useNativeDriver: true,
        });

        animationRef.current.start(({ finished }) => {
          if (finished && isSpinning) {
            spinLoop();
          }
        });
      };

      spinLoop();

      return () => {
        isSpinning = false;
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    }
  }, [playing, reduceMotion, rotationValue]);

  const rotate = reduceMotion
    ? '0deg'
    : rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

  const discSize = size;
  const platterSize = discSize + 16;

  return (
    <View style={[styles.deckContainer, { width: platterSize, height: platterSize }]}>
      {/* 1. Outer Turntable Platter Bevel Ring & Shadow */}
      <View
        style={[
          styles.platterBevelRing,
          {
            width: platterSize,
            height: platterSize,
            borderRadius: platterSize / 2,
          },
        ]}
      >
        <Svg width={platterSize} height={platterSize} viewBox="0 0 320 320">
          <Defs>
            {/* Chrome metallic bevel gradient */}
            <LinearGradient id="platterChrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <Stop offset="18%" stopColor="#C8C0B4" />
              <Stop offset="42%" stopColor="#8A8277" />
              <Stop offset="68%" stopColor="#E2DDD5" />
              <Stop offset="88%" stopColor="#7E766D" />
              <Stop offset="100%" stopColor="#3C3630" />
            </LinearGradient>
            <RadialGradient id="wellRecess" cx="50%" cy="50%" r="50%">
              <Stop offset="85%" stopColor="#17120E" />
              <Stop offset="100%" stopColor="#0B0806" />
            </RadialGradient>
          </Defs>

          {/* Chrome outer bevel */}
          <Circle cx="160" cy="160" r="158" fill="url(#platterChrome)" />
          {/* Inner dark platter recess */}
          <Circle cx="160" cy="160" r="151" fill="url(#wellRecess)" />
          {/* Subtle rim highlight ring */}
          <Circle
            cx="160"
            cy="160"
            r="150"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            fill="none"
            opacity="0.3"
          />
        </Svg>
      </View>

      {/* 2. Rotating Vinyl Record */}
      <Animated.View
        style={[
          styles.vinylDisc,
          {
            width: discSize,
            height: discSize,
            borderRadius: discSize / 2,
            transform: [{ rotate }],
          },
        ]}
      >
        <Svg width={discSize} height={discSize} viewBox="0 0 280 280">
          <Defs>
            {/* Deep rich black vinyl body */}
            <LinearGradient id="vinylDeep" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#221E1B" />
              <Stop offset="45%" stopColor="#0F0D0B" />
              <Stop offset="100%" stopColor="#1E1A17" />
            </LinearGradient>

            {/* Radial micro-grooves gradient */}
            <RadialGradient id="vinylGrooveBand" cx="50%" cy="50%" r="50%">
              <Stop offset="38%" stopColor="#12100E" stopOpacity="1" />
              <Stop offset="72%" stopColor="#26211C" stopOpacity="0.85" />
              <Stop offset="100%" stopColor="#0E0C0A" stopOpacity="1" />
            </RadialGradient>

            {/* Subtle aged label cardstock */}
            <RadialGradient id="labelCardstock" cx="50%" cy="45%" r="55%">
              <Stop offset="0%" stopColor="#FFF2D6" />
              <Stop offset="75%" stopColor="#EADBBA" />
              <Stop offset="100%" stopColor="#D5C39D" />
            </RadialGradient>
          </Defs>

          {/* Vinyl Disc Base */}
          <Circle cx="140" cy="140" r="139" fill="url(#vinylDeep)" />
          <Circle cx="140" cy="140" r="136" fill="url(#vinylGrooveBand)" />

          {/* Concentric Audio Grooves (dense, high-contrast micro-rings) */}
          {[133, 128, 123, 118, 113, 108, 103, 98, 93, 88, 83, 78, 73, 68].map(
            (r, i) => (
              <Circle
                key={i}
                cx="140"
                cy="140"
                r={r}
                stroke={i % 2 === 0 ? '#38322B' : '#221C17'}
                strokeWidth={i % 3 === 0 ? '1.1' : '0.75'}
                fill="none"
                opacity={0.85}
              />
            )
          )}

          {/* Lead-in outer groove & lead-out inner lock groove */}
          <Circle
            cx="140"
            cy="140"
            r="136"
            stroke="#4A423A"
            strokeWidth="1.6"
            fill="none"
            opacity="0.75"
          />
          <Circle
            cx="140"
            cy="140"
            r="63"
            stroke="#4A423A"
            strokeWidth="1.8"
            fill="none"
            opacity="0.8"
          />

          {/* Anisotropic Diagonal Light Sheen / Grooves Specular Highlights */}
          {/* Top-left diagonal sheen */}
          <Path
            d="M 38 68 Q 140 18 242 68 Q 185 102 140 86 Q 95 102 38 68 Z"
            fill="#FFFFFF"
            opacity="0.08"
          />
          <Path
            d="M 60 76 Q 140 38 220 76 Q 175 96 140 88 Q 105 96 60 76 Z"
            fill="#FFF6E0"
            opacity="0.06"
          />
          {/* Bottom-right diagonal sheen */}
          <Path
            d="M 38 212 Q 140 262 242 212 Q 185 178 140 194 Q 95 178 38 212 Z"
            fill="#FFFFFF"
            opacity="0.08"
          />
          <Path
            d="M 60 204 Q 140 242 220 204 Q 175 184 140 192 Q 105 184 60 204 Z"
            fill="#FFF6E0"
            opacity="0.06"
          />

          {/* 3. CENTER RECORD LABEL */}
          <G id="centerRecordLabel">
            {/* Outer label paper ring */}
            <Circle
              cx="140"
              cy="140"
              r="53"
              fill="url(#labelCardstock)"
              stroke="#54483B"
              strokeWidth="1.2"
            />
            {/* Label rim decorative ring */}
            <Circle
              cx="140"
              cy="140"
              r="50.5"
              stroke="#C2AB7E"
              strokeWidth="0.8"
              fill="none"
            />

            {/* Label Graphic based on Track / Album */}
            <G transform="translate(87, 87)">
              {/* Sunset beach bars (exact match to reference) */}
              <Rect x="14" y="60" width="78" height="3.5" fill="#E89A48" />
              <Rect x="14" y="63.5" width="78" height="4" fill="#D95A34" />
              <Rect x="14" y="67.5" width="78" height="4" fill="#529690" />
              <Rect x="14" y="71.5" width="78" height="15" fill="#2F625D" />
              <Rect x="14" y="86.5" width="78" height="5.5" fill="#DFCA9C" />

              {/* Distant palm hut silhouette */}
              <Path d="M 63 60 L 67 55 L 71 60 Z" fill="#204038" />

              {/* Left Palm Tree (Framing text on left) */}
              <G transform="translate(14, 44)">
                {/* Trunk */}
                <Path
                  d="M 12 32 Q 13 15 6 1"
                  stroke="#261710"
                  strokeWidth="2.2"
                  fill="none"
                />
                {/* Fronds */}
                <Path
                  d="M 6 1 Q -1 -2 -5 2"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
                <Path
                  d="M 6 1 Q 13 -2 17 2"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
                <Path
                  d="M 6 1 Q 0 -8 -4 -8"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
                <Path
                  d="M 6 1 Q 12 -8 15 -6"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
              </G>

              {/* Right Palm Tree (Framing text on right) */}
              <G transform="translate(76, 44)">
                {/* Trunk */}
                <Path
                  d="M 6 32 Q 5 15 12 1"
                  stroke="#261710"
                  strokeWidth="2.2"
                  fill="none"
                />
                {/* Fronds */}
                <Path
                  d="M 12 1 Q 19 -2 23 2"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
                <Path
                  d="M 12 1 Q 5 -2 1 2"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
                <Path
                  d="M 12 1 Q 18 -8 22 -7"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
                <Path
                  d="M 12 1 Q 6 -8 3 -6"
                  stroke="#261710"
                  strokeWidth="1.6"
                  fill="none"
                />
              </G>

              {/* Artist Name */}
              <SvgText
                x="53"
                y="24"
                fill="#1A4452"
                fontSize="7.6"
                fontWeight="900"
                fontFamily="sans-serif"
                textAnchor="middle"
                letterSpacing="0.8"
              >
                {track.artist.toUpperCase()}
              </SvgText>

              {/* Album / Track Title */}
              <SvgText
                x="53"
                y="34.5"
                fill="#C44B2C"
                fontSize="7.2"
                fontWeight="bold"
                fontFamily="serif"
                textAnchor="middle"
                letterSpacing="0.4"
              >
                {track.album.toUpperCase()}
              </SvgText>
            </G>

            {/* Center Spindle Hole with Metallic Ring */}
            <Circle
              cx="140"
              cy="140"
              r="7.5"
              fill="#2E2822"
              stroke="#D8C8A0"
              strokeWidth="1.2"
            />
            <Circle cx="140" cy="140" r="5" fill="#0A0806" />
            <Circle
              cx="140"
              cy="140"
              r="2"
              fill="#52483E"
              opacity="0.8"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  platterBevelRing: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 12,
  },
  vinylDisc: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
});
