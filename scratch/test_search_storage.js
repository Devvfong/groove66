const assert = require('assert');

// In-memory mock for AsyncStorage
const memoryStore = new Map();
const AsyncStorage = {
  getItem: async (key) => memoryStore.get(key) || null,
  setItem: async (key, val) => memoryStore.set(key, val),
  removeItem: async (key) => memoryStore.delete(key),
  clear: async () => memoryStore.clear(),
};

const SEARCH_STORAGE_KEYS = {
  RECENT_SEARCHES: '@groove66/recent_searches',
};

const DEFAULT_RECENT_SEARCHES = [
  'The Beach Boys',
  'Pet Sounds',
  'Aretha Franklin',
  'Motown',
];

function safeParseSearches(raw, fallback) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
  } catch (err) {
    // Corrupted
  }
  return fallback;
}

async function loadRecentSearches() {
  try {
    const raw = await AsyncStorage.getItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES);
    return safeParseSearches(raw, DEFAULT_RECENT_SEARCHES);
  } catch (err) {
    return DEFAULT_RECENT_SEARCHES;
  }
}

async function saveRecentSearches(searches) {
  await AsyncStorage.setItem(
    SEARCH_STORAGE_KEYS.RECENT_SEARCHES,
    JSON.stringify(searches.slice(0, 10))
  );
}

function addRecentSearchItem(query, current) {
  const trimmed = query.trim();
  if (!trimmed) return current;
  const filtered = current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
  return [trimmed, ...filtered].slice(0, 10);
}

async function clearRecentSearches() {
  await AsyncStorage.removeItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES);
}

async function runStorageTests() {
  console.log('--- Running Search Storage Persistence Test Suite ---');

  // Test 1: Cold start returns defaults
  const cold = await loadRecentSearches();
  assert.deepStrictEqual(cold, DEFAULT_RECENT_SEARCHES);
  console.log('✓ Test 1: Cold start returns default recent searches');

  // Test 2: Add query prepends and deduplicates
  let current = await loadRecentSearches();
  current = addRecentSearchItem('Rubber Soul', current);
  assert.strictEqual(current[0], 'Rubber Soul');
  assert.strictEqual(current.length, 5);
  console.log('✓ Test 2: addRecentSearchItem prepends new query');

  // Test 3: Deduplication case-insensitive
  current = addRecentSearchItem('rubber soul', current);
  assert.strictEqual(current.length, 5);
  assert.strictEqual(current[0], 'rubber soul');
  console.log('✓ Test 3: Duplicate query moves to top without duplicating');

  // Test 4: Save & reload persistence
  await saveRecentSearches(current);
  const reloaded = await loadRecentSearches();
  assert.deepStrictEqual(reloaded, current);
  console.log('✓ Test 4: saveRecentSearches persists to storage');

  // Test 5: Capping at 10 items
  let overflow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  await saveRecentSearches(overflow);
  const capped = await loadRecentSearches();
  assert.strictEqual(capped.length, 10);
  assert.strictEqual(capped[9], '10');
  console.log('✓ Test 5: Recent searches capped at 10 items');

  // Test 6: Clear recent searches
  await clearRecentSearches();
  const cleared = await loadRecentSearches();
  assert.deepStrictEqual(cleared, DEFAULT_RECENT_SEARCHES);
  console.log('✓ Test 6: clearRecentSearches resets storage');

  // Test 7: Corrupted JSON recovery
  await AsyncStorage.setItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES, 'CORRUPTED{MALFORMED');
  const recovered = await loadRecentSearches();
  assert.deepStrictEqual(recovered, DEFAULT_RECENT_SEARCHES);
  console.log('✓ Test 7: Corrupted JSON string gracefully recovers to default');

  // Test 8: Non-array schema recovery
  await AsyncStorage.setItem(SEARCH_STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify({ wrong: 'schema' }));
  const recoveredNonArray = await loadRecentSearches();
  assert.deepStrictEqual(recoveredNonArray, DEFAULT_RECENT_SEARCHES);
  console.log('✓ Test 8: Non-array schema gracefully recovers to default');

  console.log('--- ALL 8 SEARCH STORAGE TESTS PASSED ---');
}

runStorageTests().catch((err) => {
  console.error('Storage test failure:', err);
  process.exit(1);
});
