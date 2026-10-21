/**
 * Groove '66 - Pure TypeScript ID3 & Audio Metadata Parser
 * Compatible with React Native Hermes, Expo, and Node.js environments.
 * Extracts ID3v2.2, ID3v2.3, ID3v2.4, ID3v1, and provides filename fallbacks.
 */

declare const Buffer: any;

export interface ParsedAudioMetadata {
  title: string;
  artist: string;
  album: string;
  year?: number;
  genre?: string;
  trackNumber?: number;
  artworkBase64?: string;
  artworkMimeType?: string;
  hasEmbeddedMetadata: boolean;
  metadataSource: 'embedded_id3' | 'filename_derived';
}

const ID3V1_GENRES = [
  'Blues', 'Classic Rock', 'Country', 'Dance', 'Disco', 'Funk', 'Grunge',
  'Hip-Hop', 'Jazz', 'Metal', 'New Age', 'Oldies', 'Other', 'Pop', 'R&B',
  'Rap', 'Reggae', 'Rock', 'Techno', 'Industrial', 'Alternative', 'Ska',
  'Death Metal', 'Pranks', 'Soundtrack', 'Euro-Techno', 'Ambient',
  'Trip-Hop', 'Vocal', 'Jazz+Funk', 'Fusion', 'Trance', 'Classical',
  'Instrumental', 'Acid', 'House', 'Game', 'Sound Clip', 'Gospel',
  'Noise', 'AlternRock', 'Bass', 'Soul', 'Punk', 'Space', 'Meditative',
  'Instrumental Pop', 'Instrumental Rock', 'Ethnic', 'Gothic', 'Darkwave',
  'Techno-Industrial', 'Electronic', 'Pop-Folk', 'Eurodance', 'Dream',
  'Southern Rock', 'Comedy', 'Cult', 'Gangsta', 'Top 40', 'Christian Rap',
  'Pop/Funk', 'Jungle', 'Native American', 'Cabaret', 'New Wave',
  'Psychadelic', 'Rave', 'Showtunes', 'Trailer', 'Lo-Fi', 'Tribal',
  'Acid Punk', 'Acid Jazz', 'Polka', 'Retro', 'Musical', 'Rock & Roll',
  'Hard Rock', 'Folk', 'Folk-Rock', 'National Folk', 'Swing', 'Fast Fusion',
  'Bebob', 'Latin', 'Revival', 'Celtic', 'Bluegrass', 'Avantgarde',
  'Gothic Rock', 'Progressive Rock', 'Psychedelic Rock', 'Symphonic Rock',
  'Slow Rock', 'Big Band', 'Chorus', 'Easy Listening', 'Acoustic', 'Humour',
  'Speech', 'Chanson', 'Opera', 'Chamber Music', 'Sonata', 'Symphony',
  'Booty Bass', 'Primus', 'Porn Groove', 'Satire', 'Slow Jam', 'Club',
  'Tango', 'Samba', 'Folklore', 'Ballad', 'Power Ballad', 'Rhythmic Soul',
  'Freestyle', 'Duet', 'Punk Rock', 'Drum Solo', 'Acapella', 'Euro-House',
  'Dance Hall',
];

/**
 * Decode bytes to string based on ID3 encoding byte:
 * 0: ISO-8859-1
 * 1: UTF-16 with BOM (LE or BE)
 * 2: UTF-16BE without BOM
 * 3: UTF-8
 */
