import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { X, Users, Heart } from 'lucide-react-native';
import { AlbumCoverArtwork } from '../artwork/AlbumCoverArtwork';
import { RecordRow } from '../rows/RecordRow';
import { getArtistTracks, getArtistAlbums, type Track, type Album } from '../../data/musicData';
import { type Artist } from '../../utils/searchEngine';
import { colors, radius, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  artist: Artist | null;
  onClose: () => void;
  onSelectTrack: (track: Track) => void;
  onSelectAlbum: (album: Album) => void;
  favorites: string[];
  onToggleFavorite: (trackId: string) => void;
};

export const ArtistDetailModal: React.FC<Props> = ({
  visible,
  artist,
  onClose,
  onSelectTrack,
  onSelectAlbum,
  favorites,
  onToggleFavorite,
}) => {
  if (!artist) return null;

  const tracks = getArtistTracks(artist.name);
  const albums = getArtistAlbums(artist.name);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.artistAvatar}>
                <Users size={22} color={colors.rust} />
              </View>
              <View style={styles.titleMeta}>
                <Text numberOfLines={1} style={styles.title}>
                  {artist.name}
                </Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                  {artist.genre}  •  {artist.trackCount + artist.albumCount} releases in catalog
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Close artist details"
              style={styles.closeBtn}
            >
              <X size={20} color={colors.inkMuted} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Albums by this artist */}
            {albums.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Albums ({albums.length})</Text>
                {albums.map((album) => (
                  <RecordRow
                    key={album.id}
                    album={album}
                    onPress={() => {
                      onSelectAlbum(album);
                      onClose();
                    }}
                  />
                ))}
              </View>
            )}

            {/* Songs by this artist */}
            {tracks.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Songs ({tracks.length})</Text>
                <View style={styles.songsList}>
                  {tracks.map((track) => {
                    const isLiked = favorites.includes(track.id);
                    return (
                      <Pressable
                        key={track.id}
                        onPress={() => {
                          onSelectTrack(track);
                          onClose();
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Play ${track.title} by ${track.artist}`}
                        style={({ pressed }) => [
                          styles.trackRow,
                          { opacity: pressed ? 0.75 : 1 },
                        ]}
                      >
                        <View style={styles.coverThumb}>
                          <AlbumCoverArtwork coverType={track.coverType} size={44} />
                        </View>

                        <View style={styles.meta}>
                          <Text numberOfLines={1} style={styles.trackTitle}>
                            {track.title}
                          </Text>
                          <Text numberOfLines={1} style={styles.trackSub}>
                            {track.album}  •  {track.durationFormatted}
                          </Text>
                        </View>

                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation?.();
                            onToggleFavorite(track.id);
                          }}
                          hitSlop={12}
                          accessibilityRole="button"
                          accessibilityLabel={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                          style={styles.heartBtn}
                        >
                          <Heart
                            size={20}
                            color={isLiked ? colors.rust : '#A89E8D'}
                            fill={isLiked ? colors.rust : 'none'}
                            strokeWidth={isLiked ? 2.2 : 1.8}
                          />
                        </Pressable>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 10, 6, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '82%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  artistAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ECE2CB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DFD2B8',
  },
  titleMeta: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.inkMuted,
  },
  closeBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#DFD3BD',
    marginVertical: 14,
  },
  contentScroll: {
    maxHeight: 420,
  },
  sectionBlock: {
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  songsList: {
    backgroundColor: '#F9F2E2',
    borderRadius: radius.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EAE1CA',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE3CB',
  },
  coverThumb: {
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 10,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  trackSub: {
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  heartBtn: {
    padding: 8,
  },
});
