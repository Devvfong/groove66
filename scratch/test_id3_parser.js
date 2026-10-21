const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Test the compiled or transpiled id3Parser logic in Node
// We can require ts-node or run plain JS replicating or testing id3Parser
// Let's create a standalone verification of id3Parser functionality
const {
  parseId3v2,
  parseId3v1,
  parseFilenameFallback,
  resolveAudioMetadata,
  uint8ArrayToBase64,
  base64ToUint8Array,
} = require('../src/services/metadata/id3Parser.ts');

console.log('Testing id3Parser...');
let passed = 0;

// Test 1: Filename fallback parsing for the 7 real tracks
const testFiles = [
  {
    name: 'MC SEY - CAMBO CYPHER feats AK-K, TAGMEZ, TOYMIN NOY, LONG BUNN, 4L, MC PICH (Music Video).mp3',
    expectedArtist: 'MC SEY',
    expectedTitlePrefix: 'CAMBO CYPHER',
  },
  {
    name: 'TEPPISETH - មេតំបន់ MAY DOMBON.mp3',
    expectedArtist: 'TEPPISETH',
    expectedTitle: 'មេតំបន់ MAY DOMBON',
  },
  {
    name: 'TEPPISETH - ឱក្រមុំៗបងអេីយ.mp3',
    expectedArtist: 'TEPPISETH',
    expectedTitle: 'ឱក្រមុំៗបងអេីយ',
  },
  {
    name: 'groove66-test-song.mp3',
    expectedArtist: 'Unknown Artist',
    expectedTitle: 'groove66-test-song',
  },
  {
    name: 'ដឹងអត់ថាបងកំពុងនឹកអូន - ឆាយ វីរៈយុទ្ធ ( Lyric Audio ).mp3',
    expectedArtist: 'ដឹងអត់ថាបងកំពុងនឹកអូន',
    expectedTitle: 'ឆាយ វីរៈយុទ្ធ',
  },
  {
    name: 'បុស្បាផ្កាស្នេហ៍.mp3',
    expectedArtist: 'Unknown Artist',
    expectedTitle: 'បុស្បាផ្កាស្នេហ៍',
  },
  {
    name: 'ស្នេហ៍_ក្រោម_ពន្លឺ_កាំច្រួច (From.mp3',
    expectedArtist: 'Unknown Artist',
    expectedTitlePrefix: 'ស្នេហ៍ ក្រោម ពន្លឺ កាំច្រួច',
  },
];

console.log('\n--- 1. Testing Filename Fallback Parsing ---');
testFiles.forEach((tf) => {
  const meta = parseFilenameFallback(tf.name);
  console.log(`[FILE] ${tf.name}`);
  console.log(`  -> Artist: "${meta.artist}" | Title: "${meta.title}" | Album: "${meta.album}"`);
  assert(meta.title.length > 0, `Title should not be empty for ${tf.name}`);
  assert(meta.artist.length > 0, `Artist should not be empty for ${tf.name}`);
  passed++;
});

console.log('\n--- 2. Testing Real MP3 Header Parsing ---');
const musicDir = path.join(__dirname, '../src/music');
const diskFiles = fs.readdirSync(musicDir);

diskFiles.forEach((file) => {
  const filePath = path.join(musicDir, file);
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(65536); // 64KB bounded read
  const bytesRead = fs.readSync(fd, buffer, 0, 65536, 0);
  fs.closeSync(fd);

  const uint8 = new Uint8Array(buffer.slice(0, bytesRead));
  const id3v2 = parseId3v2(uint8);
  const resolved = resolveAudioMetadata(id3v2, null, file);

  console.log(`[REAL MP3] ${file}`);
  console.log(`  -> ID3v2 detected: ${Boolean(id3v2)}`);
  console.log(`  -> Resolved: "${resolved.title}" by "${resolved.artist}" (Source: ${resolved.metadataSource})`);
  assert(resolved.title.length > 0);
  assert(resolved.artist.length > 0);
  passed++;
});

