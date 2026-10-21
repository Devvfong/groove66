import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Play, Pause, Heart } from 'lucide-react-native';
import { AlbumCoverArtwork } from '../artwork/AlbumCoverArtwork';
import { type Track } from '../../data/musicData';
import { colors, radius, typography } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export interface MiniPlayerProps {
  currentTrack: Track;
  playing: boolean;
  isLiked: boolean;
  onOpenNowPlaying: () => void;
  onTogglePlay: () => void;
  onToggleFavorite: (id: string) => void;
}

export const MiniPlayer = React.memo<MiniPlayerProps>(({
  currentTrack,
  playing,
  isLiked,
  onOpenNowPlaying,
  onTogglePlay,
  onToggleFavorite,
}) => {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <Pressable
      onPress={onOpenNowPlaying}
      accessibilityRole="button"
      accessibilityLabel={`Now Playing: ${currentTrack.title} by ${currentTrack.artist}. Tap to open player.`}
      style={({ pressed }) => [
        styles.miniPlayer,
        {
          backgroundColor: isDark ? themeColors.paperLight : '#2B1E16',
          borderColor: isDark ? themeColors.hairline : 'rgba(234, 196, 123, 0.15)',
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <AlbumCoverArtwork coverType={currentTrack.coverType} size={44} />
      <View style={styles.miniMeta}>
        <Text numberOfLines={1} style={[styles.miniTitle, { color: isDark ? themeColors.ink : '#FCF6E8' }]}>
          {currentTrack.title}
        </Text>
        <Text numberOfLines={1} style={[styles.miniArtist, { color: isDark ? themeColors.inkMuted : '#D8D4CC' }]}>
          {currentTrack.artist}  •  {playing ? 'Spinning' : 'Paused'}
        </Text>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          onToggleFavorite(currentTrack.id);
        }}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        style={styles.miniActionBtn}
      >
        <Heart
          size={20}
          color={isLiked ? themeColors.rust : (isDark ? themeColors.inkMuted : '#A89E8D')}
          fill={isLiked ? themeColors.rust : 'none'}
          strokeWidth={isLiked ? 2.2 : 1.8}
        />
      </Pressable>

      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          onTogglePlay();
        }}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause' : 'Play'}
        style={[styles.miniPlayBtn, { backgroundColor: themeColors.rust }]}
      >
        {playing ? (
          <Pause size={18} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Play size={18} color="#FFFFFF" fill="#FFFFFF" style={styles.playIconOffset} />
        )}
      </Pressable>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  miniPlayer: {
    position: 'absolute',
    bottom: 60, // Sits directly on top of the 56dp bottom bar
    left: 12,
    right: 12,
    height: 58, // 56-60dp ergonomic height
    backgroundColor: '#2B1E16', // Dark wood vintage finish
    borderRadius: radius.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(234, 196, 123, 0.15)',
  },
  miniMeta: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
    justifyContent: 'center',
  },
  miniTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FCF6E8',
  },
  miniArtist: {
    fontSize: 11,
    color: '#D8D4CC',
    marginTop: 1.5,
  },
  miniActionBtn: {
    padding: 6,
    marginRight: 6,
  },
  miniPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.rust,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOffset: {
    marginLeft: 2,
  },
});
