import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { X, Play, Heart, ListMusic } from 'lucide-react-native';
import { AlbumCoverArtwork } from '../artwork/AlbumCoverArtwork';
import { getPlaylistTracks, type Playlist, type Track } from '../../data/musicData';
import { colors, radius, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  playlist: Playlist | null;
  onClose: () => void;
  onSelectTrack: (track: Track) => void;
  onPlayAll: (tracks: Track[]) => void;
  favorites: string[];
  onToggleFavorite: (trackId: string) => void;
};

export const PlaylistDetailModal: React.FC<Props> = ({
  visible,
  playlist,
  onClose,
  onSelectTrack,
  onPlayAll,
  favorites,
  onToggleFavorite,
}) => {
  if (!playlist) return null;

  const tracks = getPlaylistTracks(playlist.id);

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
              <View style={styles.playlistIcon}>
                <ListMusic size={22} color={colors.rust} />
              </View>
              <View style={styles.titleMeta}>
                <Text numberOfLines={1} style={styles.title}>
                  {playlist.title}
                </Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                  {playlist.subtitle}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Close playlist details"
              style={styles.closeBtn}
            >
              <X size={20} color={colors.inkMuted} />
            </Pressable>
          </View>

          {/* Action Row: Play All CTA */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => {
                onPlayAll(tracks);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Play all ${tracks.length} tracks in ${playlist.title}`}
              style={({ pressed }) => [
                styles.playAllBtn,
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <Play size={16} color="#FFF8EA" fill="#FFF8EA" style={{ marginRight: 6 }} />
              <Text style={styles.playAllText}>Play All ({tracks.length} Tracks)</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          {/* Track List */}
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {tracks.map((track, index) => {
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
                  <Text style={styles.indexNum}>{index + 1}</Text>

                  <View style={styles.coverThumb}>
                    <AlbumCoverArtwork coverType={track.coverType} size={44} />
                  </View>

                  <View style={styles.meta}>
                    <Text numberOfLines={1} style={styles.trackTitle}>
                      {track.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.trackArtist}>
                      {track.artist}  •  {track.durationFormatted}
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
    maxHeight: '80%',
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
  playlistIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
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
  actionRow: {
    marginTop: 14,
  },
  playAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.rust,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
  },
  playAllText: {
    color: '#FFF8EA',
    fontSize: 13.5,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#DFD3BD',
    marginVertical: 14,
  },
  list: {
    maxHeight: 380,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  indexNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkMuted,
    width: 22,
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
  trackArtist: {
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  heartBtn: {
    padding: 8,
  },
});
