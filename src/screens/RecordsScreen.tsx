import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Search, ShoppingCart, X, Disc3, FolderPlus } from 'lucide-react-native';
import { colors, radius, typography } from '../theme/tokens';
import { RecordRow } from '../components/rows/RecordRow';
import { AlbumActionModal } from '../components/modals/AlbumActionModal';
import { ALBUMS, TRACKS, type Album, type Track, type GenreName } from '../data/musicData';

type Props = {
  selectedGenreFilter?: GenreName | null;
  favorites?: string[];
  favoriteAlbums?: string[];
  importedTracks?: Track[];
  onToggleFavorite?: (trackId: string) => void;
  onToggleFavoriteAlbum?: (albumId: string) => void;
  onSelectAlbum: (album: Album) => void;
  onSelectTrack?: (track: Track) => void;
  onImportAudio?: () => void;
  onDeleteTrack?: (track: Track) => void;
};

type FilterCategory = 'All' | 'Soul' | 'Motown' | 'Rock' | 'Jazz';

const FILTER_PILLS: FilterCategory[] = ['All', 'Soul', 'Motown', 'Rock', 'Jazz'];

export const RecordsScreen: React.FC<Props> = ({
  selectedGenreFilter = null,
  favorites = [],
  favoriteAlbums = [],
  importedTracks = [],
  onToggleFavorite,
  onToggleFavoriteAlbum,
  onSelectAlbum,
  onSelectTrack,
  onImportAudio,
  onDeleteTrack,
}) => {
  // Map selectedGenreFilter if passed from Discover
  const initialCategory: FilterCategory = useMemo(() => {
    if (!selectedGenreFilter) return 'All';
    if (selectedGenreFilter === 'Soul') return 'Soul';
    if (selectedGenreFilter === 'Motown') return 'Motown';
    if (selectedGenreFilter === 'Jazz') return 'Jazz';
    if (selectedGenreFilter === 'British Invasion' || selectedGenreFilter === 'Surf Rock' || selectedGenreFilter === 'Psychedelic Rock') {
      return 'Rock';
    }
    return 'All';
  }, [selectedGenreFilter]);

  const [activeFilter, setActiveFilter] = useState<FilterCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbumForAction, setSelectedAlbumForAction] = useState<Album | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  useEffect(() => {
    if (selectedGenreFilter) {
      setActiveFilter(initialCategory);
    }
  }, [selectedGenreFilter, initialCategory]);

  // Map imported tracks to album cards for display
  const importedAlbums: Album[] = useMemo(() => {
    return (importedTracks || []).map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      year: t.year || 1966,
      genre: t.genre || 'Soul',
      displayGenre: 'Imported Vinyl',
      coverType: t.coverType,
      labelColor: t.labelColor,
    }));
  }, [importedTracks]);

  const allRecordAlbums = useMemo(() => {
    return [...importedAlbums, ...ALBUMS];
  }, [importedAlbums]);

  // Combined filtering: Genre pills + Search query
  const filteredAlbums = useMemo(() => {
    return allRecordAlbums.filter((album) => {
      // 1. Genre filter check
      let matchesGenre = true;
      if (activeFilter === 'Soul') {
        matchesGenre = album.genre === 'Soul' || album.displayGenre === 'Soul';
      } else if (activeFilter === 'Motown') {
        matchesGenre = album.genre === 'Motown' || album.displayGenre === 'Motown';
      } else if (activeFilter === 'Jazz') {
        matchesGenre = album.genre === 'Jazz' || album.displayGenre === 'Jazz';
      } else if (activeFilter === 'Rock') {
        matchesGenre =
          album.displayGenre === 'Rock' ||
          album.genre === 'British Invasion' ||
          album.genre === 'Surf Rock' ||
          album.genre === 'Psychedelic Rock';
      }

      // 2. Search query check (title, artist, year, genre)
      const q = searchQuery.trim().toLowerCase();
      let matchesSearch = true;
      if (q) {
        matchesSearch =
          album.title.toLowerCase().includes(q) ||
          album.artist.toLowerCase().includes(q) ||
          album.genre.toLowerCase().includes(q) ||
          (album.displayGenre && album.displayGenre.toLowerCase().includes(q)) ||
          String(album.year).includes(q);
      }

      return matchesGenre && matchesSearch;
    });
  }, [allRecordAlbums, activeFilter, searchQuery]);

  const handleSelectAlbum = (album: Album) => {
    const impTrack = importedTracks?.find((t) => t.id === album.id);
    if (impTrack && onSelectTrack) {
      onSelectTrack(impTrack);
    } else {
      onSelectAlbum(album);
    }
  };

  const handleOpenActionMenu = (album: Album) => {
    setSelectedAlbumForAction(album);
    setIsActionModalVisible(true);
  };

  const handleCloseActionMenu = () => {
    setIsActionModalVisible(false);
    setSelectedAlbumForAction(null);
  };

  // Find corresponding track for favorite check
  const correspondingTrack = useMemo(() => {
    if (!selectedAlbumForAction) return null;
    const imp = importedTracks?.find((t) => t.id === selectedAlbumForAction.id);
    if (imp) return imp;
    return TRACKS.find((t) => t.albumId === selectedAlbumForAction.id) || null;
  }, [selectedAlbumForAction, importedTracks]);

  const selectedImportedTrack = useMemo(() => {
    if (!selectedAlbumForAction) return null;
    return importedTracks?.find((t) => t.id === selectedAlbumForAction.id) || null;
  }, [selectedAlbumForAction, importedTracks]);

  const isSelectedAlbumFavorited = selectedAlbumForAction
    ? (favoriteAlbums.length > 0
        ? favoriteAlbums.includes(selectedAlbumForAction.id)
        : (correspondingTrack ? favorites.includes(correspondingTrack.id) : false))
    : false;

  const handleToggleAlbumFavorite = (album: Album) => {
    if (onToggleFavoriteAlbum) {
      onToggleFavoriteAlbum(album.id);
    } else {
      const track = TRACKS.find((t) => t.albumId === album.id);
      if (track && onToggleFavorite) {
        onToggleFavorite(track.id);
      }
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Header Row: Bold Serif Records + Shopping Cart/Crate Icon */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Records</Text>
          <Pressable
            hitSlop={12}
            onPress={onImportAudio}
            accessibilityRole="button"
            accessibilityLabel="Import audio file"
            style={({ pressed }) => [styles.cartButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ShoppingCart size={23} color={colors.ink} strokeWidth={1.8} />
          </Pressable>
        </View>

        {/* 2. Rounded Retro Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={colors.inkMuted} strokeWidth={2} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search artists, albums, or songs..."
            placeholderTextColor="#9E9383"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              style={styles.clearSearchButton}
            >
              <X size={16} color={colors.inkMuted} />
            </Pressable>
          )}
        </View>

        {/* 3. Filter Pills Row: All, Soul, Motown, Rock, Jazz */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {FILTER_PILLS.map((pill) => {
            const isSelected = activeFilter === pill;
            return (
              <Pressable
                key={pill}
                onPress={() => setActiveFilter(pill)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Filter ${pill}`}
                style={({ pressed }) => [
                  styles.pill,
                  isSelected ? styles.pillSelected : styles.pillDefault,
                  { opacity: pressed ? 0.82 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected ? styles.pillTextSelected : styles.pillTextDefault,
                  ]}
                >
                  {pill}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 3.5 Offline Vinyl Crate Banner */}
        <View style={styles.importBanner}>
          <View style={styles.importBannerLeft}>
            <Text style={styles.importBannerTitle}>Offline Vinyl Crate</Text>
            <Text style={styles.importBannerSubtitle}>
              {importedTracks && importedTracks.length > 0
                ? `${importedTracks.length} local vinyl record${importedTracks.length > 1 ? 's' : ''} ready to spin`
                : 'Import your own MP3, M4A, or WAV records'}
            </Text>
          </View>
          {Boolean(onImportAudio) && (
            <Pressable
              onPress={onImportAudio}
              accessibilityRole="button"
              accessibilityLabel="Import audio file"
              style={({ pressed }) => [
                styles.importBtn,
                { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <FolderPlus size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.importBtnText}>+ Import</Text>
            </Pressable>
          )}
        </View>

        {/* 4. Single-Column Album List with Protruding Vinyl Discs */}
        <View style={styles.listContainer}>
          {filteredAlbums.map((album) => (
            <RecordRow
              key={album.id}
              album={album}
              onPress={() => handleSelectAlbum(album)}
              onMore={() => handleOpenActionMenu(album)}
            />
          ))}

          {/* Useful Empty State when no albums match */}
          {filteredAlbums.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Disc3 size={38} color={colors.rust} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>No matching records in the crate</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No albums match "${searchQuery}" in ${activeFilter === 'All' ? 'the collection' : activeFilter}.`
                  : `No albums found for the ${activeFilter} filter.`}
              </Text>
              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                style={({ pressed }) => [
                  styles.resetButton,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <Text style={styles.resetButtonText}>Reset Search & Filters</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* 5. 3-Dot Album Action Menu Modal */}
      <AlbumActionModal
        visible={isActionModalVisible}
        album={selectedAlbumForAction}
        isFavorited={isSelectedAlbumFavorited}
        onClose={handleCloseActionMenu}
        onPlay={(album) => handleSelectAlbum(album)}
        onToggleFavorite={handleToggleAlbumFavorite}
        onDelete={
          selectedImportedTrack && onDeleteTrack
            ? () => onDeleteTrack(selectedImportedTrack)
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollView: {
    flex: 1,
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
    paddingVertical: 8,
  },
  headerTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 31,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.4,
  },
  cartButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECE3CE', // Pale muted cream matching reference
    borderRadius: radius.search + 2,
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
    fontSize: 13.5,
    color: colors.ink,
    fontWeight: '500',
  },
  clearSearchButton: {
    padding: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pillDefault: {
    backgroundColor: '#EDE4CF',
    borderColor: '#DFD6C0',
  },
  pillSelected: {
    backgroundColor: colors.rust,
    borderColor: colors.rust,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillTextDefault: {
    color: colors.ink,
  },
  pillTextSelected: {
    color: '#FFF8EA',
  },
  listContainer: {
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 44,
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9F2E2',
    borderRadius: radius.card,
    paddingHorizontal: 24,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EAE1CA',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE4CF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 8,
    backgroundColor: colors.rust,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
  },
  resetButtonText: {
    color: '#FFF8EA',
    fontSize: 13,
    fontWeight: '800',
  },
  importBanner: {
    backgroundColor: '#EDE4CF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DFD6C0',
  },
  importBannerLeft: {
    flex: 1,
    marginRight: 10,
  },
  importBannerTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  importBannerSubtitle: {
    fontSize: 12,
    color: colors.inkMuted,
  },
  importBtn: {
    backgroundColor: colors.rust,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  importBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
