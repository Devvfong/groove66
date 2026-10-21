import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { X, SlidersHorizontal, RotateCcw, Power } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useEqualizer } from '../../context/EqualizerContext';
import { VintageSliderBand } from './VintageSliderBand';
import { EQUALIZER_PRESETS } from '../../services/equalizer/EqualizerPresets';
import {
  type EqualizerPresetId,
  HARDWARE_BAND_ROLES,
} from '../../services/equalizer/equalizerTypes';
import { colors, radius, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const VintageEqualizerModal: React.FC<Props> = ({ visible, onClose }) => {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const {
    state,
    setBandLevel,
    applyPreset,
    toggleEnabled,
    resetToFlat,
  } = useEqualizer();

  if (!visible) return null;

  const isCircuitActive = state.isEnabled;
  const activePresetId = state.activePresetId;

  const handlePresetPress = (presetId: EqualizerPresetId) => {
    applyPreset(presetId);
  };

  const isCustomActive = activePresetId === 'custom';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.cabinetEnclosure,
                {
                  backgroundColor: isDark ? '#1C130E' : '#261811',
                  borderColor: isDark ? '#4A3427' : '#5A3D2D',
                  maxWidth: Math.min(width - 24, 430),
                },
              ]}
              accessibilityViewIsModal={true}
              accessibilityLabel="Vintage Audio Equalizer"
            >
              {/* Corner Brass Screws */}
              <View style={[styles.cornerScrew, styles.screwTopLeft]} />
              <View style={[styles.cornerScrew, styles.screwTopRight]} />
              <View style={[styles.cornerScrew, styles.screwBottomLeft]} />
              <View style={[styles.cornerScrew, styles.screwBottomRight]} />

              {/* 1. Header & Faceplate */}
              <View style={styles.header}>
                <View style={styles.titleArea}>
                  <View style={styles.brandBadgeRow}>
                    <SlidersHorizontal size={16} color="#D86F3C" strokeWidth={2.4} />
                    <Text style={styles.brandTitle}>GROOVE '66</Text>
                    <View style={styles.stereoPill}>
                      <Text style={styles.stereoPillText}>HI-FI STEREO</Text>
                    </View>
                  </View>
                  <Text style={styles.panelTitle}>5-BAND FREQUENCY EQUALIZER</Text>
                </View>

                {/* Close Button */}
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close equalizer"
                  style={({ pressed }) => [
                    styles.closeButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <X size={20} color="#F7E8C9" strokeWidth={2.2} />
                </Pressable>
              </View>

              {/* 2. Circuit Power & DSP Status Bar */}
              <View style={styles.circuitStatusBar}>
                <Pressable
                  onPress={toggleEnabled}
                  accessibilityRole="switch"
                  accessibilityLabel={`Equalizer circuit ${isCircuitActive ? 'Active' : 'Bypassed'}`}
                  accessibilityState={{ checked: isCircuitActive }}
                  style={[
                    styles.powerToggleBtn,
                    {
                      backgroundColor: isCircuitActive ? '#3B261A' : '#221914',
                      borderColor: isCircuitActive ? '#D86F3C' : '#594436',
                    },
                  ]}
                >
                  {/* Glowing Amber Pilot Jewel */}
                  <View
                    style={[
                      styles.pilotJewel,
                      {
                        backgroundColor: isCircuitActive ? '#FF6B35' : '#4A382D',
                        shadowColor: isCircuitActive ? '#FF8C42' : 'transparent',
                        shadowOpacity: isCircuitActive ? 0.9 : 0,
                        shadowRadius: 6,
                        elevation: isCircuitActive ? 5 : 0,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.powerToggleText,
                      { color: isCircuitActive ? '#FFDEC7' : '#9E8D80' },
                    ]}
                  >
                    {!isCircuitActive ? 'EQ BYPASS' : state.isAttached ? 'CIRCUIT ENGAGED' : 'EQ WAITING'}
                  </Text>
                </Pressable>

                {/* DSP Hardware Status Indicator */}
                <View style={styles.dspIndicator}>
                  <View
                    style={[
                      styles.dspDot,
                      {
                        backgroundColor: state.isAttached
                          ? '#4EBA6F'
                          : state.isSupported
                          ? '#EAC47B'
                          : '#9A8E7E',
                      },
                    ]}
                  />
                  <Text style={styles.dspStatusText}>
                    {state.isAttached
                      ? `EQ ATTACHED • #${state.currentSessionId}`
                      : state.isSupported
                      ? 'EQ AVAILABLE'
                      : 'EQ UNAVAILABLE'}
                  </Text>
                </View>
              </View>

              {/* 3. Equalizer Sliders Bay with dB Reference Scales */}
              <View style={styles.slidersBay}>
                {/* Left dB Axis Markings */}
                <View style={styles.dbScaleAxis}>
                  {[0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1].map((fraction, index) => {
                    const band = state.bands[0];
                    const db = (band.maxMilliBels - fraction * (band.maxMilliBels - band.minMilliBels)) / 100;
                    return <Text key={index} style={[styles.dbScaleText, db === 0 && styles.dbScaleCenter]}>{db > 0 ? '+' : ''}{+db.toFixed(1)}{db === 0 ? ' dB' : ''}</Text>;
                  })}
                </View>

                {/* 5 Vertical Slider Bands */}
                <View style={styles.slidersRow}>
                  {state.bands.map((band, idx) => (
                    <VintageSliderBand
                      key={`eq-band-${band.index}`}
                      band={band}
                      role={HARDWARE_BAND_ROLES[idx] || 'Tone'}
                      isEnabled={isCircuitActive}
                      isDark={isDark}
                      onValueChange={(db) => setBandLevel(band.index, db)}
                    />
                  ))}
                </View>
              </View>

              {/* 4. Vintage Mechanical Preset Selector Pushbuttons */}
              <View style={styles.presetsSection}>
                <View style={styles.presetsHeaderRow}>
                  <Text style={styles.sectionHeading}>HI-FI PRESETS</Text>
                  {isCustomActive && (
                    <View style={styles.customBadge}>
                      <Text style={styles.customBadgeText}>MANUAL CUSTOM</Text>
                    </View>
                  )}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.presetsList}
                >
                  {EQUALIZER_PRESETS.map((preset) => {
                    const isSelected = activePresetId === preset.id;
                    return (
                      <Pressable
                        key={`preset-${preset.id}`}
                        onPress={() => handlePresetPress(preset.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${preset.name} preset`}
                        style={({ pressed }) => [
                          styles.presetPushBtn,
                          isSelected && styles.presetPushBtnSelected,
                          { opacity: pressed ? 0.8 : 1 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.presetBtnName,
                            isSelected && styles.presetBtnNameSelected,
                          ]}
                        >
                          {preset.name}
                        </Text>
                        <Text
                          style={[
                            styles.presetBtnSub,
                            isSelected && styles.presetBtnSubSelected,
                          ]}
                        >
                          {preset.subtitle}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* 5. Bottom Control Actions */}
              <View style={styles.bottomBar}>
                <Pressable
                  onPress={resetToFlat}
                  accessibilityRole="button"
                  accessibilityLabel="Reset all bands to flat zero decibels"
                  style={({ pressed }) => [
                    styles.resetBtn,
                    { opacity: pressed ? 0.75 : 1 },
                  ]}
                >
                  <RotateCcw size={14} color="#C4B4A0" strokeWidth={2.2} />
                  <Text style={styles.resetBtnText}>RESET FLAT</Text>
                </Pressable>

                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close equalizer modal"
                  style={({ pressed }) => [
                    styles.doneBtn,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Text style={styles.doneBtnText}>DONE</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 6, 4, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  cabinetEnclosure: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  cornerScrew: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9E8669',
    borderWidth: 1,
    borderColor: '#4A3B2C',
  },
  screwTopLeft: { top: 8, left: 8 },
  screwTopRight: { top: 8, right: 8 },
  screwBottomLeft: { bottom: 8, left: 8 },
  screwBottomRight: { bottom: 8, right: 8 },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(215, 185, 145, 0.15)',
  },
  titleArea: {
    flex: 1,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F7E8C9',
    letterSpacing: 1.5,
    fontFamily: typography.fontFamilySerifBold,
  },
  stereoPill: {
    backgroundColor: '#3D2619',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#8A5A39',
  },
  stereoPillText: {
    color: '#EAC47B',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  panelTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#BAA792',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(247, 232, 201, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  circuitStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  powerToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1.5,
    gap: 8,
  },
  pilotJewel: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  powerToggleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dspIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dspDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dspStatusText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#A89785',
    letterSpacing: 0.5,
  },

  slidersBay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 10, 6, 0.5)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 170, 130, 0.12)',
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  dbScaleAxis: {
    width: 28,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 4,
    marginTop: 22, // aligns with slider travel
    marginBottom: 32,
  },
  dbScaleText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#8A7B6D',
    letterSpacing: -0.2,
  },
  dbScaleCenter: {
    color: '#EAC47B',
    fontWeight: '900',
  },
  slidersRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  presetsSection: {
    marginTop: 14,
  },
  presetsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A89785',
    letterSpacing: 1.2,
  },
  customBadge: {
    backgroundColor: '#4A2A1A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D86F3C',
  },
  customBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFDEC7',
    letterSpacing: 0.6,
  },
  presetsList: {
    gap: 8,
    paddingVertical: 2,
  },
  presetPushBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#2D1E16',
    borderWidth: 1.5,
    borderColor: '#4E3628',
    alignItems: 'center',
    minWidth: 70,
  },
  presetPushBtnSelected: {
    backgroundColor: '#D86F3C',
    borderColor: '#FF8F5C',
    shadowColor: '#D86F3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  presetBtnName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E0D2C0',
    letterSpacing: 0.4,
  },
  presetBtnNameSelected: {
    color: '#FFFFFF',
  },
  presetBtnSub: {
    fontSize: 8,
    fontWeight: '600',
    color: '#9C8C7D',
    marginTop: 1,
  },
  presetBtnSubSelected: {
    color: '#FFE7D9',
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(215, 185, 145, 0.15)',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  resetBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C4B4A0',
    letterSpacing: 0.8,
  },
  doneBtn: {
    backgroundColor: '#BD5940',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 6,
  },
  doneBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
