import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { type Track } from '../data/musicData';

const STORAGE_KEY_IMPORTED_TRACKS = '@groove66:imported_tracks_v1';

// Supported audio file extensions
const SUPPORTED_EXTENSIONS = ['.mp3', '.m4a', '.aac', '.wav', '.ogg', '.flac'];

// Supported MIME types
const SUPPORTED_MIME_PREFIXES = ['audio/'];

// Vintage cover cycle for imported records
const VINTAGE_COVERS: Track['coverType'][] = [
  'summer_love',
  'pet_sounds',
  'rubber_soul',
  'miles',
  'aretha',
  'supremes',
  'songs_in_key',
  'united',
];

const VINTAGE_COLORS = [
  '#D56637', // Burnt orange
  '#5C8542', // Olive green
  '#E59E38', // Mustard gold
  '#3A878C', // Retro teal
  '#8C3B4E', // Maroon
  '#4E8681', // Sage
];

export interface ImportResult {
  success: boolean;
  track?: Track;
  error?: string;
  canceled?: boolean;
}

/**
 * Load all saved imported tracks from persistent storage
 */
export async function loadImportedTracks(): Promise<Track[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_IMPORTED_TRACKS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('[importedTracksStorage] Failed to load imported tracks:', err);
    return [];
  }
}

/**
 * Persist imported tracks list to AsyncStorage
 */
export async function saveImportedTracks(tracks: Track[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_IMPORTED_TRACKS, JSON.stringify(tracks));
  } catch (err) {
    console.error('[importedTracksStorage] Failed to save imported tracks:', err);
  }
}

/**
 * Check if a file extension is supported
 */
function isExtensionSupported(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * Prompt user with Document Picker and import the selected audio file
 */
export async function importAudioViaDocumentPicker(): Promise<ImportResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, canceled: true };
    }

    const asset = result.assets[0];

    // 1. Format validation
    const extMatch = isExtensionSupported(asset.name);
    const mimeMatch = asset.mimeType && SUPPORTED_MIME_PREFIXES.some((p) => asset.mimeType?.startsWith(p));

    if (!extMatch && !mimeMatch) {
      const ext = asset.name.includes('.') ? asset.name.split('.').pop() : 'unknown';
      return {
        success: false,
        error: `Unsupported format ".${ext}". Please select an MP3, M4A, AAC, WAV, OGG, or FLAC audio file.`,
      };
    }

    // 2. Duplicate check against existing library
    const existing = await loadImportedTracks();
    const isDuplicate = existing.some((t) => {
      // Check exact file name and size match
      return t.fileSize && asset.size && t.fileSize === asset.size && t.fileName === asset.name;
    });

    if (isDuplicate) {
      return {
        success: false,
        error: `"${asset.name}" is already imported in your vinyl crate.`,
      };
    }

    // 3. Copy into app-owned persistent document storage
    let persistentUri = asset.uri;

    if (FileSystem.documentDirectory) {
      const importDir = `${FileSystem.documentDirectory}imported_tracks/`;

      // Ensure directory exists
      const dirInfo = await FileSystem.getInfoAsync(importDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(importDir, { intermediates: true });
      }

      // Generate stable, collision-free file name
      const safeName = asset.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const targetPath = `${importDir}${Date.now()}_${safeName}`;

      await FileSystem.copyAsync({
        from: asset.uri,
        to: targetPath,
      });

      persistentUri = targetPath;
    }

    // 4. Construct Track metadata
    const cleanTitle = asset.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    const coverIdx = existing.length % VINTAGE_COVERS.length;
    const colorIdx = existing.length % VINTAGE_COLORS.length;

    const newTrack: Track = {
      id: `imp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: cleanTitle || 'Imported Vinyl Record',
      artist: 'Local Vinyl Import',
      album: 'My Imported Crate',
      albumId: 'alb-imported',
      year: 1966,
      genre: 'Soul',
      duration: 180, // Default duration; will be updated with actual duration upon load
      durationFormatted: '3:00',
      coverType: VINTAGE_COVERS[coverIdx],
      labelColor: VINTAGE_COLORS[colorIdx],
      side: 'A',
      trackNumber: existing.length + 1,
      audioUri: persistentUri,
      fileName: asset.name,
      fileSize: asset.size || 0,
      isImported: true,
      isPlayable: true,
      isDemo: false,
      lyrics: [
        '[Offline Audio Import]',
        `File: ${asset.name}`,
        `Size: ${(asset.size ? (asset.size / (1024 * 1024)).toFixed(2) : '0')} MB`,
        'Ready for analog 33⅓ RPM playback.',
      ],
    };

    // 5. Persist to storage
    const updated = [newTrack, ...existing];
    await saveImportedTracks(updated);

    return {
      success: true,
      track: newTrack,
    };
  } catch (err: any) {
    console.error('[importedTracksStorage] Error during audio import:', err);
    return {
      success: false,
      error: err?.message || 'Failed to import audio file.',
    };
  }
}

/**
 * Remove an imported track from the library and delete its app-owned file
 * (Does NOT delete the user's original phone file)
 */
export async function removeImportedTrack(track: Track): Promise<boolean> {
  try {
    // Delete file from app document storage if located inside documentDirectory
    if (
      track.audioUri &&
      FileSystem.documentDirectory &&
      typeof track.audioUri === 'string' &&
      track.audioUri.startsWith(FileSystem.documentDirectory)
    ) {
      try {
        await FileSystem.deleteAsync(track.audioUri, { idempotent: true });
      } catch (e) {
        console.warn('[importedTracksStorage] Could not delete physical file:', e);
      }
    }

    const existing = await loadImportedTracks();
    const filtered = existing.filter((t) => t.id !== track.id);
    await saveImportedTracks(filtered);
    return true;
  } catch (err) {
    console.error('[importedTracksStorage] Error removing track:', err);
    return false;
  }
}

/**
 * Verify whether an audio file is accessible on disk
 */
export async function checkAudioFileExists(track: Track): Promise<boolean> {
  if (!track.audioUri) return false;
  if (typeof track.audioUri === 'number') return true; // Local asset module
  if (typeof track.audioUri === 'string' && (track.audioUri.startsWith('http') || track.audioUri.startsWith('blob:'))) {
    return true;
  }
  if (!FileSystem.getInfoAsync) return true;

  try {
    const info = await FileSystem.getInfoAsync(track.audioUri as string);
    return info.exists;
  } catch {
    return false;
  }
}
