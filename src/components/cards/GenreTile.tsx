import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GenreArtwork } from '../artwork/GenreArtwork';
import { type GENRES } from '../../data/musicData';
import { radius, typography } from '../../theme/tokens';

type GenreItem = (typeof GENRES)[number];

type Props = {
  genre: GenreItem;
  onPress: () => void;
  width?: number;
  height?: number;
};

export const GenreTile: React.FC<Props> = ({ genre, onPress, width = 106, height = 108 }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Genre ${genre.displayName}`}
      style={({ pressed }) => [
        styles.tile,
        { width, height, opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <GenreArtwork type={genre.type} width={width} height={height} />
      {/* Dark vignette bottom for crisp readable typography */}
      <LinearGradient
        colors={['transparent', 'rgba(18, 12, 8, 0.45)', 'rgba(14, 8, 5, 0.88)']}
        style={styles.gradientOverlay}
      >
        <Text numberOfLines={2} style={styles.titleText}>
          {genre.displayName}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: radius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#35251C',
    shadowColor: '#281C14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 52,
    justifyContent: 'flex-end',
    paddingHorizontal: 9,
    paddingBottom: 8,
  },
  titleText: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFF8EA',
    lineHeight: 16,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
