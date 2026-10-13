import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import {
  SlidersHorizontal,
  Heart,
  MoreHorizontal,
  Disc3,
  ListMusic,
  Play,
  X,
  Check,
  Compass,
} from 'lucide-react-native';
import { colors, radius, typography } from '../theme/tokens';
import { SectionHeader } from '../components/common/SectionHeader';
import { AlbumCoverArtwork } from '../components/artwork/AlbumCoverArtwork';
import { PlaylistArtwork } from '../components/artwork/PlaylistArtwork';
import {
  TRACKS,
  ALBUMS,
  PLAYLISTS,
  FAVORITE_ALBUMS,
  type Track,
  type Album,
  type Playlist,
} from '../data/musicData';

export type Segment = 'Songs' | 'Albums' | 'Playlists';

type SortOption = 'default' | 'title' | 'artist' | 'duration';

export type Props = {
  favorites: string[];
  favoriteAlbums?: string[];
  favoritePlaylists?: string[];
  onToggleFavorite: (trackId: string) => void;
  onToggleFavoriteAlbum?: (albumId: string) => void;
  onToggleFavoritePlaylist?: (playlistId: string) => void;
  onSelectTrack: (track: Track) => void;
  onSelectAlbum?: (album: Album) => void;
  onSelectPlaylist?: (playlist: Playlist) => void;
  onNavigateToTab?: (tab: 'discover' | 'records' | 'search') => void;
};

