import React, { useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Pause, Heart } from 'lucide-react-native';
import { colors, typography } from './src/theme/tokens';
import {
  useFonts,
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_800ExtraBold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import * as SplashScreen from 'expo-splash-screen';
import { RetroBottomBar } from './src/components/layout/RetroBottomBar';
import { AlbumCoverArtwork } from './src/components/artwork/AlbumCoverArtwork';
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { RecordsScreen } from './src/screens/RecordsScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { NowPlayingScreen } from './src/screens/NowPlayingScreen';
import { PlaylistDetailModal } from './src/components/modals/PlaylistDetailModal';
import { ArtistDetailModal } from './src/components/modals/ArtistDetailModal';
import { DemoNoticeModal } from './src/components/modals/DemoNoticeModal';
import { PLAYLISTS } from './src/data/musicData';
import { AppProvider, useApp } from './src/context/AppContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

function MainApp() {
  const insets = useSafeAreaInsets();
  const {
    activeTab,
    isNowPlaying,
    currentTrack,
    playing,
    progressSeconds,
    duration,
    isLiked,
    shuffle,
    repeat,
    repeatMode,
    hasStartedPlayback,
    importedTracks,
    demoNoticeTrack,
    setDemoNoticeTrack,
    importAudioFile,
    playSampleTrack,
    deleteTrack,
    favorites,
    favoriteAlbums,
    favoritePlaylists,
    selectedGenreFilter,
    selectedPlaylistModal,
    selectedArtistModal,

    setActiveTab,
    openNowPlaying,
    closeNowPlaying,
    setSelectedGenreFilter,
    openPlaylistModal,
    closePlaylistModal,
    openArtistModal,
    closeArtistModal,

    playTrack,
    playAlbum,
    playAllTracks,
    togglePlay,
    stepTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    toggleFavoriteAlbum,
    toggleFavoritePlaylist,
  } = useApp();

  return (
    <View style={styles.rootContainer}>
      <StatusBar
        barStyle={isNowPlaying ? 'light-content' : 'dark-content'}
        backgroundColor={isNowPlaying ? colors.woodDeep : colors.paper}
      />

      {isNowPlaying ? (
        <View style={[styles.screenContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <NowPlayingScreen
            track={currentTrack}
            playing={playing}
            progressSeconds={progressSeconds}
            duration={duration}
            liked={isLiked}
            shuffle={shuffle}
            repeat={repeat}
            repeatMode={repeatMode}
            onBack={closeNowPlaying}
            onTogglePlay={togglePlay}
            onStepTrack={stepTrack}
            onToggleLike={() => toggleFavorite(currentTrack.id)}
            onToggleShuffle={toggleShuffle}
            onToggleRepeat={toggleRepeat}
            onSeek={seekTo}
            onSelectTrack={playTrack}
          />
        </View>
      ) : (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
          {/* Main Tab Views with display toggle to preserve state and scroll position */}
          <View style={styles.mainTabContent}>
            <View
              style={[
                styles.tabPane,
                activeTab === 'discover' ? styles.paneVisible : styles.paneHidden,
              ]}
            >
              <DiscoverScreen
                onOpenPlayer={openNowPlaying}
                onSelectPlaylist={(playlistId) => {
                  const pl = PLAYLISTS.find((p) => p.id === playlistId) || PLAYLISTS[0];
                  openPlaylistModal(pl);
                }}
                onSelectGenre={(genre) => {
                  setSelectedGenreFilter(genre);
                  setActiveTab('records');
                }}
                onOpenSettings={() => {}}
              />
            </View>

            <View
              style={[
                styles.tabPane,
                activeTab === 'records' ? styles.paneVisible : styles.paneHidden,
              ]}
            >
              <RecordsScreen
                selectedGenreFilter={selectedGenreFilter}
                favorites={favorites}
                favoriteAlbums={favoriteAlbums}
                importedTracks={importedTracks}
                onToggleFavorite={toggleFavorite}
                onToggleFavoriteAlbum={toggleFavoriteAlbum}
                onSelectAlbum={playAlbum}
                onSelectTrack={playTrack}
                onImportAudio={importAudioFile}
                onDeleteTrack={deleteTrack}
              />
            </View>

            <View
              style={[
                styles.tabPane,
                activeTab === 'favorites' ? styles.paneVisible : styles.paneHidden,
              ]}
            >
              <FavoritesScreen
                favorites={favorites}
                favoriteAlbums={favoriteAlbums}
                favoritePlaylists={favoritePlaylists}
                onToggleFavorite={toggleFavorite}
                onToggleFavoriteAlbum={toggleFavoriteAlbum}
                onToggleFavoritePlaylist={toggleFavoritePlaylist}
                onSelectTrack={playTrack}
                onSelectAlbum={playAlbum}
                onSelectPlaylist={openPlaylistModal}
                onNavigateToTab={(tab) => {
                  if (tab === 'records') setSelectedGenreFilter(null);
                  setActiveTab(tab);
                }}
              />
            </View>

            <View
              style={[
                styles.tabPane,
                activeTab === 'search' ? styles.paneVisible : styles.paneHidden,
              ]}
            >
              <SearchScreen
                onSelectTrack={playTrack}
                onSelectAlbum={playAlbum}
                onSelectArtist={openArtistModal}
                onSelectPlaylist={openPlaylistModal}
                favorites={favorites}
                favoriteAlbums={favoriteAlbums}
                favoritePlaylists={favoritePlaylists}
                onToggleFavorite={toggleFavorite}
                onToggleFavoriteAlbum={toggleFavoriteAlbum}
                onToggleFavoritePlaylist={toggleFavoritePlaylist}
              />
            </View>
          </View>

          {/* Conditional Mini Player (only after playback started, per D-011) */}
          {hasStartedPlayback && (
            <Pressable
              onPress={openNowPlaying}
              style={({ pressed }) => [
                styles.miniPlayer,
                { opacity: pressed ? 0.92 : 1 },
              ]}
            >
              <AlbumCoverArtwork coverType={currentTrack.coverType} size={42} />
              <View style={styles.miniMeta}>
                <Text numberOfLines={1} style={styles.miniTitle}>
                  {currentTrack.title}
                </Text>
                <Text numberOfLines={1} style={styles.miniArtist}>
                  {currentTrack.artist}  •  {playing ? 'Spinning' : 'Paused'}
                </Text>
              </View>

              <Pressable
                onPress={() => toggleFavorite(currentTrack.id)}
                hitSlop={10}
                style={styles.miniButton}
              >
                <Heart
                  size={19}
                  color={isLiked ? colors.rust : '#A89E8D'}
                  fill={isLiked ? colors.rust : 'none'}
                />
              </Pressable>

              <Pressable
                onPress={togglePlay}
                hitSlop={10}
                style={[styles.miniButton, styles.miniPlayButton]}
              >
                {playing ? (
                  <Pause size={17} color={colors.paper} fill={colors.paper} />
                ) : (
                  <Play size={17} color={colors.paper} fill={colors.paper} style={{ marginLeft: 2 }} />
                )}
              </Pressable>
            </Pressable>
          )}

          {/* Persistent Custom Four-Tab Bottom Bar */}
          <RetroBottomBar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              if (tab === 'records') setSelectedGenreFilter(null);
              setActiveTab(tab);
            }}
            bottomInset={insets.bottom}
          />
        </View>
      )}

      {/* Detail Modals */}
      <PlaylistDetailModal
        visible={Boolean(selectedPlaylistModal)}
        playlist={selectedPlaylistModal}
        onClose={closePlaylistModal}
        onSelectTrack={playTrack}
        onPlayAll={playAllTracks}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      <ArtistDetailModal
        visible={Boolean(selectedArtistModal)}
        artist={selectedArtistModal}
        onClose={closeArtistModal}
        onSelectTrack={playTrack}
        onSelectAlbum={playAlbum}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      <DemoNoticeModal
        visible={Boolean(demoNoticeTrack)}
        track={demoNoticeTrack}
        onClose={() => setDemoNoticeTrack(null)}
        onImportAudio={importAudioFile}
        onPlaySample={playSampleTrack}
      />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_800ExtraBold,
    Fraunces_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainTabContent: {
    flex: 1,
  },
  tabPane: {
    flex: 1,
  },
  paneVisible: {
    display: 'flex',
  },
  paneHidden: {
    display: 'none',
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#35251C', // Dark walnut bar
    marginHorizontal: 12,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    shadowColor: '#1A1009',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  miniMeta: {
    flex: 1,
    marginLeft: 10,
    gap: 2,
  },
  miniTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 13,
    fontWeight: '800',
    color: '#F8E9CB',
  },
  miniArtist: {
    fontSize: 11,
    color: '#C8BA9F',
  },
  miniButton: {
    padding: 8,
  },
  miniPlayButton: {
    backgroundColor: colors.rust,
    borderRadius: 18,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});
