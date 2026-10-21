import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AlbumCoverArtwork } from '../artwork/AlbumCoverArtwork';
import { type Album } from '../../data/musicData';
import { colors, radius, typography } from '../../theme/tokens';

export interface AlbumCardProps {
  album: Album | { id: string; title: string; artist: string; coverType: Album['coverType'] };
  size?: number;
  onPress: () => void;
}

export const AlbumCard = React.memo<AlbumCardProps>(({
  album,
  size = 104,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Album ${album.title} by ${album.artist}`}
      style={({ pressed }) => [
        styles.cardContainer,
        { width: size, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={[styles.coverContainer, { width: size, height: size }]}>
        <AlbumCoverArtwork coverType={album.coverType} size={size} />
      </View>
      <Text numberOfLines={1} style={styles.titleText}>
        {album.title}
      </Text>
      <Text numberOfLines={1} style={styles.artistText}>
        {album.artist}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 14,
  },
  coverContainer: {
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#35251C',
    elevation: 2,
    shadowColor: '#281C14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  titleText: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.ink,
  },
  artistText: {
    fontSize: 11,
    color: colors.inkMuted,
    marginTop: 1,
  },
});
