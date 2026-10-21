import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';
import { type EqualizerBand } from '../../services/equalizer/equalizerTypes';
import { colors, typography } from '../../theme/tokens';

const TRACK_HEIGHT = 150;
const THUMB_HEIGHT = 26;
const THUMB_WIDTH = 40;
const SLIDE_TRAVEL = TRACK_HEIGHT - THUMB_HEIGHT;

type Props = {
  band: EqualizerBand;
  role: string;
  isEnabled: boolean;
  isDark: boolean;
  onValueChange: (db: number) => void;
};

export const VintageSliderBand: React.FC<Props> = ({
  band,
  role,
  isEnabled,
  isDark,
  onValueChange,
}) => {
  const currentDbRef = useRef(band.levelDb);
  currentDbRef.current = band.levelDb;

  const controlsRef = useRef({ band, onValueChange, isEnabled });
  controlsRef.current = { band, onValueChange, isEnabled };
  const minDb = band.minMilliBels / 100;
  const maxDb = band.maxMilliBels / 100;
  const rangeDb = maxDb - minDb;

  const dragStartDbRef = useRef(band.levelDb);

  const calculateDbFromOffset = useCallback(
    (offsetY: number, startDb: number): number => {
      // Moving up (negative dy) increases dB
      // Full travel of 126dp covers 30 dB (+15 to -15)
      const currentBand = controlsRef.current.band;
      const min = currentBand.minMilliBels / 100;
      const max = currentBand.maxMilliBels / 100;
      const dbDelta = -(offsetY / SLIDE_TRAVEL) * (max - min);
      let targetDb = startDb + dbDelta;

      // Magnetic snap around 0 dB
      if (Math.abs(targetDb) < 0.6) {
        targetDb = 0;
      }

      // Clamp between -15 and +15, round to 0.5 dB steps
      const clamped = Math.max(min, Math.min(max, Math.round(targetDb * 2) / 2));
      return clamped;
    },
    []
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        dragStartDbRef.current = currentDbRef.current;
      },
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const nextDb = calculateDbFromOffset(gestureState.dy, dragStartDbRef.current);
        if (nextDb !== currentDbRef.current) {
          controlsRef.current.onValueChange(nextDb);
        }
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const finalDb = calculateDbFromOffset(gestureState.dy, dragStartDbRef.current);
        controlsRef.current.onValueChange(finalDb);
      },
    })
  ).current;

  // Direct track tap jump
  const handleTrackTap = (evt: GestureResponderEvent) => {
    const tapY = evt.nativeEvent.locationY;
    const ratio = Math.max(0, Math.min(1, (tapY - THUMB_HEIGHT / 2) / SLIDE_TRAVEL));
    let targetDb = maxDb - ratio * rangeDb;
    if (Math.abs(targetDb) < 0.6) {
      targetDb = 0;
    }
    const clamped = Math.max(minDb, Math.min(maxDb, Math.round(targetDb * 2) / 2));
    onValueChange(clamped);
  };

  // Convert levelDb to vertical position top
  // +15 dB -> top: 0
  //   0 dB -> top: SLIDE_TRAVEL / 2
  // -15 dB -> top: SLIDE_TRAVEL
  const ratio = (maxDb - band.levelDb) / rangeDb;
  const thumbTop = Math.max(0, Math.min(SLIDE_TRAVEL, ratio * SLIDE_TRAVEL));

  const formatGain = (db: number): string => {
    if (db > 0) return `+${db.toFixed(db % 1 === 0 ? 0 : 1)}`;
    if (db === 0) return '0';
    return `${db.toFixed(db % 1 === 0 ? 0 : 1)}`;
  };

  const isBoost = band.levelDb > 0;
  const isCut = band.levelDb < 0;

  return (
    <View
      style={styles.bandContainer}
      accessibilityRole="adjustable"
      accessibilityLabel={`${band.label} band, ${band.levelDb} decibels, ${role}`}
    >
      {/* 1. Real-time dB Value Badge */}
      <View
        style={[
          styles.gainBadge,
          {
            backgroundColor: !isEnabled
              ? isDark
                ? '#241B16'
                : '#ECE2CD'
              : isBoost
              ? '#D86F3C'
              : isCut
              ? '#3D2F28'
              : isDark
              ? '#32261F'
              : '#E2D5BE',
          },
        ]}
      >
        <Text
          style={[
            styles.gainText,
            {
              color: !isEnabled
                ? isDark
                  ? '#7C6F65'
                  : '#A89E8F'
                : isBoost
                ? '#FFFFFF'
                : isCut
                ? '#E8C5A5'
                : isDark
                ? '#F5ECDA'
                : '#4A3B2C',
            },
          ]}
        >
          {formatGain(band.levelDb)}
          <Text style={styles.dbUnit}> dB</Text>
        </Text>
      </View>

      {/* 2. Vertical Slider Track Area */}
      <View style={styles.trackWrapper}>
        {/* dB Ticks on the background */}
        <View style={styles.ticksContainer} pointerEvents="none">
          {/* +15 tick */}
          <View style={[styles.tickLine, styles.tickMajor, { top: 0 }]} />
          {/* +10 tick */}
          <View style={[styles.tickLine, { top: SLIDE_TRAVEL * 0.166 }]} />
          {/* +5 tick */}
          <View style={[styles.tickLine, { top: SLIDE_TRAVEL * 0.333 }]} />
          {/* 0 center detent (bright) */}
          <View style={[styles.tickLine, styles.tickCenter, { top: SLIDE_TRAVEL * (maxDb / rangeDb) }]} />
          {/* -5 tick */}
          <View style={[styles.tickLine, { top: SLIDE_TRAVEL * 0.666 }]} />
          {/* -10 tick */}
          <View style={[styles.tickLine, { top: SLIDE_TRAVEL * 0.833 }]} />
          {/* -15 tick */}
          <View style={[styles.tickLine, styles.tickMajor, { top: SLIDE_TRAVEL }]} />
        </View>

        {/* Center Recessed Slot */}
        <View
          style={[
            styles.slotChannel,
            {
              backgroundColor: isDark ? '#140E0B' : '#2B1C14',
              borderColor: isDark ? '#3D2B22' : '#573E2E',
            },
          ]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={handleTrackTap}
        >
          {/* Center 0 dB Reference Hairline inside slot */}
          <View style={styles.slotCenterNotch} />
        </View>

        {/* Tactile Brushed Brass / Aluminum Slider Thumb */}
        <View
          style={[
            styles.thumb,
            {
              top: thumbTop,
              opacity: isEnabled ? 1 : 0.6,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Vintage Slider Faceplate & Ribs */}
          <View style={styles.thumbFace}>
            <View style={styles.thumbGripLine} />
            <View
              style={[
                styles.thumbCenterIndicator,
                {
                  backgroundColor: !isEnabled
                    ? '#8C827A'
                    : isBoost
                    ? '#E85934'
                    : '#F4ECE1',
                },
              ]}
            />
            <View style={styles.thumbGripLine} />
          </View>
        </View>
      </View>

      {/* 3. Frequency Silkscreen Label */}
      <View style={styles.labelSection}>
        <Text
          style={[
            styles.freqLabel,
            { color: isDark ? '#F7E8C9' : '#34251B' },
          ]}
        >
          {band.label}
        </Text>
        <Text
          style={[
            styles.roleLabel,
            { color: isDark ? '#BFAFA2' : '#7D6F61' },
          ]}
        >
          {role}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bandContainer: {
    alignItems: 'center',
    width: 62,
    marginHorizontal: 1,
  },
  gainBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
    minWidth: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gainText: {
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.2,
  },
  dbUnit: {
    fontSize: 8,
    fontWeight: '600',
    opacity: 0.85,
  },
  trackWrapper: {
    height: TRACK_HEIGHT,
    width: THUMB_WIDTH + 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ticksContainer: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: THUMB_HEIGHT / 2,
    bottom: THUMB_HEIGHT / 2,
  },
  tickLine: {
    position: 'absolute',
    left: 3,
    right: 3,
    height: 1,
    backgroundColor: 'rgba(195, 175, 150, 0.22)',
  },
  tickMajor: {
    backgroundColor: 'rgba(215, 195, 170, 0.45)',
    left: 0,
    right: 0,
  },
  tickCenter: {
    backgroundColor: 'rgba(240, 180, 100, 0.65)',
    height: 1.5,
    left: 0,
    right: 0,
  },
  slotChannel: {
    width: 6,
    height: TRACK_HEIGHT - 6,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotCenterNotch: {
    position: 'absolute',
    top: (TRACK_HEIGHT - 6) / 2 - 1,
    width: 14,
    height: 2,
    backgroundColor: 'rgba(235, 190, 120, 0.45)',
    borderRadius: 1,
  },
  thumb: {
    position: 'absolute',
    left: (THUMB_WIDTH + 14 - THUMB_WIDTH) / 2,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 4,
    backgroundColor: '#C5B59E',
    borderWidth: 1.5,
    borderColor: '#7A6B5D',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbFace: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D1C4AF',
    borderRadius: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  thumbGripLine: {
    width: 18,
    height: 1,
    backgroundColor: 'rgba(80, 65, 50, 0.35)',
    marginVertical: 2,
  },
  thumbCenterIndicator: {
    width: 28,
    height: 2.5,
    borderRadius: 1,
    marginVertical: 1,
  },
  labelSection: {
    marginTop: 8,
    alignItems: 'center',
  },
  freqLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.2,
    fontFamily: typography.fontFamilySerifBold,
  },
  roleLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