console.log('\n--- 3. Testing Synthetic ID3v2.3 with Khmer UTF-8 and UTF-16 ---');
// Construct a valid ID3v2.3 tag with TIT2 (UTF-8) and TPE1 (UTF-16 with BOM)
function makeId3v2Tag(frames) {
  let framesBuf = Buffer.alloc(0);
  for (const f of frames) {
    const fHeader = Buffer.alloc(10);
    fHeader.write(f.id, 0, 4, 'ascii');
    fHeader.writeUInt32BE(f.data.length, 4);
    fHeader.writeUInt16BE(0, 8); // flags
    framesBuf = Buffer.concat([framesBuf, fHeader, f.data]);
  }
  const tagSize = framesBuf.length;
  const header = Buffer.alloc(10);
  header.write('ID3', 0, 3, 'ascii');
  header[3] = 3; // v2.3
  header[4] = 0; // rev
  header[5] = 0; // flags
  header[6] = (tagSize >> 21) & 0x7f;
  header[7] = (tagSize >> 14) & 0x7f;
  header[8] = (tagSize >> 7) & 0x7f;
  header[9] = tagSize & 0x7f;

  return Buffer.concat([header, framesBuf]);
}

// Frame 1: TIT2 in UTF-8 (encoding byte 3) with Khmer "បុស្បាផ្កាស្នេហ៍"
const titleBuf = Buffer.concat([Buffer.from([3]), Buffer.from('បុស្បាផ្កាស្នេហ៍ (Vintage Khmer)', 'utf8')]);

// Frame 2: TPE1 in UTF-16 with BOM (encoding byte 1) with "ស៊ិន ស៊ីសាមុត" (Sinn Sisamouth)
const artistUtf16 = Buffer.from('ស៊ិន ស៊ីសាមុត', 'utf16le');
const artistBuf = Buffer.concat([Buffer.from([1, 0xff, 0xfe]), artistUtf16]);

// Frame 3: TALB in ISO-8859-1 (encoding byte 0) with "Golden Era 1966"
const albumBuf = Buffer.concat([Buffer.from([0]), Buffer.from('Golden Era 1966', 'latin1')]);

// Frame 4: TYER (Year)
const yearBuf = Buffer.concat([Buffer.from([0]), Buffer.from('1966', 'latin1')]);

const syntheticTag = makeId3v2Tag([
  { id: 'TIT2', data: titleBuf },
  { id: 'TPE1', data: artistBuf },
  { id: 'TALB', data: albumBuf },
  { id: 'TYER', data: yearBuf },
]);

const parsedSynthetic = parseId3v2(new Uint8Array(syntheticTag));
assert.strictEqual(parsedSynthetic.title, 'បុស្បាផ្កាស្នេហ៍ (Vintage Khmer)');
assert.strictEqual(parsedSynthetic.artist, 'ស៊ិន ស៊ីសាមុត');
assert.strictEqual(parsedSynthetic.album, 'Golden Era 1966');
assert.strictEqual(parsedSynthetic.year, 1966);
console.log('Synthetic ID3v2.3 tag parsed perfectly:', parsedSynthetic);
passed++;

console.log('\n--- 4. Testing Synthetic APIC Album Artwork Frame ---');
// Fake 1x1 GIF / JPEG image
const fakeJpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0xff, 0xd9]);
const apicData = Buffer.concat([
  Buffer.from([0]), // encoding Latin1
  Buffer.from('image/jpeg\0', 'ascii'), // MIME type
  Buffer.from([3]), // Picture type (Cover Front)
  Buffer.from('Cover\0', 'ascii'), // Description
  fakeJpg,
]);

const tagWithArtwork = makeId3v2Tag([
  { id: 'TIT2', data: titleBuf },
  { id: 'APIC', data: apicData },
]);

const parsedArt = parseId3v2(new Uint8Array(tagWithArtwork));
assert.strictEqual(parsedArt.title, 'បុស្បាផ្កាស្នេហ៍ (Vintage Khmer)');
assert.strictEqual(parsedArt.artworkMimeType, 'image/jpeg');
assert(parsedArt.artworkBase64 && parsedArt.artworkBase64.length > 0);
console.log('APIC artwork extracted successfully: Mime =', parsedArt.artworkMimeType, 'Base64 length =', parsedArt.artworkBase64.length);
passed++;

console.log(`\nALL ${passed} TESTS PASSED!`);
