const assert = require('assert');

// Mock data matching musicData
const TRACKS = [
  { id: 'trk-1', title: 'God Only Knows', artist: 'The Beach Boys', album: 'Pet Sounds', genre: 'Surf Rock' },
  { id: 'trk-2', title: "Ain't No Mountain High Enough", artist: 'Marvin Gaye & Tammi Terrell', album: 'United', genre: 'Motown' },
  { id: 'trk-3', title: 'Respect', artist: 'Aretha Franklin', album: 'I Never Loved a Man', genre: 'Soul' },
  { id: 'trk-4', title: 'Here Comes the Sun', artist: 'The Beatles', album: 'Rubber Soul', genre: 'British Invasion' },
  { id: 'trk-5', title: 'My Girl', artist: 'The Temptations', album: 'More Hits', genre: 'Motown' },
  { id: 'trk-6', title: "California Dreamin'", artist: 'The Mamas & The Papas', album: 'Summer of Love', genre: 'Psychedelic Rock' },
];

const ALBUMS = [
  { id: 'alb-1', title: 'Rubber Soul', artist: 'The Beatles', genre: 'British Invasion' },
  { id: 'alb-3', title: 'Pet Sounds', artist: 'The Beach Boys', genre: 'Surf Rock' },
  { id: 'alb-5', title: 'More Hits by The Supremes', artist: 'The Supremes', genre: 'Motown' },
  { id: 'alb-6', title: 'Summer of Love', artist: 'The Monterey Five', genre: 'Psychedelic Rock' },
];

const PLAYLISTS = [
  { id: 'summer-66', title: "Summer of '66", subtitle: 'Sun, surf & golden vibes' },
  { id: 'classic-soul', title: 'Classic Soul', subtitle: 'Deep grooves & brass' },
  { id: 'road-trip', title: 'Road Trip Radio', subtitle: 'Cruising the Pacific Highway' },
];

