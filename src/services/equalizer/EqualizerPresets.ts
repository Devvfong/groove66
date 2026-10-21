import {
  type EqualizerPreset,
  type EqualizerPresetId,
} from './equalizerTypes';

export const EQUALIZER_PRESETS: readonly EqualizerPreset[] = [
  {
    id: 'flat',
    name: 'Flat',
    subtitle: 'Reference',
    description: 'Bypass tone shaping for neutral studio master playback.',
    bandLevelsDb: [0, 0, 0, 0, 0],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    subtitle: '1966 Tube Amp',
    description: 'Warm analog low-end resonance with soft tape treble roll-off.',
    bandLevelsDb: [4, 2, 0, -2, -4],
  },
  {
    id: 'jazz',
    name: 'Jazz',
    subtitle: 'Blue Note',
    description: 'Acoustic upright bass warmth and articulate brass & cymbal brilliance.',
    bandLevelsDb: [3, 1, 0, 2, 3],
  },
  {
    id: 'rock',
    name: 'Rock',
    subtitle: 'Classic Smile',
    description: 'Punchy kick drums, scooped midrange, and soaring electric lead clarity.',
    bandLevelsDb: [5, 3, -1, 3, 5],
  },
  {
    id: 'bass_boost',
    name: 'Bass Boost',
    subtitle: 'Deep Groove',
    description: 'Sub-bass and mid-bass enhancement tailored for low-register warmth.',
    bandLevelsDb: [6, 4, 1, 0, 0],
  },
  {
    id: 'night',
    name: 'Night',
    subtitle: 'Late Drive',
    description: 'Gentle low-mid presence with rolled-off highs for fatigue-free listening.',
    bandLevelsDb: [1, 0, -2, -3, -5],
  },
] as const;

/**
 * Checks whether an array of 5 dB gains matches any predefined preset.
 * If exact match is found, returns that preset ID; otherwise returns 'custom'.
 */
export function matchPresetId(levelsDb: number[]): EqualizerPresetId {
  if (!levelsDb || levelsDb.length !== 5) return 'custom';

  for (const preset of EQUALIZER_PRESETS) {
    const isMatch = preset.bandLevelsDb.every(
      (val, idx) => Math.abs(val - levelsDb[idx]) < 0.1
    );
    if (isMatch) {
      return preset.id;
    }
  }

  return 'custom';
}

export function getPresetById(id: EqualizerPresetId): EqualizerPreset | undefined {
  return EQUALIZER_PRESETS.find((p) => p.id === id);
}
