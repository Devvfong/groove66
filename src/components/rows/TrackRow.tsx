import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Heart, MoreHorizontal } from 'lucide-react-native';
import { AlbumCoverArtwork } from '../artwork/AlbumCoverArtwork';
import { type Track } from '../../data/musicData';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/tokens';

export interface TrackRowProps {
  track: Track;
  isLiked?: boolean;
  onPress: () => void;
  onToggleFavorite?: (id: string) => void;
  onMore?: () => void;
}

export const TrackRow = React.memo<TrackRowProps>(({
  track,
  isLiked = false,
  onPress,
  onToggleFavorite,
  onMore,
}) => {
  const { colors } = useTheme();
  const [imageError, setImageError] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Play ${track.title} by ${track.artist}`}
      style={({ pressed }) => [
        styles.rowContainer,
        {
          borderBottomColor: colors.hairline,
          opacity: pressed ? 0.78 : 1,
        },
      ]}
    >
      <View style={styles.coverWrapper}>
        {track.artworkUri && !imageError ? (
          <Image
            source={{ uri: track.artworkUri }}
            style={{ width: 48, height: 48, borderRadius: 4 }}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <AlbumCoverArtwork coverType={track.coverType} size={48} />
        )}
      </View>

      <View style={styles.metaContainer}>
        <Text numberOfLines={1} style={[styles.titleText, { color: colors.ink }]}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={[styles.artistText, { color: colors.inkMuted }]}>
          {track.artist}  •  {track.durationFormatted}
        </Text>
      </View>

      {Boolean(onToggleFavorite) && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleFavorite?.(track.id);
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          style={styles.actionBtn}
        >
          <Heart
            size={20}
            color={isLiked ? colors.rust : colors.inkSubtle}
            fill={isLiked ? colors.rust : 'none'}
            strokeWidth={isLiked ? 2.2 : 1.8}
          />
        </Pressable>
      )}

      {Boolean(onMore) && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onMore?.();
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Track options"
          style={styles.actionBtn}
        >
          <MoreHorizontal size={20} color={colors.inkMuted} />
        </Pressable>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  coverWrapper: {
    marginRight: 12,
  },
  metaContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 14.5,
    fontWeight: '700',
  },
  artistText: {
    fontSize: 12,
    marginTop: 2,
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
  },
});