export const FavoritesScreen: React.FC<Props> = ({
  favorites,
  favoriteAlbums,
  favoritePlaylists = ['summer-66', 'classic-soul', 'road-trip'],
  onToggleFavorite,
  onToggleFavoriteAlbum,
  onToggleFavoritePlaylist,
  onSelectTrack,
  onSelectAlbum,
  onSelectPlaylist,
  onNavigateToTab,
}) => {
  const [activeSegment, setActiveSegment] = useState<Segment>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      const h = window.location.hash.toLowerCase();
      if (h.includes('albums')) return 'Albums';
      if (h.includes('playlists')) return 'Playlists';
    }
    return 'Songs';
  });
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [selectedTrackForAction, setSelectedTrackForAction] = useState<Track | null>(null);

  // For QA visual validation of empty states
  const isEmptyTest = Boolean(typeof window !== 'undefined' && window.location?.hash?.includes('empty'));

  // 1. Resolve and sort Favorite Tracks
  const favoriteTracks = useMemo(() => {
    if (isEmptyTest) return [];
    // Preserve order in favorites array (initial order matches reference)
    const tracksInOrder = favorites
      .map((id) => TRACKS.find((t) => t.id === id))
      .filter((t): t is Track => Boolean(t));

    if (sortOption === 'title') {
      return [...tracksInOrder].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortOption === 'artist') {
      return [...tracksInOrder].sort((a, b) => a.artist.localeCompare(b.artist));
    }
    if (sortOption === 'duration') {
      return [...tracksInOrder].sort((a, b) => a.duration - b.duration);
    }
    return tracksInOrder;
  }, [favorites, sortOption, isEmptyTest]);

  // 2. Resolve Favorite Albums
  const favoriteAlbumsList: Album[] = useMemo(() => {
    if (isEmptyTest) return [];
    if (favoriteAlbums && favoriteAlbums.length > 0) {
      return favoriteAlbums
        .map((id) => ALBUMS.find((a) => a.id === id))
        .filter((a): a is Album => Boolean(a));
    }
    // Fallback to seeded FAVORITE_ALBUMS
    return FAVORITE_ALBUMS.map((fa) => {
      const match = ALBUMS.find((a) => a.id === fa.albumId);
      if (match) return match;
      const fallbackAlbum: Album = {
        id: fa.id,
        title: fa.title,
        artist: fa.artist,
        year: 1966,
        genre: 'Soul',
        coverType: fa.coverType,
        labelColor: colors.rust,
      };
      return fallbackAlbum;
    });
  }, [favoriteAlbums, isEmptyTest]);

  // 3. Resolve Favorite Playlists
  const favoritePlaylistsList = useMemo(() => {
    if (isEmptyTest) return [];
    return PLAYLISTS.filter((p) => favoritePlaylists.includes(p.id));
  }, [favoritePlaylists, isEmptyTest]);

  const handlePlayAlbum = (album: Album) => {
    if (onSelectAlbum) {
      onSelectAlbum(album);
    } else {
      const track = TRACKS.find((t) => t.albumId === album.id) || TRACKS[0];
      onSelectTrack(track);
    }
  };

  const handleToggleAlbumFav = (albumId: string) => {
    if (onToggleFavoriteAlbum) {
      onToggleFavoriteAlbum(albumId);
    }
  };

  const handleTogglePlaylistFav = (playlistId: string) => {
    if (onToggleFavoritePlaylist) {
      onToggleFavoritePlaylist(playlistId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header with large serif & sort/filter affordance */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Pressable
            onPress={() => setIsSortModalVisible(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Sort and filter favorites"
            style={styles.sortButton}
          >
            <SlidersHorizontal size={22} color={colors.ink} strokeWidth={2} />
          </Pressable>
        </View>

        {/* 2. Three-way Segmented Capsule: Songs | Albums | Playlists */}
        <View style={styles.segmentedContainer}>
          {(['Songs', 'Albums', 'Playlists'] as Segment[]).map((segment) => {
            const isActive = activeSegment === segment;
            return (
              <Pressable
                key={segment}
                onPress={() => setActiveSegment(segment)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                style={({ pressed }) => [
                  styles.segmentTab,
                  isActive && styles.segmentTabActive,
                  { opacity: pressed ? 0.82 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {segment}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 3. SEGMENT CONTENT */}

        {/* A. Songs Segment */}
        {activeSegment === 'Songs' && (
          <View>
            {/* Song rows */}
            <View style={styles.songsList}>
              {favoriteTracks.map((track) => (
                <Pressable
                  key={track.id}
                  onPress={() => onSelectTrack(track)}
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${track.title}`}
                  style={({ pressed }) => [
                    styles.songRow,
                    { opacity: pressed ? 0.75 : 1 },
                  ]}
                >
                  {/* Mini square cover */}
                  <View style={styles.coverThumbnail}>
                    <AlbumCoverArtwork coverType={track.coverType} size={52} />
                  </View>

                  {/* Song title, artist, and duration */}
                  <View style={styles.songMeta}>
                    <Text numberOfLines={1} style={styles.songTitle}>
                      {track.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.songArtist}>
                      {track.artist}
                    </Text>
                    <Text style={styles.songDuration}>{track.durationFormatted}</Text>
                  </View>

                  {/* Filled Rust Heart Toggle */}
                  <Pressable
                    onPress={() => onToggleFavorite(track.id)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Remove from favorites"
                    style={styles.heartButton}
                  >
                    <Heart size={20} color={colors.rust} fill={colors.rust} />
                  </Pressable>

                  {/* More options ellipsis */}
                  <Pressable
                    onPress={() => setSelectedTrackForAction(track)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel={`Options for ${track.title}`}
                    style={styles.ellipsisButton}
                  >
                    <MoreHorizontal size={20} color={colors.inkMuted} />
                  </Pressable>
                </Pressable>
              ))}

              {/* Empty state for Songs */}
              {favoriteTracks.length === 0 && (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconBadge}>
                    <Heart size={32} color={colors.rust} strokeWidth={1.8} />
                  </View>
                  <Text style={styles.emptyTitle}>Your favorites list is empty</Text>
                  <Text style={styles.emptySubtitle}>
                    Tap the heart on any track to save it here.
                  </Text>
                  {onNavigateToTab && (
                    <Pressable
                      onPress={() => onNavigateToTab('records')}
                      style={styles.emptyActionButton}
                    >
                      <Text style={styles.emptyActionText}>Browse Records</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>

            {/* Favorite Albums Carousel (always shown under songs matching reference) */}
            <View style={styles.albumsSection}>
              <SectionHeader
                title="Favorite Albums"
                actionText="See all"
                onAction={() => setActiveSegment('Albums')}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.albumsStrip}
              >
                {favoriteAlbumsList.map((album) => (
                  <Pressable
                    key={album.id}
                    onPress={() => handlePlayAlbum(album)}
                    style={({ pressed }) => [
                      styles.albumStripCard,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <View style={styles.albumCoverContainer}>
                      <AlbumCoverArtwork coverType={album.coverType} size={104} />
                    </View>
                    <Text numberOfLines={1} style={styles.albumStripTitle}>
                      {album.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.albumStripArtist}>
                      {album.artist}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* B. Albums Segment */}
        {activeSegment === 'Albums' && (
          <View style={styles.segmentFullView}>
            {favoriteAlbumsList.length > 0 ? (
              <View style={styles.albumsGrid}>
                {favoriteAlbumsList.map((album) => (
                  <Pressable
                    key={album.id}
                    onPress={() => handlePlayAlbum(album)}
                    style={({ pressed }) => [
                      styles.albumGridCard,
                      { opacity: pressed ? 0.82 : 1 },
                    ]}
                  >
                    <View style={styles.albumGridCoverWrapper}>
                      <AlbumCoverArtwork coverType={album.coverType} size={150} />
                      <Pressable
                        onPress={() => handleToggleAlbumFav(album.id)}
                        hitSlop={10}
                        style={styles.albumGridHeartBadge}
                      >
                        <Heart size={18} color={colors.rust} fill={colors.rust} />
                      </Pressable>
                    </View>
                    <Text numberOfLines={1} style={styles.albumGridTitle}>
                      {album.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.albumGridArtist}>
                      {album.artist}
                    </Text>
                    <Text style={styles.albumGridMeta}>
                      {album.year} • {album.displayGenre || album.genre}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBadge}>
                  <Disc3 size={34} color={colors.rust} strokeWidth={1.8} />
                </View>
                <Text style={styles.emptyTitle}>No Favorite Albums Saved</Text>
                <Text style={styles.emptySubtitle}>
                  Save vinyl records from the collection to build your vintage shelf.
                </Text>
                {onNavigateToTab && (
                  <Pressable
                    onPress={() => onNavigateToTab('records')}
                    style={styles.emptyActionButton}
                  >
                    <Text style={styles.emptyActionText}>Explore Records</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        {/* C. Playlists Segment */}
        {activeSegment === 'Playlists' && (
          <View style={styles.segmentFullView}>
            {favoritePlaylistsList.length > 0 ? (
              <View style={styles.playlistsList}>
                {favoritePlaylistsList.map((playlist) => (
                  <Pressable
                    key={playlist.id}
                    onPress={() => {
                      if (onSelectPlaylist) {
                        onSelectPlaylist(playlist);
                      } else if (onNavigateToTab) {
                        onNavigateToTab('records');
                      }
                    }}
                    style={({ pressed }) => [
                      styles.playlistCard,
                      { opacity: pressed ? 0.82 : 1 },
                    ]}
                  >
                    <View style={styles.playlistArtworkThumb}>
                      <PlaylistArtwork type={playlist.type} width={72} height={72} />
                    </View>
                    <View style={styles.playlistMeta}>
                      <Text numberOfLines={1} style={styles.playlistTitle}>
                        {playlist.title}
                      </Text>
                      <Text numberOfLines={1} style={styles.playlistSubtitle}>
                        {playlist.subtitle}
                      </Text>
                      <Text style={styles.playlistTrackCount}>
                        {playlist.trackCount} tracks • 1960s Stereo Mix
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleTogglePlaylistFav(playlist.id)}
                      hitSlop={12}
                      style={styles.playlistHeartButton}
                    >
                      <Heart size={20} color={colors.rust} fill={colors.rust} />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBadge}>
                  <ListMusic size={34} color={colors.rust} strokeWidth={1.8} />
                </View>
                <Text style={styles.emptyTitle}>No Favorite Playlists</Text>
                <Text style={styles.emptySubtitle}>
                  Explore curated golden mixes on the Discover tab and save them for instant listening.
                </Text>
                {onNavigateToTab && (
                  <Pressable
                    onPress={() => onNavigateToTab('discover')}
                    style={styles.emptyActionButton}
                  >
                    <Text style={styles.emptyActionText}>Explore Discover</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* SORT MODAL */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsSortModalVisible(false)}
        >
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Favorites</Text>
              <Pressable
                onPress={() => setIsSortModalVisible(false)}
                hitSlop={10}
                style={styles.modalCloseButton}
              >
                <X size={20} color={colors.inkMuted} />
              </Pressable>
            </View>

            <View style={styles.modalDivider} />

            {(
              [
                { key: 'default', label: 'Default (Original Crate Order)' },
                { key: 'title', label: 'Song Title (A–Z)' },
                { key: 'artist', label: 'Artist Name (A–Z)' },
                { key: 'duration', label: 'Shortest Duration First' },
              ] as { key: SortOption; label: string }[]
            ).map((opt) => {
              const isSelected = sortOption === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    setSortOption(opt.key);
                    setIsSortModalVisible(false);
                  }}
                  style={({ pressed }) => [
                    styles.modalOptionItem,
                    {
                      backgroundColor: isSelected
                        ? '#EAE0CB'
                        : pressed
                        ? '#F0E7D4'
                        : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Check size={18} color={colors.rust} strokeWidth={2.5} />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      {/* TRACK ACTION MODAL */}
      <Modal
        visible={Boolean(selectedTrackForAction)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTrackForAction(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedTrackForAction(null)}
        >
          {selectedTrackForAction && (
            <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <View style={styles.actionModalTrackRow}>
                  <View style={styles.coverThumbnail}>
                    <AlbumCoverArtwork
                      coverType={selectedTrackForAction.coverType}
                      size={44}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.actionModalTitle}>
                      {selectedTrackForAction.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.actionModalArtist}>
                      {selectedTrackForAction.artist} • {selectedTrackForAction.durationFormatted}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => setSelectedTrackForAction(null)}
                  hitSlop={10}
                  style={styles.modalCloseButton}
                >
                  <X size={20} color={colors.inkMuted} />
                </Pressable>
              </View>

              <View style={styles.modalDivider} />

              {/* Action 1: Spin on Turntable */}
              <Pressable
                onPress={() => {
                  const trk = selectedTrackForAction;
                  setSelectedTrackForAction(null);
                  onSelectTrack(trk);
                }}
                style={({ pressed }) => [
                  styles.actionModalItem,
                  { backgroundColor: pressed ? '#F0E7D4' : 'transparent' },
                ]}
              >
                <Play size={18} color={colors.rust} fill={colors.rust} />
                <Text style={styles.actionModalItemText}>Spin on Turntable</Text>
              </Pressable>

              {/* Action 2: Remove from Favorites */}
              <Pressable
                onPress={() => {
                  const trk = selectedTrackForAction;
                  setSelectedTrackForAction(null);
                  onToggleFavorite(trk.id);
                }}
                style={({ pressed }) => [
                  styles.actionModalItem,
                  { backgroundColor: pressed ? '#F0E7D4' : 'transparent' },
                ]}
              >
                <Heart size={18} color={colors.rust} fill={colors.rust} />
                <Text style={styles.actionModalItemText}>Remove from Favorites</Text>
              </Pressable>

              {/* Action 3: View Album in Records */}
              {onNavigateToTab && (
                <Pressable
                  onPress={() => {
                    setSelectedTrackForAction(null);
                    onNavigateToTab('records');
                  }}
                  style={({ pressed }) => [
                    styles.actionModalItem,
                    { backgroundColor: pressed ? '#F0E7D4' : 'transparent' },
                  ]}
                >
                  <Disc3 size={18} color={colors.ink} strokeWidth={2} />
                  <Text style={styles.actionModalItemText}>View in Records Catalog</Text>
                </Pressable>
              )}
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitle: {
    fontFamily: typography.fontFamilySerifBlack,
    fontSize: 32,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  sortButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAE0CB',
    borderRadius: 24,
    padding: 4,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DFD3BD',
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 20,
  },
  segmentTabActive: {
    backgroundColor: colors.rust,
    shadowColor: '#1A0E08',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.18,
    shadowRadius: 2.5,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D1E16',
  },
  segmentTextActive: {
    color: '#FFF8EA',
  },
  songsList: {
    marginBottom: 16,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  coverThumbnail: {
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 11,
    shadowColor: '#2B1A0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  songMeta: {
    flex: 1,
    gap: 1,
    paddingRight: 4,
  },
  songTitle: {
    fontSize: 13.8,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.25,
  },
  songArtist: {
    fontSize: 12,
    color: colors.inkMuted,
    fontWeight: '500',
  },
  songDuration: {
    fontSize: 11.5,
    color: '#8E8172',
    fontWeight: '500',
  },
  heartButton: {
    padding: 6,
    marginLeft: 2,
  },
  ellipsisButton: {
    padding: 6,
    marginLeft: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAE0CB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyActionButton: {
    marginTop: 12,
    backgroundColor: colors.rust,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  emptyActionText: {
    color: '#FFF8EA',
    fontWeight: '700',
    fontSize: 13,
  },
  albumsSection: {
    marginTop: 6,
  },
  albumsStrip: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 4,
  },
  albumStripCard: {
    width: 108,
    gap: 2,
  },
  albumCoverContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2B1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  albumStripTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 6,
  },
  albumStripArtist: {
    fontSize: 11.5,
    color: colors.inkMuted,
    marginTop: 1,
  },
  segmentFullView: {
    paddingTop: 8,
  },
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  albumGridCard: {
    width: '47%',
    marginBottom: 12,
  },
  albumGridCoverWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#2B1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  albumGridHeartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 248, 234, 0.88)',
    borderRadius: 16,
    padding: 6,
  },
  albumGridTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 8,
  },
  albumGridArtist: {
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: 2,
  },
  albumGridMeta: {
    fontSize: 11,
    color: '#8E8172',
    marginTop: 1,
  },
  playlistsList: {
    gap: 12,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFE7D4',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2D7C2',
  },
  playlistArtworkThumb: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  playlistMeta: {
    flex: 1,
    marginLeft: 14,
    gap: 2,
  },
  playlistTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  playlistSubtitle: {
    fontSize: 12,
    color: colors.inkMuted,
  },
  playlistTrackCount: {
    fontSize: 11,
    color: '#8E8172',
  },
  playlistHeartButton: {
    padding: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 17, 12, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.paper,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#DFD3BD',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 19,
    fontWeight: '900',
    color: colors.ink,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E4D9C3',
    marginVertical: 14,
  },
  modalOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  modalOptionText: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: '600',
  },
  modalOptionTextSelected: {
    color: colors.rust,
    fontWeight: '800',
  },
  actionModalTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  actionModalTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  actionModalArtist: {
    fontSize: 12,
    color: colors.inkMuted,
  },
  actionModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionModalItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
});
