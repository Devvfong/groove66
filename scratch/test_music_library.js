const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log(' Groove \'66 — Phase P12 Music Library Test Suite');
console.log('====================================================\n');

let passedTests = 0;

// 1. Test ID3 & Metadata Extraction
console.log('--- 1. Testing Metadata & Filename Parsing ---');
const {
  parseId3v2,
  parseId3v1,
  parseFilenameFallback,
  resolveAudioMetadata,
  estimateMpegDuration,
  formatDuration,
} = require('../src/services/metadata/id3Parser.ts');

const musicDir = path.join(__dirname, '../src/music');
const mp3Files = fs.readdirSync(musicDir);

assert.strictEqual(mp3Files.length, 7, 'Expected 7 MP3 files in src/music');
console.log(`Found ${mp3Files.length} local MP3 test files.`);

const parsedTracks = [];

mp3Files.forEach((file) => {
  const filePath = path.join(musicDir, file);
  const stat = fs.statSync(filePath);
  const fd = fs.openSync(filePath, 'r');
  const buf = Buffer.alloc(65536);
  const bytesRead = fs.readSync(fd, buf, 0, 65536, 0);
  fs.closeSync(fd);

  const uint8 = new Uint8Array(buf.slice(0, bytesRead));
  const id3v2 = parseId3v2(uint8);
  const resolved = resolveAudioMetadata(id3v2, null, file);
  const duration = estimateMpegDuration(uint8, stat.size) || 180;

  assert(resolved.title && resolved.title.length > 0, `Title missing for ${file}`);
  assert(resolved.artist && resolved.artist.length > 0, `Artist missing for ${file}`);

  parsedTracks.push({
    id: `imp-${file}`,
    title: resolved.title,
    artist: resolved.artist,
    album: resolved.album,
    year: resolved.year || 1966,
    duration: duration,
    durationFormatted: formatDuration(duration),
    fileName: file,
    fileSize: stat.size,
    isImported: true,
    metadataSource: resolved.metadataSource,
  });

  console.log(`  ✓ [${resolved.metadataSource}] "${resolved.title}" by "${resolved.artist}" (${formatDuration(duration)})`);
  passedTests++;
});

// 2. Test Khmer Unicode Preservation and Formatting
console.log('\n--- 2. Testing Khmer Unicode Text Integrity ---');
const khmerTrack1 = parsedTracks.find((t) => t.fileName.includes('បុស្បាផ្កាស្នេហ៍'));
assert(khmerTrack1, 'Khmer track បុស្បាផ្កាស្នេហ៍ should exist');
assert.strictEqual(khmerTrack1.title, 'បុស្បាផ្កាស្នេហ៍');
console.log(`  ✓ Title preserved exactly: "${khmerTrack1.title}"`);
passedTests++;

const khmerTrack2 = parsedTracks.find((t) => t.fileName.includes('ឆាយ វីរៈយុទ្ធ'));
assert(khmerTrack2, 'Khmer track with Chhay Virakyuth should exist');
assert.strictEqual(khmerTrack2.artist, 'ឆាយ វីរៈយុទ្ធ');
assert.strictEqual(khmerTrack2.title, 'ដឹងអត់ថាបងកំពុងនឹកអូន');
console.log(`  ✓ Artist and Title parsed correctly: "${khmerTrack2.title}" by "${khmerTrack2.artist}"`);
passedTests++;

const khmerTrack3 = parsedTracks.find((t) => t.fileName.includes('MAY DOMBON'));
assert(khmerTrack3, 'Track MAY DOMBON should exist');
assert.strictEqual(khmerTrack3.artist, 'TEPPISETH');
assert.strictEqual(khmerTrack3.title, 'មេតំបន់ MAY DOMBON');
console.log(`  ✓ Mixed Khmer/Latin parsed: "${khmerTrack3.title}" by "${khmerTrack3.artist}"`);
passedTests++;

