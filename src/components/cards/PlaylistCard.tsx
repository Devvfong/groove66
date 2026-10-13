import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlaylistArtwork } from '../artwork/PlaylistArtwork';
import { type Playlist } from '../../data/musicData';
import { radius, typography } from '../../theme/tokens';

type Props = {
  playlist: Playlist;
  onPress: () => void;
  width?: number;
  height?: number;
};

export const PlaylistCard: React.FC<Props> = ({ playlist, onPress, width = 106, height = 122 }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Playlist ${playlist.title}`}
      style={({ pressed }) => [
        styles.card,
        { width, height, opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <PlaylistArtwork type={playlist.type} width={width} height={height} />
      {/* Vignette bottom gradient for text contrast */}
      <LinearGradient
        colors={['transparent', 'rgba(25, 14, 8, 0.4)', 'rgba(20, 10, 5, 0.85)']}
        style={styles.gradientOverlay}
      >
        <Text numberOfLines={2} style={styles.titleText}>
          {playlist.title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#35251C',
    shadowColor: '#281C14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 58,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  titleText: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF8E8',
    lineHeight: 16,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
