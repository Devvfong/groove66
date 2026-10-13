import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MoreHorizontal } from 'lucide-react-native';
import { ExposedVinyl } from '../artwork/ExposedVinyl';
import { type Album } from '../../data/musicData';
import { colors, radius, typography } from '../../theme/tokens';

type Props = {
  album: Album;
  onPress: () => void;
  onMore?: () => void;
};

export const RecordRow: React.FC<Props> = ({ album, onPress, onMore }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Album ${album.title} by ${album.artist}`}
      style={({ pressed }) => [
        styles.rowContainer,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
    >
      {/* Left: Sleeve + Protruding Vinyl */}
      <View style={styles.artworkContainer}>
        <ExposedVinyl coverType={album.coverType} labelColor={album.labelColor} size={76} />
      </View>

      {/* Middle: Artist, Album, Year • Genre */}
      <View style={styles.metaContainer}>
        <Text numberOfLines={1} style={styles.artistText}>
          {album.artist}
        </Text>
        <Text numberOfLines={2} style={styles.albumText}>
          {album.title}
        </Text>
        <Text numberOfLines={1} style={styles.subText}>
          {album.year}  •  {album.displayGenre || album.genre}
        </Text>
      </View>

      {/* Right: Ellipsis Action Button */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          onMore?.();
        }}
        hitSlop={14}
        accessibilityRole="button"
        accessibilityLabel="More options"
        style={styles.moreButton}
      >
        <MoreHorizontal size={20} color={colors.inkMuted} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F2E2', // Subtle cream card container matching reference
    borderRadius: radius.card,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#EAE1CA',
    shadowColor: '#2C1E15',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 98,
  },
  artworkContainer: {
    marginRight: 10,
  },
  metaContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 2.5,
  },
  artistText: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  albumText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 16.5,
  },
  subText: {
    fontSize: 11.5,
    color: colors.inkMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  moreButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