function decodeEncodedString(bytes: Uint8Array, encoding: number): string {
  if (bytes.length === 0) return '';

  try {
    if (typeof TextDecoder !== 'undefined') {
      if (encoding === 3) {
        return new TextDecoder('utf-8').decode(bytes).replace(/\0+$/, '').trim();
      }
      if (encoding === 0) {
        return new TextDecoder('iso-8859-1').decode(bytes).replace(/\0+$/, '').trim();
      }
      if (encoding === 1) {
        // UTF-16 with BOM
        if (bytes.length >= 2) {
          if (bytes[0] === 0xff && bytes[1] === 0xfe) {
            return new TextDecoder('utf-16le').decode(bytes.slice(2)).replace(/\0+$/, '').trim();
          } else if (bytes[0] === 0xfe && bytes[1] === 0xff) {
            return new TextDecoder('utf-16be').decode(bytes.slice(2)).replace(/\0+$/, '').trim();
          }
        }
        return new TextDecoder('utf-16le').decode(bytes).replace(/\0+$/, '').trim();
      }
      if (encoding === 2) {
        return new TextDecoder('utf-16be').decode(bytes).replace(/\0+$/, '').trim();
      }
    }
  } catch (e) {
    // Fall back to manual decoder below
  }

  // Fallback decoding for basic ISO-8859-1 or simple UTF-8
  if (encoding === 3) {
    return decodeUtf8(bytes);
  } else if (encoding === 1 || encoding === 2) {
    return decodeUtf16(bytes, encoding === 2);
  } else {
    let str = '';
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] === 0) break;
      str += String.fromCharCode(bytes[i]);
    }
    return str.trim();
  }
}

