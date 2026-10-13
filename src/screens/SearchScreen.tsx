import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import {
  Search,
  X,
  Clock,
  Heart,
  Disc3,
  Users,
  ListMusic,
  Disc,
} from 'lucide-react-native';
import { colors, radius, typography } from '../theme/tokens';
import { RecordRow } from '../components/rows/RecordRow';
import { AlbumCoverArtwork } from '../components/artwork/AlbumCoverArtwork';
import {
  ALBUMS,
  GENRES,
  type Album,
  type Track,
  type Playlist,
} from '../data/musicData';
import {
  performSearch,
  type SearchCategory,
  type Artist,
} from '../utils/searchEngine';
import {
  loadRecentSearches,
  saveRecentSearches,
  addRecentSearchItem,
  clearRecentSearches,
  DEFAULT_RECENT_SEARCHES,
} from '../storage/searchStorage';
import { useApp } from '../context/AppContext';

type Props = {
  onSelectTrack: (track: Track) => void;
  onSelectAlbum: (album: Album) => void;
  onSelectArtist?: (artist: Artist) => void;
  onSelectPlaylist?: (playlist: Playlist) => void;
  favorites: string[];
  favoriteAlbums: string[];
  favoritePlaylists: string[];
  onToggleFavorite: (trackId: string) => void;
  onToggleFavoriteAlbum: (albumId: string) => void;
  onToggleFavoritePlaylist: (playlistId: string) => void;
};

const CATEGORIES: { key: SearchCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'songs', label: 'Songs' },
  { key: 'albums', label: 'Albums' },
  { key: 'artists', label: 'Artists' },
  { key: 'playlists', label: 'Playlists' },
];

