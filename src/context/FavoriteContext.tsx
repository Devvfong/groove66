import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  DEFAULT_FAVORITE_TRACKS,
  DEFAULT_FAVORITE_ALBUMS,
  DEFAULT_FAVORITE_PLAYLISTS,
  loadAllFavorites,
  saveFavoriteTracks,
  saveFavoriteAlbums,
  saveFavoritePlaylists,
} from '../storage/favoritesStorage';

export interface FavoriteContextType {
  favorites: string[];
  favoriteAlbums: string[];
  favoritePlaylists: string[];
  isHydrated: boolean;
  toggleFavorite: (trackId: string) => void;
  toggleFavoriteAlbum: (albumId: string) => void;
  toggleFavoritePlaylist: (playlistId: string) => void;
  isLiked: (trackId: string) => boolean;
  isAlbumLiked: (albumId: string) => boolean;
  isPlaylistLiked: (playlistId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | null>(null);

export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVORITE_TRACKS);
  const [favoriteAlbums, setFavoriteAlbums] = useState<string[]>(DEFAULT_FAVORITE_ALBUMS);
  const [favoritePlaylists, setFavoritePlaylists] = useState<string[]>(DEFAULT_FAVORITE_PLAYLISTS);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Fast O(1) Sets for memoized row rendering
  const favTracksSet = useMemo(() => new Set(favorites), [favorites]);
  const favAlbumsSet = useMemo(() => new Set(favoriteAlbums), [favoriteAlbums]);
  const favPlaylistsSet = useMemo(() => new Set(favoritePlaylists), [favoritePlaylists]);

  // Hydrate from storage on mount
  useEffect(() => {
    let isMounted = true;
    loadAllFavorites()
      .then((stored) => {
        if (isMounted) {
          setFavorites(stored.tracks);
          setFavoriteAlbums(stored.albums);
          setFavoritePlaylists(stored.playlists);
          setIsHydrated(true);
        }
      })
      .catch((err) => {
        console.warn('[FavoriteContext] Failed to hydrate favorites:', err);
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist modifications
  useEffect(() => {
    if (!isHydrated) return;
    saveFavoriteTracks(favorites);
  }, [favorites, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveFavoriteAlbums(favoriteAlbums);
  }, [favoriteAlbums, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveFavoritePlaylists(favoritePlaylists);
  }, [favoritePlaylists, isHydrated]);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  }, []);

  const toggleFavoriteAlbum = useCallback((albumId: string) => {
    setFavoriteAlbums((prev) =>
      prev.includes(albumId) ? prev.filter((id) => id !== albumId) : [...prev, albumId]
    );
  }, []);

  const toggleFavoritePlaylist = useCallback((playlistId: string) => {
    setFavoritePlaylists((prev) =>
      prev.includes(playlistId) ? prev.filter((id) => id !== playlistId) : [...prev, playlistId]
    );
  }, []);

  const isLiked = useCallback((trackId: string) => favTracksSet.has(trackId), [favTracksSet]);
  const isAlbumLiked = useCallback((albumId: string) => favAlbumsSet.has(albumId), [favAlbumsSet]);
  const isPlaylistLiked = useCallback(
    (playlistId: string) => favPlaylistsSet.has(playlistId),
    [favPlaylistsSet]
  );

  const value = useMemo<FavoriteContextType>(() => ({
    favorites,
    favoriteAlbums,
    favoritePlaylists,
    isHydrated,
    toggleFavorite,
    toggleFavoriteAlbum,
    toggleFavoritePlaylist,
    isLiked,
    isAlbumLiked,
    isPlaylistLiked,
  }), [
    favorites,
    favoriteAlbums,
    favoritePlaylists,
    isHydrated,
    toggleFavorite,
    toggleFavoriteAlbum,
    toggleFavoritePlaylist,
    isLiked,
    isAlbumLiked,
    isPlaylistLiked,
  ]);

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export function useFavorites(): FavoriteContextType {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}
