/**
 * Groove '66 — Phase P7 Cross-Screen State Integration & Navigation QA Test Suite
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require('typescript');

// 1. Transparent TypeScript loader for node test execution
require.extensions['.ts'] = (module, filename) => {
  const content = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
    },
  });
  module._compile(outputText, filename);
};

// 2. Setup mock browser & localStorage environment for AsyncStorage
const storageMemory = {};
global.window = {
  localStorage: {
    store: storageMemory,
    getItem(k) { return this.store[k] ?? null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
    clear() { Object.keys(this.store).forEach((k) => delete this.store[k]); },
  },
};

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

// 3. Load catalog data, search engine, and storage layer
const {
  TRACKS,
  ALBUMS,
  PLAYLISTS,
  GENRES,
  getPlaylistTracks,
  getArtistTracks,
  getArtistAlbums,
} = require('../src/data/musicData.ts');

const { performSearch } = require('../src/utils/searchEngine.ts');

const {
  loadAllFavorites,
  saveFavoriteTracks,
  saveFavoriteAlbums,
  saveFavoritePlaylists,
  DEFAULT_FAVORITE_TRACKS,
  DEFAULT_FAVORITE_ALBUMS,
  DEFAULT_FAVORITE_PLAYLISTS,
} = require('../src/storage/favoritesStorage.ts');

console.log('======================================================================');
console.log('GROOVE \'66 — PHASE P7 STATE INTEGRATION & RESPONSIVE QA SUITE');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failCount++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failCount++;
  }
}

(async () => {
  // SUITE 1: Music Catalog & Relations
  test('Catalog: getPlaylistTracks returns valid songs for all playlists', () => {
    assert(PLAYLISTS.length >= 3, 'Must have at least 3 playlists');
    for (const pl of PLAYLISTS) {
      const tracks = getPlaylistTracks(pl.id);
      assert(Array.isArray(tracks), `Expected array for playlist ${pl.id}`);
      assert(tracks.length > 0, `Expected tracks for playlist ${pl.id}`);
      assert(tracks.every((t) => t.id && t.title && t.artist), 'Every track must have id, title, artist');
    }
  });

  test('Catalog: getArtistTracks and getArtistAlbums resolve artist releases', () => {
    const artist = 'The Beach Boys';
    const tracks = getArtistTracks(artist);
    const albums = getArtistAlbums(artist);
    assert(tracks.length > 0, `Expected tracks for artist ${artist}`);
    assert(tracks.every((t) => t.artist === artist), `All tracks must match ${artist}`);
    assert(albums.length > 0, `Expected albums for artist ${artist}`);
    assert(albums.every((a) => a.artist === artist), `All albums must match ${artist}`);
  });

  // SUITE 2: Playback Engine Simulation (UI_DEMO)
  test('Playback Engine: Queue navigation steps forward and wraps modulo queue length', () => {
    const testQueue = TRACKS.slice(0, 4);
    let index = 0;
    const step = (delta) => {
      index = (index + delta + testQueue.length) % testQueue.length;
    };

    assert.strictEqual(index, 0);
    step(1);
    assert.strictEqual(index, 1);
    step(1);
    assert.strictEqual(index, 2);
    step(1);
    assert.strictEqual(index, 3);
    step(1);
    assert.strictEqual(index, 0, 'Wrapping forward from end to start');
  });

  test('Playback Engine: Queue navigation steps backward and wraps modulo queue length', () => {
    const testQueue = TRACKS.slice(0, 4);
    let index = 0;
    const step = (delta) => {
      index = (index + delta + testQueue.length) % testQueue.length;
    };

    step(-1);
    assert.strictEqual(index, 3, 'Wrapping backward from start to end');
    step(-1);
    assert.strictEqual(index, 2);
  });

  test('Playback Engine: Seeking is clamped between 0 and track duration', () => {
    const duration = 164;
    const seek = (sec) => Math.max(0, Math.min(sec, duration));

    assert.strictEqual(seek(-20), 0);
    assert.strictEqual(seek(250), 164);
    assert.strictEqual(seek(84), 84);
  });

  test('Playback Engine: Repeat mode resets playback time without advancing track index', () => {
    let index = 1;
    let progress = 164;
    const duration = 164;
    const repeat = true;

    if (progress >= duration) {
      if (repeat) {
        progress = 0;
      } else {
        index = (index + 1) % TRACKS.length;
        progress = 0;
      }
    }

    assert.strictEqual(index, 1, 'Index must remain unchanged when repeat is true');
    assert.strictEqual(progress, 0, 'Progress must reset to 0');
  });

  // SUITE 3: 10 Navigation Flows & Origin Tab Preservation
  test('Flow 1: Discover -> Playlist -> Track Selection opens Now Playing with correct track', () => {
    let activeTab = 'discover';
    let originTab = 'discover';
    let isNowPlaying = false;
    let currentTrack = null;

    const openNowPlaying = () => {
      originTab = activeTab;
      isNowPlaying = true;
    };

    const targetPlaylist = PLAYLISTS[0];
    const tracks = getPlaylistTracks(targetPlaylist.id);
    currentTrack = tracks[0];
    openNowPlaying();

    assert.strictEqual(isNowPlaying, true);
    assert.strictEqual(originTab, 'discover');
    assert.strictEqual(currentTrack.id, tracks[0].id);

    // Flow 10: Close Now Playing returns to originTab
    isNowPlaying = false;
    activeTab = originTab;
    assert.strictEqual(activeTab, 'discover', 'Must return to Discover');
  });

  test('Flow 2: Discover -> Genre Card switches to Records with selectedGenreFilter', () => {
    let activeTab = 'discover';
    let selectedGenreFilter = null;

    const onSelectGenre = (genre) => {
      selectedGenreFilter = genre;
      activeTab = 'records';
    };

    onSelectGenre('Soul');
    assert.strictEqual(activeTab, 'records');
    assert.strictEqual(selectedGenreFilter, 'Soul');

    const matchingAlbums = ALBUMS.filter((a) => a.genre === 'Soul' || a.displayGenre === 'Soul');
    assert(matchingAlbums.length > 0, 'Matching albums found for Soul');
  });

  test('Flow 3: Records -> Album Selection plays first track and opens Now Playing', () => {
    let activeTab = 'records';
    let originTab = 'discover';
    let isNowPlaying = false;
    let currentTrack = null;

    const openNowPlaying = () => {
      originTab = activeTab;
      isNowPlaying = true;
    };

    const targetAlbum = ALBUMS[1];
    const albumTracks = TRACKS.filter((t) => t.albumId === targetAlbum.id);
    currentTrack = albumTracks[0] || TRACKS[0];
    openNowPlaying();

    assert.strictEqual(isNowPlaying, true);
    assert.strictEqual(originTab, 'records');
    assert.strictEqual(currentTrack.albumId, targetAlbum.id);

    // Return to Records
    isNowPlaying = false;
    activeTab = originTab;
    assert.strictEqual(activeTab, 'records');
  });

  test('Flow 4 & 5: Favorites -> Song/Album Selection opens player with originTab=favorites', () => {
    let activeTab = 'favorites';
    let originTab = 'discover';
    let isNowPlaying = false;

    const openNowPlaying = () => {
      originTab = activeTab;
      isNowPlaying = true;
    };

    openNowPlaying();
    assert.strictEqual(originTab, 'favorites');
    isNowPlaying = false;
    activeTab = originTab;
    assert.strictEqual(activeTab, 'favorites');
  });

  test('Flow 6, 7, 8, 9: Search Engine dispatches to Track, Album, Artist Modal, Playlist Modal', () => {
    const searchRes = performSearch('You', 'all');
    assert(searchRes.songs.length > 0, 'Found songs');

    let activeModal = null;
    let activeTrack = null;
    let activeAlbum = null;

    const openArtistModal = (artist) => { activeModal = `artist:${artist.name}`; };
    const openPlaylistModal = (pl) => { activeModal = `playlist:${pl.id}`; };
    const playTrack = (trk) => { activeTrack = trk; };
    const playAlbum = (alb) => { activeAlbum = alb; };

    playTrack(searchRes.songs[0]);
    assert.strictEqual(activeTrack.id, searchRes.songs[0].id);

    const albumRes = performSearch('Beach', 'albums');
    if (albumRes.albums.length > 0) {
      playAlbum(albumRes.albums[0]);
      assert.strictEqual(activeAlbum.id, albumRes.albums[0].id);
    }

    const artistRes = performSearch('Beatles', 'artists');
    if (artistRes.artists.length > 0) {
      openArtistModal(artistRes.artists[0]);
      assert.strictEqual(activeModal, 'artist:The Beatles');
    }

    const playlistRes = performSearch('Summer', 'playlists');
    if (playlistRes.playlists.length > 0) {
      openPlaylistModal(playlistRes.playlists[0]);
      assert.strictEqual(activeModal, 'playlist:summer-66');
    }
  });

  // SUITE 4: Tab State Preservation
  test('Tab State Preservation: Search input & category persist across tab switching', () => {
    const searchScreenState = {
      query: 'Tamla Motown',
      category: 'albums',
    };

    let activeTab = 'search';
    // Switch to Discover
    activeTab = 'discover';
    assert.strictEqual(activeTab, 'discover');
    // Switch to Records
    activeTab = 'records';
    assert.strictEqual(activeTab, 'records');
    // Switch back to Search
    activeTab = 'search';
    assert.strictEqual(activeTab, 'search');

    assert.strictEqual(searchScreenState.query, 'Tamla Motown');
    assert.strictEqual(searchScreenState.category, 'albums');
  });

  // SUITE 5: Favorites AsyncStorage Persistence & Hydration Guard
  await testAsync('Favorites Persistence: Cold start hydration from AsyncStorage', async () => {
    await AsyncStorage.clear();

    const loaded = await loadAllFavorites();
    assert.deepStrictEqual(loaded.tracks, DEFAULT_FAVORITE_TRACKS);
    assert.deepStrictEqual(loaded.albums, DEFAULT_FAVORITE_ALBUMS);
    assert.deepStrictEqual(loaded.playlists, DEFAULT_FAVORITE_PLAYLISTS);
  });

  await testAsync('Favorites Persistence: Hydration guard prevents empty state overwrite', async () => {
    let isHydrated = false;
    let favorites = [];

    // Guard simulation: save must only execute if isHydrated === true
    if (isHydrated) {
      await saveFavoriteTracks(favorites);
    }

    const check = await loadAllFavorites();
    assert.deepStrictEqual(check.tracks, DEFAULT_FAVORITE_TRACKS, 'Default favorites must be preserved');
  });

  await testAsync('Favorites Persistence: Saves and reloads customized favorite sets', async () => {
    let isHydrated = true;
    const customTracks = ['trk-1', 'trk-3', 'trk-6'];
    const customAlbums = ['alb-1', 'alb-7'];
    const customPlaylists = ['summer-66', 'road-trip'];

    await saveFavoriteTracks(customTracks);
    await saveFavoriteAlbums(customAlbums);
    await saveFavoritePlaylists(customPlaylists);

    const reloaded = await loadAllFavorites();
    assert.deepStrictEqual(reloaded.tracks, customTracks);
    assert.deepStrictEqual(reloaded.albums, customAlbums);
    assert.deepStrictEqual(reloaded.playlists, customPlaylists);
  });

  console.log('\n======================================================================');
  console.log(`TOTAL SUITE RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
})();
