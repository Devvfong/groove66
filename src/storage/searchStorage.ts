import AsyncStorage from '@react-native-async-storage/async-storage';

export const SEARCH_STORAGE_KEYS = {
  RECENT_SEARCHES: '@groove66/recent_searches',
};

export const DEFAULT_RECENT_SEARCHES: string[] = [
  'The Beach Boys',
  'Pet Sounds',
  'Aretha Franklin',
  'Motown',
];

/**
 * Safely parse recent search queries from storage.
 */
function safeParseSearches(raw: string | null, fallback: string[]): string[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
  } catch (err) {
    console.warn('[searchStorage] Corrupted storage string, falling back to default:', err);
  }
  return fallback;
}

/**
 * Loads recent searches from persistent storage.
 */
export async function loadRecentSearches(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES);
    return safeParseSearches(raw, DEFAULT_RECENT_SEARCHES);
  } catch (err) {
    console.warn('[searchStorage] Failed to read recent searches from AsyncStorage:', err);
    return DEFAULT_RECENT_SEARCHES;
  }
}

/**
 * Persists recent searches to AsyncStorage.
 */
export async function saveRecentSearches(searches: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      SEARCH_STORAGE_KEYS.RECENT_SEARCHES,
      JSON.stringify(searches.slice(0, 10))
    );
  } catch (err) {
    console.warn('[searchStorage] Failed to save recent searches:', err);
  }
}

/**
 * Normalizes query string and prepends to recent list (deduplicating and capping at 10 items).
 */
export function addRecentSearchItem(query: string, current: string[]): string[] {
  const trimmed = query.trim();
  if (!trimmed) return current;
  const filtered = current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
  return [trimmed, ...filtered].slice(0, 10);
}

/**
 * Clears all recent searches from storage.
 */
export async function clearRecentSearches(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES);
  } catch (err) {
    console.warn('[searchStorage] Failed to clear recent searches:', err);
  }
}