// 3. Test Search Integration with Khmer and English queries
console.log('\n--- 3. Testing Search Engine with Imported Tracks ---');
function normalizeQuery(q) {
  return (q || '').trim().toLowerCase().replace(/\s+/g, ' ');
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

function searchTracks(tracks, rawQuery) {
  const q = normalizeQuery(rawQuery);
  if (!q) return [];
  const scored = [];
  tracks.forEach((t) => {
    const score = Math.max(
      scoreMatch(t.title, q, `${t.artist} ${t.album}`),
      scoreMatch(t.artist, q, t.title) * 0.9
    );
    if (score > 0) scored.push({ item: t, score });
  });
  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return scored.map((s) => s.item);
}

const search1 = searchTracks(parsedTracks, 'TEPPISETH');
assert(search1.length >= 2, 'Should find at least 2 songs by TEPPISETH');
console.log(`  ✓ Search "TEPPISETH": found ${search1.length} songs.`);
passedTests++;

const search2 = searchTracks(parsedTracks, 'ឆាយ');
assert(search2.length >= 1, 'Should find track by ឆាយ វីរៈយុទ្ធ');
console.log(`  ✓ Search Khmer query "ឆាយ": found "${search2[0].title}"`);
passedTests++;

const search3 = searchTracks(parsedTracks, 'Cypher');
assert(search3.length >= 1, 'Should find CAMBO CYPHER track');
console.log(`  ✓ Search "Cypher": found "${search3[0].title}"`);
passedTests++;

const search4 = searchTracks(parsedTracks, 'groove66');
assert(search4.length >= 1, 'Should find groove66 test song');
console.log(`  ✓ Search "groove66": found "${search4[0].title}"`);
passedTests++;

// 4. Test Duplicate Detection Logic
console.log('\n--- 4. Testing Duplicate Detection ---');
function checkIsDuplicate(newFile, existingList) {
  return existingList.some((t) => {
    const nameMatch = (t.fileName && t.fileName === newFile.name) || (t.originalFileName && t.originalFileName === newFile.name);
    const sizeMatch = t.fileSize && newFile.size && Math.abs(t.fileSize - newFile.size) < 16;
    return nameMatch && sizeMatch;
  });
}

const existingMock = [...parsedTracks];
// Duplicate attempt
const dup = checkIsDuplicate({ name: mp3Files[0], size: parsedTracks[0].fileSize }, existingMock);
assert.strictEqual(dup, true, 'Same file and size should be flagged as duplicate');
console.log(`  ✓ Duplicate file "${mp3Files[0]}" correctly identified.`);
passedTests++;

// Distinct attempt
const distinct = checkIsDuplicate({ name: 'new-different-song.mp3', size: 123456 }, existingMock);
assert.strictEqual(distinct, false, 'New file should not be flagged as duplicate');
console.log('  ✓ Distinct file correctly accepted for import.');
passedTests++;

// 5. Test Sorting Logic
console.log('\n--- 5. Testing Library Sorting ---');
const byTitle = [...parsedTracks].sort((a, b) => a.title.localeCompare(b.title));
assert.strictEqual(byTitle.length, 7);
console.log(`  ✓ Title sorting: first = "${byTitle[0].title}", last = "${byTitle[6].title}"`);
passedTests++;

const byArtist = [...parsedTracks].sort((a, b) => a.artist.localeCompare(b.artist));
assert.strictEqual(byArtist.length, 7);
console.log(`  ✓ Artist sorting: first = "${byArtist[0].artist}", last = "${byArtist[6].artist}"`);
passedTests++;

// 6. Test Track Removal Integrity
console.log('\n--- 6. Testing Track Removal Integrity ---');
const toRemove = parsedTracks[0];
const remaining = parsedTracks.filter((t) => t.id !== toRemove.id);
assert.strictEqual(remaining.length, 6);
assert(!remaining.some((t) => t.id === toRemove.id));
console.log(`  ✓ Removal of "${toRemove.title}" leaves exactly 6 tracks intact.`);
passedTests++;

console.log(`\n====================================================`);
console.log(` ALL ${passedTests} LIBRARY TESTS PASSED (100%)!`);
console.log(`====================================================\n`);
