/**
 * Groove '66 — Native 1960s Hi-Fi Stereo Audio Equalizer Types
 * Targets Android native android.media.audiofx.Equalizer via GrooveEqualizer native module.
 */

export type EqualizerPresetId =
  | 'flat'
  | 'vintage'
  | 'jazz'
  | 'rock'
  | 'bass_boost'
  | 'night'
  | 'custom';

export interface EqualizerBand {
  index: number;
  centerFreqHz: number;
  label: string;
  minMilliBels: number;
  maxMilliBels: number;
  levelMilliBels: number;
  levelDb: number;
}

export interface EqualizerPreset {
  id: EqualizerPresetId;
  name: string;
  subtitle: string;
  description: string;
  bandLevelsDb: [number, number, number, number, number];
}

export interface EqualizerState {
  isEnabled: boolean;
  isSupported: boolean;
  isAttached: boolean;
  currentSessionId: number;
  activePresetId: EqualizerPresetId;
  bands: EqualizerBand[];
  error: string | null;
}

export type EqualizerListener = (state: EqualizerState) => void;

/**
 * Reference frequencies for preset curves and unattached UI.
 * Attached frequencies and ranges are queried from Android.
 */
export const HARDWARE_FREQUENCIES_HZ: readonly number[] = [60, 230, 910, 3600, 14000] as const;

export const HARDWARE_BAND_LABELS: readonly string[] = [
  '60 Hz',
  '230 Hz',
  '910 Hz',
  '3.6 kHz',
  '14 kHz',
] as const;

export const HARDWARE_BAND_ROLES: readonly string[] = [
  'Deep Bass',
  'Warmth',
  'Vocals',
  'Presence',
  'Brilliance',
] as const;

export const MIN_GAIN_DB = -15;
export const MAX_GAIN_DB = 15;
export const MIN_GAIN_MB = -1500;
export const MAX_GAIN_MB = 1500;

/**
 * Convert decibels (-15 dB to +15 dB) to millibels (-1500 mB to +1500 mB)
 */
export function dbToMilliBels(db: number): number {
  const clampedDb = Math.max(MIN_GAIN_DB, Math.min(MAX_GAIN_DB, db));
  return Math.round(clampedDb * 100);
}

/**
 * Convert millibels (-1500 mB to +1500 mB) to decibels (-15.0 dB to +15.0 dB)
 */
export function milliBelsToDb(mb: number): number {
  const clampedMb = Math.max(MIN_GAIN_MB, Math.min(MAX_GAIN_MB, mb));
  return Math.round((clampedMb / 100) * 10) / 10;
}