export const SearchScreen: React.FC<Props> = ({
  onSelectTrack,
  onSelectAlbum,
  onSelectArtist,
  onSelectPlaylist,
  favorites,
  favoriteAlbums,
  favoritePlaylists,
  onToggleFavorite,
  onToggleFavoriteAlbum,
  onToggleFavoritePlaylist,
}) => {
  // Query & Category State (supports URL hash for automated QA testing)
  const [query, setQuery] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      const h = window.location.hash.toLowerCase();
      if (h === '#search-results') return 'Pet';
      if (h === '#search-empty') return 'xyznonexistent';
      if (h === '#search-filtered') return 'Beach';
    }
    return '';
  });

  const [category, setCategory] = useState<SearchCategory>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      const h = window.location.hash.toLowerCase();
      if (h === '#search-filtered') return 'songs';
    }
    return 'all';
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_RECENT_SEARCHES);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // 1. Asynchronously load recent searches from AsyncStorage on launch
  useEffect(() => {
    let isMounted = true;
    loadRecentSearches()
      .then((stored) => {
        if (isMounted) {
          setRecentSearches(stored);
          setIsHydrated(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsHydrated(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Persist recent searches on state update
  useEffect(() => {
    if (!isHydrated) return;
    saveRecentSearches(recentSearches);
  }, [recentSearches, isHydrated]);

  // 3. Listen to URL hash changes for web QA
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#search-results') {
        setQuery('Pet');
        setCategory('all');
      } else if (h === '#search-empty') {
        setQuery('xyznonexistent');
        setCategory('all');
      } else if (h === '#search-filtered') {
        setQuery('Beach');
        setCategory('songs');
      } else if (h === '#search') {
        setQuery('');
        setCategory('all');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const { allTracks } = useApp();

  // Live search execution using pure searchEngine
  const searchResults = useMemo(() => {
    return performSearch(query, category, allTracks);
  }, [query, category, allTracks]);

  // Record query into recent searches history on submit or selection
  const commitSearchQuery = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => addRecentSearchItem(trimmed, prev));
  }, []);

  const handleClearRecent = useCallback(() => {
    setRecentSearches([]);
    clearRecentSearches();
  }, []);

  const handleSelectRecent = useCallback(
    (term: string) => {
      setQuery(term);
      commitSearchQuery(term);
    },
    [commitSearchQuery]
  );

  const handleSelectArtist = useCallback(
    (artist: Artist) => {
      commitSearchQuery(artist.name);
      if (onSelectArtist) {
        onSelectArtist(artist);
      } else {
        setQuery(artist.name);
      }
    },
    [commitSearchQuery, onSelectArtist]
  );

  const handleSelectPlaylist = useCallback(
    (playlist: Playlist) => {
      commitSearchQuery(playlist.title);
      if (onSelectPlaylist) {
        onSelectPlaylist(playlist);
      } else {
        setQuery(playlist.title);
      }
    },
    [commitSearchQuery, onSelectPlaylist]
  );

  const isQueryActive = query.trim().length > 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.headerBadge}>
            <Disc size={20} color={colors.rust} strokeWidth={2.2} />
          </View>
        </View>

        {/* 2. Rounded Retro Search Input Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={colors.inkMuted} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => commitSearchQuery(query)}
            placeholder="Search artists, albums, or songs..."
            placeholderTextColor="#9A8E7E"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Clear search input"
              style={styles.clearButton}
            >
              <X size={16} color={colors.inkMuted} />
            </Pressable>
          )}
        </View>

        {/* 3. Category Filter Capsule Pills: All | Songs | Albums | Artists | Playlists */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.key;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => setCategory(cat.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                  style={({ pressed }) => [
                    styles.categoryPill,
                    isSelected ? styles.categoryPillSelected : styles.categoryPillDefault,
                    { opacity: pressed ? 0.82 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected ? styles.categoryPillTextSelected : styles.categoryPillTextDefault,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. MAIN CONTENT AREA */}
        {!isQueryActive ? (
          /* STATE A: Initial Empty Query Screen (Recent searches, Browse by genre, Featured crate) */
          <View style={styles.initialStateContainer}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <Pressable
                    onPress={handleClearRecent}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Clear recent search history"
                  >
                    <Text style={styles.clearHistoryText}>Clear</Text>
                  </Pressable>
                </View>

                <View style={styles.recentChipsWrap}>
                  {recentSearches.map((term, index) => (
                    <Pressable
                      key={`${term}-${index}`}
                      onPress={() => handleSelectRecent(term)}
                      accessibilityRole="button"
                      accessibilityLabel={`Search for ${term}`}
                      style={({ pressed }) => [
                        styles.recentChip,
                        { opacity: pressed ? 0.75 : 1 },
                      ]}
                    >
                      <Clock size={13} color={colors.inkMuted} style={{ marginRight: 6 }} />
                      <Text style={styles.recentChipText}>{term}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Browse by Genre */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Browse by Genre</Text>
              <View style={styles.genreChipsWrap}>
                {GENRES.map((g) => (
                  <Pressable
                    key={g.id}
                    onPress={() => {
                      setQuery(g.name);
                      commitSearchQuery(g.name);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Browse genre ${g.displayName}`}
                    style={({ pressed }) => [
                      styles.genreChip,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={styles.genreChipText}>{g.displayName}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Recommended from the Crate */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Recommended from the Crate</Text>
              <View style={styles.crateList}>
                {ALBUMS.slice(0, 3).map((album) => (
                  <RecordRow
                    key={album.id}
                    album={album}
                    onPress={() => onSelectAlbum(album)}
                  />
                ))}
              </View>
            </View>
          </View>
        ) : searchResults.totalCount === 0 ? (
          /* STATE C: No Matching Results State */
          <View style={styles.noResultsContainer}>
            <View style={styles.noResultsBadge}>
              <Disc3 size={36} color={colors.rust} />
            </View>
            <Text style={styles.noResultsTitle}>No Records Found</Text>
            <Text style={styles.noResultsSubtitle}>
              We couldn't find any recordings matching "{query}". Try searching for an artist, album title, or 1960s genre.
            </Text>
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Reset search query"
              style={({ pressed }) => [
                styles.resetButton,
                { opacity: pressed ? 0.88 : 1 },
              ]}
            >
              <Text style={styles.resetButtonText}>Clear Search</Text>
            </Pressable>
          </View>
        ) : (
          /* STATE B: Active Live Search Results */
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSummary}>
              {searchResults.totalCount}{' '}
              {searchResults.totalCount === 1 ? 'recording found' : 'recordings found'} for "{query}"
            </Text>

            {/* B1. Songs Section */}
            {searchResults.songs.length > 0 && (
              <View style={styles.resultSection}>
                <View style={styles.resultSectionHeader}>
                  <Text style={styles.resultSectionTitle}>Songs</Text>
                  <Text style={styles.resultSectionBadge}>
                    {searchResults.songs.length}
                  </Text>
                </View>

                <View style={styles.songsList}>
                  {searchResults.songs.map((track) => {
                    const isLiked = favorites.includes(track.id);
                    return (
                      <Pressable
                        key={track.id}
                        onPress={() => {
                          commitSearchQuery(query);
                          onSelectTrack(track);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Play ${track.title} by ${track.artist}`}
                        style={({ pressed }) => [
                          styles.songRow,
                          { opacity: pressed ? 0.75 : 1 },
                        ]}
                      >
                        <View style={styles.songCover}>
                          <AlbumCoverArtwork coverType={track.coverType} size={48} />
                        </View>

                        <View style={styles.songMeta}>
                          <Text numberOfLines={1} style={styles.songTitle}>
                            {track.title}
                          </Text>
                          <Text numberOfLines={1} style={styles.songArtist}>
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
                          style={styles.songHeartBtn}
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

            {/* B2. Albums Section */}
            {searchResults.albums.length > 0 && (
              <View style={styles.resultSection}>
                <View style={styles.resultSectionHeader}>
                  <Text style={styles.resultSectionTitle}>Albums</Text>
                  <Text style={styles.resultSectionBadge}>
                    {searchResults.albums.length}
                  </Text>
                </View>

                <View style={styles.albumsList}>
                  {searchResults.albums.map((album) => (
                    <RecordRow
                      key={album.id}
                      album={album}
                      onPress={() => {
                        commitSearchQuery(query);
                        onSelectAlbum(album);
                      }}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* B3. Artists Section */}
            {searchResults.artists.length > 0 && (
              <View style={styles.resultSection}>
                <View style={styles.resultSectionHeader}>
                  <Text style={styles.resultSectionTitle}>Artists</Text>
                  <Text style={styles.resultSectionBadge}>
                    {searchResults.artists.length}
                  </Text>
                </View>

                <View style={styles.artistsList}>
                  {searchResults.artists.map((artist) => (
                    <Pressable
                      key={artist.id}
                      onPress={() => handleSelectArtist(artist)}
                      accessibilityRole="button"
                      accessibilityLabel={`View music by ${artist.name}`}
                      style={({ pressed }) => [
                        styles.artistRow,
                        { opacity: pressed ? 0.75 : 1 },
                      ]}
                    >
                      <View style={styles.artistAvatar}>
                        <Users size={20} color={colors.rust} />
                      </View>

                      <View style={styles.artistMeta}>
                        <Text numberOfLines={1} style={styles.artistName}>
                          {artist.name}
                        </Text>
                        <Text numberOfLines={1} style={styles.artistSub}>
                          {artist.genre}  •  {artist.trackCount + artist.albumCount} releases in catalog
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* B4. Playlists Section */}
            {searchResults.playlists.length > 0 && (
              <View style={styles.resultSection}>
                <View style={styles.resultSectionHeader}>
                  <Text style={styles.resultSectionTitle}>Playlists</Text>
                  <Text style={styles.resultSectionBadge}>
                    {searchResults.playlists.length}
                  </Text>
                </View>

                <View style={styles.playlistsList}>
                  {searchResults.playlists.map((playlist) => (
                    <Pressable
                      key={playlist.id}
                      onPress={() => handleSelectPlaylist(playlist)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open playlist ${playlist.title}`}
                      style={({ pressed }) => [
                        styles.playlistRow,
                        { opacity: pressed ? 0.75 : 1 },
                      ]}
                    >
                      <View style={styles.playlistIcon}>
                        <ListMusic size={22} color={colors.rust} />
                      </View>

                      <View style={styles.playlistMeta}>
                        <Text numberOfLines={1} style={styles.playlistTitle}>
                          {playlist.title}
                        </Text>
                        <Text numberOfLines={1} style={styles.playlistSub}>
                          {playlist.subtitle}  •  {playlist.trackCount} tracks
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECE3CE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFD5BD',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECE3CE',
    borderRadius: radius.search,
    paddingHorizontal: 14,
    height: 46,
    marginTop: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DFD5BD',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.ink,
    fontWeight: '500',
  },
  clearButton: {
    padding: 6,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 15,
    paddingVertical: 7.5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  categoryPillDefault: {
    backgroundColor: '#ECE3CE',
    borderColor: '#DFD5BD',
  },
  categoryPillSelected: {
    backgroundColor: colors.rust,
    borderColor: colors.rust,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryPillTextDefault: {
    color: colors.ink,
  },
  categoryPillTextSelected: {
    color: '#FFF8EA',
  },
  initialStateContainer: {
    gap: 20,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  clearHistoryText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.rust,
  },
  recentChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE0CB',
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD0BA',
  },
  recentChipText: {
    fontSize: 12.5,
    color: colors.ink,
    fontWeight: '600',
  },
  genreChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: '#E7DCBE',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8CAA8',
  },
  genreChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.ink,
  },
  crateList: {
    gap: 2,
  },
  noResultsContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  noResultsBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECE2CB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DFD2B8',
  },
  noResultsTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 21,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: colors.rust,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  resetButtonText: {
    color: '#FFF8EA',
    fontSize: 13,
    fontWeight: '800',
  },
  resultsContainer: {
    gap: 18,
  },
  resultsSummary: {
    fontSize: 12.5,
    color: colors.inkMuted,
    fontWeight: '600',
  },
  resultSection: {
    gap: 8,
  },
  resultSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  resultSectionTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 16.5,
    fontWeight: '800',
    color: colors.ink,
  },
  resultSectionBadge: {
    backgroundColor: '#E8DEC7',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkMuted,
  },
  songsList: {
    backgroundColor: '#F9F2E2',
    borderRadius: radius.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EAE1CA',
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE3CB',
  },
  songCover: {
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 10,
  },
  songMeta: {
    flex: 1,
    gap: 2,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  songArtist: {
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  songHeartBtn: {
    padding: 8,
  },
  albumsList: {
    gap: 2,
  },
  artistsList: {
    gap: 6,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F2E2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EAE1CA',
  },
  artistAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAE0CB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  artistMeta: {
    flex: 1,
    gap: 2,
  },
  artistName: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.ink,
  },
  artistSub: {
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  playlistsList: {
    gap: 6,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F2E2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EAE1CA',
  },
  playlistIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#EAE0CB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playlistMeta: {
    flex: 1,
    gap: 2,
  },
  playlistTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.ink,
  },
  playlistSub: {
    fontSize: 11.5,
    color: colors.inkMuted,
  },
});
