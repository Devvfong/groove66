import {
  TRACKS,
  ALBUMS,
  PLAYLISTS,
  type Track,
  type Album,
  type Playlist,
} from '../data/musicData';

export type SearchCategory = 'all' | 'songs' | 'albums' | 'artists' | 'playlists';

export type Artist = {
  id: string;
  name: string;
  genre: string;
  trackCount: number;
  albumCount: number;
  leadCoverType: Album['coverType'];
  leadLabelColor: string;
};

export type SearchResults = {
  query: string;
  category: SearchCategory;
  totalCount: number;
  songs: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
};

/**
 * Normalizes query string: trim, lowercase, collapse extra spaces.
 */
export function normalizeQuery(query: string | null | undefined): string {
  if (!query) return '';
  return query
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Derives distinct Artist records from the catalog.
 */
export function getCatalogArtists(): Artist[] {
  const artistMap = new Map<string, Artist>();

  // Extract from albums
  ALBUMS.forEach((album) => {
    const name = album.artist || 'Unknown Artist';
    const key = normalizeQuery(name);
    if (!artistMap.has(key)) {
      artistMap.set(key, {
        id: `art-${key.replace(/[^a-z0-9]/g, '-')}`,
        name,
        genre: album.genre || 'Soul',
        trackCount: 0,
        albumCount: 1,
        leadCoverType: album.coverType,
        leadLabelColor: album.labelColor,
      });
    } else {
      const existing = artistMap.get(key)!;
      existing.albumCount += 1;
    }
  });

  // Extract / supplement from tracks
  TRACKS.forEach((track) => {
    const name = track.artist || 'Unknown Artist';
    const key = normalizeQuery(name);
    if (!artistMap.has(key)) {
      artistMap.set(key, {
        id: `art-${key.replace(/[^a-z0-9]/g, '-')}`,
        name,
        genre: track.genre || 'Soul',
        trackCount: 1,
        albumCount: 0,
        leadCoverType: track.coverType,
        leadLabelColor: track.labelColor,
      });
    } else {
      const existing = artistMap.get(key)!;
      existing.trackCount += 1;
    }
  });

  return Array.from(artistMap.values());
}

/**
 * Computes relevance score of text against a normalized query.
 */
function scoreMatch(primary: string, query: string, secondary = ''): number {
  const normPrimary = normalizeQuery(primary);
  const normSecondary = normalizeQuery(secondary);
  if (!normPrimary && !normSecondary) return 0;

  // Exact primary match
  if (normPrimary === query) return 100;

  // Primary starts with query
  if (normPrimary.startsWith(query)) return 80;

  // Word in primary starts with query
  const words = normPrimary.split(' ');
  if (words.some((w) => w.startsWith(query))) return 60;

  // Substring in primary
  if (normPrimary.includes(query)) return 40;

  // Secondary matches
  if (normSecondary === query) return 30;
  if (normSecondary.startsWith(query)) return 20;
  if (normSecondary.includes(query)) return 10;

  return 0;
}

/**
 * Performs search and ranks results by relevance score.
 */
export function performSearch(
  rawQuery: string,
  category: SearchCategory = 'all',
  customTracks: Track[] = TRACKS
): SearchResults {
  const q = normalizeQuery(rawQuery);

  if (!q) {
    return {
      query: '',
      category,
      totalCount: 0,
      songs: [],
      albums: [],
      artists: [],
      playlists: [],
    };
  }

  // 1. Search & Rank Tracks
  const scoredTracks: { item: Track; score: number }[] = [];
  const trackIdSet = new Set<string>();

  customTracks.forEach((t) => {
    if (trackIdSet.has(t.id)) return;
    const score = Math.max(
      scoreMatch(t.title || '', q, `${t.artist || ''} ${t.album || ''} ${t.genre || ''}`),
      scoreMatch(t.artist || '', q, t.title || '') * 0.9,
      scoreMatch(t.genre || '', q) * 0.6
    );
    if (score > 0) {
      scoredTracks.push({ item: t, score });
      trackIdSet.add(t.id);
    }
  });

  scoredTracks.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  const matchedTracks = scoredTracks.map((s) => s.item);

  // 2. Search & Rank Albums
  const scoredAlbums: { item: Album; score: number }[] = [];
  const albumIdSet = new Set<string>();

  ALBUMS.forEach((a) => {
    if (albumIdSet.has(a.id)) return;
    const score = Math.max(
      scoreMatch(a.title || '', q, `${a.artist || ''} ${a.genre || ''} ${a.year || ''}`),
      scoreMatch(a.artist || '', q, a.title || '') * 0.9,
      scoreMatch(a.genre || '', q) * 0.6
    );
    if (score > 0) {
      scoredAlbums.push({ item: a, score });
      albumIdSet.add(a.id);
    }
  });

  scoredAlbums.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  const matchedAlbums = scoredAlbums.map((s) => s.item);

  // 3. Search & Rank Artists
  const allArtists = getCatalogArtists();
  const scoredArtists: { item: Artist; score: number }[] = [];
  const artistIdSet = new Set<string>();

  allArtists.forEach((art) => {
    if (artistIdSet.has(art.id)) return;
    const score = Math.max(
      scoreMatch(art.name || '', q, art.genre || ''),
      scoreMatch(art.genre || '', q) * 0.6
    );
    if (score > 0) {
      scoredArtists.push({ item: art, score });
      artistIdSet.add(art.id);
    }
  });

  scoredArtists.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
  const matchedArtists = scoredArtists.map((s) => s.item);

  // 4. Search & Rank Playlists
  const scoredPlaylists: { item: Playlist; score: number }[] = [];
  const playlistIdSet = new Set<string>();

  PLAYLISTS.forEach((p) => {
    if (playlistIdSet.has(p.id)) return;
    const score = Math.max(
      scoreMatch(p.title || '', q, p.subtitle || ''),
      scoreMatch(p.subtitle || '', q) * 0.7
    );
    if (score > 0) {
      scoredPlaylists.push({ item: p, score });
      playlistIdSet.add(p.id);
    }
  });

  scoredPlaylists.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  const matchedPlaylists = scoredPlaylists.map((s) => s.item);

  // Group or filter by category
  if (category === 'songs') {
    return {
      query: q,
      category,
      totalCount: matchedTracks.length,
      songs: matchedTracks,
      albums: [],
      artists: [],
      playlists: [],
    };
  }

  if (category === 'albums') {
    return {
      query: q,
      category,
      totalCount: matchedAlbums.length,
      songs: [],
      albums: matchedAlbums,
      artists: [],
      playlists: [],
    };
  }

  if (category === 'artists') {
    return {
      query: q,
      category,
      totalCount: matchedArtists.length,
      songs: [],
      albums: [],
      artists: matchedArtists,
      playlists: [],
    };
  }

  if (category === 'playlists') {
    return {
      query: q,
      category,
      totalCount: matchedPlaylists.length,
      songs: [],
      albums: [],
      artists: [],
      playlists: matchedPlaylists,
    };
  }

  // category === 'all'
  const totalCount =
    matchedTracks.length +
    matchedAlbums.length +
    matchedArtists.length +
    matchedPlaylists.length;

  return {
    query: q,
    category: 'all',
    totalCount,
    songs: matchedTracks,
    albums: matchedAlbums,
    artists: matchedArtists,
    playlists: matchedPlaylists,
  };
}
