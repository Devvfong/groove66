import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ArrowRight } from 'lucide-react-native';
import { JukeboxIllustration } from '../artwork/JukeboxIllustration';
import { colors, radius, typography } from '../../theme/tokens';

type Props = {
  onPress?: () => void;
};

export const JukeboxHero: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Featured: Music Brings Us Closer"
      style={({ pressed }) => [
        styles.cardContainer,
        { opacity: pressed ? 0.94 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
    >
      {/* Left side: Burnt orange field with retro 60s olive wave arc */}
      <View style={styles.leftPane}>
        {/* Retro 60s olive curve in top-left corner */}
        <View style={styles.waveOverlay} pointerEvents="none">
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Path
              d="M 0 0 L 70 0 Q 30 25 15 65 Q 5 85 0 95 Z"
              fill="#525F47"
              opacity="0.9"
            />
            <Path
              d="M 0 0 L 45 0 Q 20 20 10 50 Q 3 70 0 80 Z"
              fill="#3A534E"
              opacity="0.75"
            />
          </Svg>
        </View>

        {/* Grounding shadow and Jukebox illustration */}
        <View style={styles.jukeboxWrapper}>
          <JukeboxIllustration width={146} height={180} />
        </View>
      </View>

      {/* Right side: Dark Moss panel with vintage typography & circular CTA */}
      <View style={styles.rightPane}>
        <View style={styles.textContainer}>
          <Text style={styles.heroTitle}>Music{'\n'}Brings{'\n'}Us Closer</Text>
          <Text style={styles.heroSubtitle}>
            Discover. Listen.{'\n'}Feel Alive Again.
          </Text>
        </View>

        {/* Circular cream arrow CTA button */}
        <View style={styles.ctaButton}>
          <ArrowRight size={17} color={colors.ink} strokeWidth={2.4} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    height: 198,
    borderRadius: radius.card + 4,
    backgroundColor: '#3E4633', // Deep olive moss matching reference
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D8CCA8',
    shadowColor: '#20150E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  leftPane: {
    width: '53%',
    height: '100%',
    backgroundColor: '#BA4E2C', // Warm burnt orange field
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  waveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  jukeboxWrapper: {
    zIndex: 2,
    marginBottom: -2,
  },
  rightPane: {
    flex: 1,
    height: '100%',
    backgroundColor: '#434C37', // Dark olive moss panel
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  textContainer: {
    gap: 8,
  },
  heroTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 20.5,
    fontWeight: '900',
    color: '#F8E9CB', // Warm ivory
    lineHeight: 23.5,
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    fontSize: 11.5,
    color: '#D4CCB8',
    lineHeight: 16,
    fontWeight: '500',
  },
  ctaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBF4E4', // Cream circle
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 3,
  },
});