function decodeUtf8(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const c = bytes[i++];
    if (c === 0) break;
    if (c < 128) {
      out += String.fromCharCode(c);
    } else if (c > 191 && c < 224) {
      const c2 = bytes[i++];
      out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    } else if (c > 223 && c < 240) {
      const c2 = bytes[i++];
      const c3 = bytes[i++];
      out += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    } else if (c > 239 && c < 248) {
      const c2 = bytes[i++];
      const c3 = bytes[i++];
      const c4 = bytes[i++];
      let u = (((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) - 0x10000;
      out += String.fromCharCode(0xd800 + (u >> 10), 0xdc00 + (u & 1023));
    }
  }
  return out.trim();
}

function decodeUtf16(bytes: Uint8Array, isBigEndian: boolean): string {
  let start = 0;
  let be = isBigEndian;
  if (bytes.length >= 2) {
    if (bytes[0] === 0xff && bytes[1] === 0xfe) {
      be = false;
      start = 2;
    } else if (bytes[0] === 0xfe && bytes[1] === 0xff) {
      be = true;
      start = 2;
    }
  }

  let out = '';
  for (let i = start; i + 1 < bytes.length; i += 2) {
    const code = be ? (bytes[i] << 8) | bytes[i + 1] : bytes[i] | (bytes[i + 1] << 8);
    if (code === 0) break;
    out += String.fromCharCode(code);
  }
  return out.trim();
}

/**
 * Convert Uint8Array to Base64 string safely without large memory spikes
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  }
  return '';
}

/**
 * Decode Base64 string to Uint8Array safely
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(0);
}

/**
 * Parse ID3v2 header and frames from bytes
 */
export function parseId3v2(bytes: Uint8Array): Partial<ParsedAudioMetadata> | null {
  if (bytes.length < 10) return null;
  if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) {
    // Not "ID3"
    return null;
  }

  const version = bytes[3]; // 2, 3, or 4
  const revision = bytes[4];
  const flags = bytes[5];
  const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);

  const result: Partial<ParsedAudioMetadata> = {};
  let offset = 10;
  const maxOffset = Math.min(bytes.length, 10 + tagSize);

  // Check extended header flag (bit 6 of flags)
  if ((flags & 0x40) !== 0 && offset + 4 <= maxOffset) {
    let extSize = 0;
    if (version === 4) {
      extSize = ((bytes[offset] & 0x7f) << 21) | ((bytes[offset + 1] & 0x7f) << 14) | ((bytes[offset + 2] & 0x7f) << 7) | (bytes[offset + 3] & 0x7f);
    } else {
      extSize = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    }
    offset += extSize;
  }

  while (offset + (version === 2 ? 6 : 10) <= maxOffset) {
    // End of frames padding check
    if (bytes[offset] === 0) break;

    let frameId = '';
    let frameSize = 0;

    if (version === 2) {
      // 3-char frame ID, 3-byte size
      frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2]);
      frameSize = (bytes[offset + 3] << 16) | (bytes[offset + 4] << 8) | bytes[offset + 5];
      offset += 6;
    } else {
      // 4-char frame ID
      frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
      if (version === 4) {
        frameSize = ((bytes[offset + 4] & 0x7f) << 21) | ((bytes[offset + 5] & 0x7f) << 14) | ((bytes[offset + 6] & 0x7f) << 7) | (bytes[offset + 7] & 0x7f);
      } else {
        frameSize = (bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | (bytes[offset + 6] << 8) | bytes[offset + 7];
      }
      offset += 10;
    }

    if (frameSize <= 0 || offset + frameSize > bytes.length) {
      break;
    }

    const frameData = bytes.slice(offset, offset + frameSize);
    offset += frameSize;

    // Parse Text Frames
    if (['TIT2', 'TT2'].includes(frameId) && frameData.length > 1) {
      const val = decodeEncodedString(frameData.slice(1), frameData[0]);
      if (val && !result.title) result.title = val;
    } else if (['TPE1', 'TP1'].includes(frameId) && frameData.length > 1) {
      const val = decodeEncodedString(frameData.slice(1), frameData[0]);
      if (val && !result.artist) result.artist = val;
    } else if (['TALB', 'TAL'].includes(frameId) && frameData.length > 1) {
      const val = decodeEncodedString(frameData.slice(1), frameData[0]);
      if (val && !result.album) result.album = val;
    } else if (['TYER', 'TDRC', 'TYE'].includes(frameId) && frameData.length > 1) {
      const val = decodeEncodedString(frameData.slice(1), frameData[0]);
      const match = val.match(/\b(19\d{2}|20\d{2})\b/);
      if (match) result.year = parseInt(match[1], 10);
    } else if (['TCON', 'TCO'].includes(frameId) && frameData.length > 1) {
      let val = decodeEncodedString(frameData.slice(1), frameData[0]);
      // ID3v2 numeric genre reference e.g. "(17)" -> "Rock"
      const numMatch = val.match(/^\((\d+)\)/);
      if (numMatch) {
        const idx = parseInt(numMatch[1], 10);
        if (ID3V1_GENRES[idx]) val = ID3V1_GENRES[idx];
      }
      if (val && !result.genre) result.genre = val;
    } else if (['TRCK', 'TRK'].includes(frameId) && frameData.length > 1) {
      const val = decodeEncodedString(frameData.slice(1), frameData[0]);
      const trkNum = parseInt(val.split('/')[0], 10);
      if (!isNaN(trkNum)) result.trackNumber = trkNum;
    } else if (['APIC', 'PIC'].includes(frameId) && frameData.length > 10) {
      // Attached picture parsing
      try {
        const encoding = frameData[0];
        let pOffset = 1;
        let mimeType = 'image/jpeg';

        if (version === 2) {
          // 3-byte format e.g. "JPG" or "PNG"
          const fmt = String.fromCharCode(frameData[1], frameData[2], frameData[3]).toUpperCase();
          mimeType = fmt === 'PNG' ? 'image/png' : 'image/jpeg';
          pOffset = 4;
        } else {
          // Null-terminated MIME string
          let mimeEnd = pOffset;
          while (mimeEnd < frameData.length && frameData[mimeEnd] !== 0) {
            mimeEnd++;
          }
          let mimeStr = '';
          for (let m = pOffset; m < mimeEnd; m++) {
            mimeStr += String.fromCharCode(frameData[m]);
          }
          if (mimeStr) mimeType = mimeStr.toLowerCase();
          pOffset = mimeEnd + 1;
        }

        // Picture type (1 byte: 0x03 = Front Cover)
        const picType = frameData[pOffset++];

        // Description (null-terminated string with encoding)
        if (encoding === 1 || encoding === 2) {
          // UTF-16 double null
          while (pOffset + 1 < frameData.length && (frameData[pOffset] !== 0 || frameData[pOffset + 1] !== 0)) {
            pOffset += 2;
          }
          pOffset += 2;
        } else {
          while (pOffset < frameData.length && frameData[pOffset] !== 0) {
            pOffset++;
          }
          pOffset++;
        }

        if (pOffset < frameData.length) {
          const imageBytes = frameData.slice(pOffset);
          if (imageBytes.length > 32) {
            result.artworkBase64 = uint8ArrayToBase64(imageBytes);
            result.artworkMimeType = mimeType;
          }
        }
      } catch (apicErr) {
        // Silently tolerate malformed artwork frames
      }
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Parse ID3v1 from 128 bytes at end of audio file
 */
export function parseId3v1(bytes: Uint8Array): Partial<ParsedAudioMetadata> | null {
  if (bytes.length < 128) return null;
  const start = bytes.length - 128;
  if (bytes[start] !== 0x54 || bytes[start + 1] !== 0x41 || bytes[start + 2] !== 0x47) {
    // Not "TAG"
    return null;
  }

  const decodeLatin1 = (slice: Uint8Array): string => {
    let str = '';
    for (let i = 0; i < slice.length; i++) {
      if (slice[i] === 0) break;
      str += String.fromCharCode(slice[i]);
    }
    return str.trim();
  };

  const title = decodeLatin1(bytes.slice(start + 3, start + 33));
  const artist = decodeLatin1(bytes.slice(start + 33, start + 63));
  const album = decodeLatin1(bytes.slice(start + 63, start + 93));
  const yearStr = decodeLatin1(bytes.slice(start + 93, start + 97));
  const year = yearStr.match(/^\d{4}$/) ? parseInt(yearStr, 10) : undefined;

  let trackNumber: number | undefined;
  if (bytes[start + 125] === 0 && bytes[start + 126] !== 0) {
    trackNumber = bytes[start + 126];
  }

  const genreByte = bytes[start + 127];
  const genre = ID3V1_GENRES[genreByte] || undefined;

  const result: Partial<ParsedAudioMetadata> = {};
  if (title) result.title = title;
  if (artist) result.artist = artist;
  if (album) result.album = album;
  if (year) result.year = year;
  if (genre) result.genre = genre;
  if (trackNumber) result.trackNumber = trackNumber;

  return Object.keys(result).length > 0 ? result : null;
}

const KNOWN_ARTISTS = [
  'ឆាយ វីរៈយុទ្ធ',
  'ស៊ិន ស៊ីសាមុត',
  'រស់ សេរីសុទ្ធា',
  'ប៉ែន រ៉ន',
  'ព្រាប សុវត្ថិ',
  'មាស សុខសោភា',
  'TEPPISETH',
  'MC SEY',
];

/**
 * Intelligent filename fallback parser for audio files.
 * Extracts Artist, Title, and cleans common noise tags (e.g. YouTube/Lyric tags).
 * If no artist is explicitly defined in filename, safely uses 'Unknown Artist'.
 * Never invents fake artists or albums.
 */
export function parseFilenameFallback(rawFileName: string): {
  title: string;
  artist: string;
  album: string;
} {
  // Strip file extension
  let base = rawFileName.replace(/\.(mp3|m4a|aac|wav|ogg|flac|wma)$/i, '').trim();

  // Strip common YouTube/recording tags in parentheses or brackets
  base = base
    .replace(/\s*[\(\[]\s*(official\s*(audio|video|music\s*video|lyric\s*video|lyrics)?|lyric\s*audio|lyrics?|hd|4k|1080p|audio|visualizer)\s*[\)\]]/gi, '')
    .trim();

  // Remove trailing unclosed parentheses if corrupted (e.g. "(From")
  base = base.replace(/\s*[\(\[]from$/i, '').trim();

  // Pattern 1: Check for "Artist - Title" or "Title - Artist"
  const dashMatch = base.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (dashMatch) {
    const part1 = dashMatch[1].replace(/_+/g, ' ').trim();
    const part2 = dashMatch[2].replace(/_+/g, ' ').trim();

    if (part1.length > 0 && part2.length > 0) {
      // Check if part2 is a known artist
      if (KNOWN_ARTISTS.some((a) => part2.toLowerCase() === a.toLowerCase())) {
        return {
          title: part1,
          artist: part2,
          album: 'Unknown Album',
        };
      }
      // Check if part1 is a known artist or default to part1 as artist
      return {
        artist: part1,
        title: part2,
        album: 'Unknown Album',
      };
    }
  }

  // Pattern 2: Single name without clear artist separator
  // Replace hyphens or underscores with spaces for clean display
  let cleanTitle = base.replace(/[_-]+/g, ' ').trim();
  return {
    title: cleanTitle || 'Unknown Track',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
  };
}

const MPEG_BITRATES = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
];
const MPEG_SAMPLE_RATES = [44100, 48000, 32000, 0];

/**
 * Estimate MPEG Layer 3 audio duration from Xing/Info header or bitrate
 */
export function estimateMpegDuration(bytes: Uint8Array, fileSize: number): number | undefined {
  if (bytes.length < 128) return undefined;

  let offset = 0;
  // Skip ID3v2 if present
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    const tagSize =
      ((bytes[6] & 0x7f) << 21) |
      ((bytes[7] & 0x7f) << 14) |
      ((bytes[8] & 0x7f) << 7) |
      (bytes[9] & 0x7f);
    offset = 10 + tagSize;
  }

  while (offset + 40 < bytes.length) {
    // Check sync word 0xFFE0
    if (bytes[offset] === 0xff && (bytes[offset + 1] & 0xe0) === 0xe0) {
      const b1 = bytes[offset + 1];
      const b2 = bytes[offset + 2];
      const ver = (b1 >> 3) & 3; // 3 = MPEG 1
      const layer = (b1 >> 1) & 3; // 1 = Layer 3
      const brIdx = (b2 >> 4) & 15;
      const srIdx = (b2 >> 2) & 3;
      const br = MPEG_BITRATES[brIdx];
      const sr = MPEG_SAMPLE_RATES[srIdx];

      if (ver === 3 && layer === 1 && br > 0 && sr > 0) {
        // Check for Xing or Info header (offset + 4 + 32 for stereo or + 17 for mono)
        const checkOffsets = [offset + 4 + 32, offset + 4 + 17];
        for (const xo of checkOffsets) {
          if (xo + 12 < bytes.length) {
            const tag = String.fromCharCode(
              bytes[xo],
              bytes[xo + 1],
              bytes[xo + 2],
              bytes[xo + 3]
            );
            if (tag === 'Xing' || tag === 'Info') {
              const flags =
                (bytes[xo + 4] << 24) |
                (bytes[xo + 5] << 16) |
                (bytes[xo + 6] << 8) |
                bytes[xo + 7];
              if ((flags & 1) !== 0) {
                // Frames count present
                const frames =
                  (bytes[xo + 8] << 24) |
                  (bytes[xo + 9] << 16) |
                  (bytes[xo + 10] << 8) |
                  bytes[xo + 11];
                if (frames > 0) {
                  return Math.round((frames * 1152) / sr);
                }
              }
            }
          }
        }

        // Bitrate fallback if no Xing header
        if (fileSize > 0) {
          return Math.round((fileSize * 8) / (br * 1000));
        }
      }
    }
    offset++;
  }

  return undefined;
}

/**
 * Format duration in seconds to "m:ss"
 */
export function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Combine ID3 and filename fallbacks into a finalized metadata object
 */
export function resolveAudioMetadata(
  id3v2: Partial<ParsedAudioMetadata> | null,
  id3v1: Partial<ParsedAudioMetadata> | null,
  fileName: string
): ParsedAudioMetadata {
  const fallback = parseFilenameFallback(fileName);

  const hasEmbedded = Boolean(
    (id3v2 && (id3v2.title || id3v2.artist || id3v2.album)) ||
    (id3v1 && (id3v1.title || id3v1.artist || id3v1.album))
  );

  const title = (id3v2?.title || id3v1?.title || fallback.title || 'Unknown Track').trim();
  const artist = (id3v2?.artist || id3v1?.artist || fallback.artist || 'Unknown Artist').trim();
  const album = (id3v2?.album || id3v1?.album || fallback.album || 'Unknown Album').trim();
  const year = id3v2?.year || id3v1?.year;
  const genre = id3v2?.genre || id3v1?.genre;
  const trackNumber = id3v2?.trackNumber || id3v1?.trackNumber;
  const artworkBase64 = id3v2?.artworkBase64;
  const artworkMimeType = id3v2?.artworkMimeType;

  return {
    title,
    artist,
    album,
    year,
    genre,
    trackNumber,
    artworkBase64,
    artworkMimeType,
    hasEmbeddedMetadata: hasEmbedded,
    metadataSource: hasEmbedded ? 'embedded_id3' : 'filename_derived',
  };
}