function normalizeQuery(query) {
  if (!query) return '';
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

function scoreMatch(primary, query, secondary = '') {
  const normPrimary = normalizeQuery(primary);
  const normSecondary = normalizeQuery(secondary);
  if (!normPrimary && !normSecondary) return 0;
  if (normPrimary === query) return 100;
  if (normPrimary.startsWith(query)) return 80;
  const words = normPrimary.split(' ');
  if (words.some((w) => w.startsWith(query))) return 60;
  if (normPrimary.includes(query)) return 40;
  if (normSecondary === query) return 30;
  if (normSecondary.startsWith(query)) return 20;
  if (normSecondary.includes(query)) return 10;
  return 0;
}

function performSearch(rawQuery, category = 'all') {
  const q = normalizeQuery(rawQuery);
  if (!q) {
    return { query: '', category, totalCount: 0, songs: [], albums: [], artists: [], playlists: [] };
  }

  const scoredTracks = [];
  const trackIdSet = new Set();
  TRACKS.forEach((t) => {
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
  const songs = scoredTracks.map((s) => s.item);

  const scoredAlbums = [];
  const albumIdSet = new Set();
  ALBUMS.forEach((a) => {
    if (albumIdSet.has(a.id)) return;
    const score = Math.max(
      scoreMatch(a.title || '', q, `${a.artist || ''} ${a.genre || ''}`),
      scoreMatch(a.artist || '', q, a.title || '') * 0.9,
      scoreMatch(a.genre || '', q) * 0.6
    );
    if (score > 0) {
      scoredAlbums.push({ item: a, score });
      albumIdSet.add(a.id);
    }
  });
  scoredAlbums.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  const albums = scoredAlbums.map((s) => s.item);

  const scoredPlaylists = [];
  const playlistIdSet = new Set();
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
  const playlists = scoredPlaylists.map((s) => s.item);

  if (category === 'songs') return { query: q, category, totalCount: songs.length, songs, albums: [], artists: [], playlists: [] };
  if (category === 'albums') return { query: q, category, totalCount: albums.length, songs: [], albums, artists: [], playlists: [] };
  if (category === 'playlists') return { query: q, category, totalCount: playlists.length, songs: [], albums: [], artists: [], playlists };

  return { query: q, category: 'all', totalCount: songs.length + albums.length + playlists.length, songs, albums, artists: [], playlists };
}

// TEST SUITE
console.log('--- Running Search Engine Test Suite ---');

// Test 1: Empty Query
const emptyRes = performSearch('   ');
assert.strictEqual(emptyRes.totalCount, 0, 'Empty query must return 0 results');
console.log('✓ Test 1: Empty query handled cleanly');

// Test 2: Case-insensitivity & whitespace normalization
const normRes = performSearch('   gOd   oNlY   kNoWs   ');
assert.strictEqual(normRes.songs.length, 1, 'Normalized query finds God Only Knows');
assert.strictEqual(normRes.songs[0].title, 'God Only Knows');
console.log('✓ Test 2: Whitespace and case-normalization pass');

// Test 3: Ranking exact match above prefix/substring
const rankRes = performSearch('respect');
assert.strictEqual(rankRes.songs[0].title, 'Respect', 'Exact match must rank first');
console.log('✓ Test 3: Exact match ranked highest');

// Test 4: Partial artist query
const beachRes = performSearch('beach');
assert.strictEqual(beachRes.songs[0].artist, 'The Beach Boys', 'Finds songs by artist');
assert.strictEqual(beachRes.albums[0].artist, 'The Beach Boys', 'Finds albums by artist');
console.log('✓ Test 4: Partial artist query matches both songs and albums');

// Test 5: Category filtering 'songs'
const songsOnlyRes = performSearch('summer', 'songs');
assert.strictEqual(songsOnlyRes.albums.length, 0, 'Songs category returns 0 albums');
assert.strictEqual(songsOnlyRes.playlists.length, 0, 'Songs category returns 0 playlists');
assert(songsOnlyRes.songs.length > 0, 'Songs category returns matching songs');
console.log('✓ Test 5: Category filtering returns only requested category');

// Test 6: Category filtering 'albums'
const albumsOnlyRes = performSearch('summer', 'albums');
assert.strictEqual(albumsOnlyRes.songs.length, 0, 'Albums category returns 0 songs');
assert.strictEqual(albumsOnlyRes.albums.length, 1, 'Albums category returns 1 album');
assert.strictEqual(albumsOnlyRes.albums[0].title, 'Summer of Love');
console.log('✓ Test 6: Albums category returns only albums');

// Test 7: Category filtering 'playlists'
const playOnlyRes = performSearch('summer', 'playlists');
assert.strictEqual(playOnlyRes.songs.length, 0, 'Playlists category returns 0 songs');
assert.strictEqual(playOnlyRes.playlists.length, 1, 'Playlists category returns 1 playlist');
assert.strictEqual(playOnlyRes.playlists[0].id, 'summer-66');
console.log('✓ Test 7: Playlists category returns only playlists');

// Test 8: No matching results
const noRes = performSearch('zzznonsense99');
assert.strictEqual(noRes.totalCount, 0, 'No match returns totalCount 0');
assert.strictEqual(noRes.songs.length, 0);
console.log('✓ Test 8: Unmatched query returns clean empty results');

// Test 9: Deduplication by ID
const dupRes = performSearch('soul');
const trackIds = dupRes.songs.map((s) => s.id);
const uniqueTrackIds = new Set(trackIds);
assert.strictEqual(trackIds.length, uniqueTrackIds.size, 'Track IDs must be unique');
console.log('✓ Test 9: Results are deduplicated by stable ID');

// Test 10: Missing metadata resilience
const safeRes = scoreMatch(undefined, 'query', null);
assert.strictEqual(safeRes, 0, 'Undefined properties do not throw');
console.log('✓ Test 10: Missing metadata handled safely without exceptions');

console.log('--- ALL 10 SEARCH TESTS PASSED ---');
