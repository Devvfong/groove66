import AsyncStorage from '@react-native-async-storage/async-storage';

export const FAVORITES_STORAGE_KEYS = {
  TRACKS: '@groove66/favorite_tracks',
  ALBUMS: '@groove66/favorite_albums',
  PLAYLISTS: '@groove66/favorite_playlists',
};

export const DEFAULT_FAVORITE_TRACKS = [
  'trk-2', // Ain't No Mountain High Enough
  'trk-1', // God Only Knows
  'trk-3', // Respect
  'trk-4', // Here Comes the Sun
  'trk-5', // My Girl
  'trk-6', // California Dreamin'
];

export const DEFAULT_FAVORITE_ALBUMS = [
  'alb-3', // Pet Sounds
  'alb-7', // Songs in the Key of Life
  'alb-4', // Kind of Blue
  'alb-1', // Rubber Soul
];

export const DEFAULT_FAVORITE_PLAYLISTS = [
  'summer-66',
  'classic-soul',
  'road-trip',
];

export type FavoritesState = {
  tracks: string[];
  albums: string[];
  playlists: string[];
};

/**
 * Safely parse a JSON array from storage.
 * If data is null, corrupted, or non-array, returns fallback without crashing.
 */
function safeParseArray(raw: string | null, fallback: string[]): string[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
  } catch (err) {
    console.warn('[favoritesStorage] Corrupted storage string, falling back to default:', err);
  }
  return fallback;
}

/**
 * Loads all favorites from persistent storage (Android / Web).
 * Handles missing or corrupted storage safely.
 */
export async function loadAllFavorites(): Promise<FavoritesState> {
  try {
    const [storedTracks, storedAlbums, storedPlaylists] = await Promise.all([
      AsyncStorage.getItem(FAVORITES_STORAGE_KEYS.TRACKS),
      AsyncStorage.getItem(FAVORITES_STORAGE_KEYS.ALBUMS),
      AsyncStorage.getItem(FAVORITES_STORAGE_KEYS.PLAYLISTS),
    ]);

    return {
      tracks: safeParseArray(storedTracks, DEFAULT_FAVORITE_TRACKS),
      albums: safeParseArray(storedAlbums, DEFAULT_FAVORITE_ALBUMS),
      playlists: safeParseArray(storedPlaylists, DEFAULT_FAVORITE_PLAYLISTS),
    };
  } catch (error) {
    console.warn('[favoritesStorage] Failed to read from AsyncStorage:', error);
    return {
      tracks: DEFAULT_FAVORITE_TRACKS,
      albums: DEFAULT_FAVORITE_ALBUMS,
      playlists: DEFAULT_FAVORITE_PLAYLISTS,
    };
  }
}

/**
 * Persists favorite track IDs.
 */
export async function saveFavoriteTracks(tracks: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
  } catch (error) {
    console.warn('[favoritesStorage] Failed to write tracks to AsyncStorage:', error);
  }
}

/**
 * Persists favorite album IDs.
 */
export async function saveFavoriteAlbums(albums: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
  } catch (error) {
    console.warn('[favoritesStorage] Failed to write albums to AsyncStorage:', error);
  }
}

/**
 * Persists favorite playlist IDs.
 */
export async function saveFavoritePlaylists(playlists: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  } catch (error) {
    console.warn('[favoritesStorage] Failed to write playlists to AsyncStorage:', error);
  }
}
