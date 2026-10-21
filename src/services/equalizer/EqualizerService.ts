import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type EqualizerBand,
  type EqualizerListener,
  type EqualizerPresetId,
  type EqualizerState,
  HARDWARE_BAND_LABELS,
  HARDWARE_FREQUENCIES_HZ,
  MAX_GAIN_DB,
  MAX_GAIN_MB,
  MIN_GAIN_DB,
  MIN_GAIN_MB,
  dbToMilliBels,
} from './equalizerTypes';
import {
  EQUALIZER_PRESETS,
  getPresetById,
  matchPresetId,
} from './EqualizerPresets';

const EQUALIZER_STORAGE_KEY = '@groove66_equalizer_v1';

interface PersistedEqualizerData {
  isEnabled: boolean;
  activePresetId: EqualizerPresetId;
  bandLevelsDb: number[];
  frequencies?: number[];
}

class EqualizerService {
  private nativeModule: any = null;
  private listeners: Set<EqualizerListener> = new Set();
  private initPromise: Promise<void> | null = null;
  private nativeQueue: Promise<void> = Promise.resolve();
  private requestedSessionId = 0;
  private sessionRevision = 0;
  private lastAttemptAt = 0;
  private savedCurve: { frequencies: number[]; levels: number[] } | null = null;

  private enqueue(operation: () => Promise<void>): Promise<void> {
    const task = this.nativeQueue.then(operation);
    this.nativeQueue = task.catch(() => {});
    return task;
  }

  private checkResult(result: any): void {
    if (result?.success === false) throw new Error(result.error || 'Native equalizer operation failed');
  }

  private presetGain(levels: readonly number[], hz: number): number {
    const x = Math.log(Math.max(1, hz));
    for (let i = 1; i < HARDWARE_FREQUENCIES_HZ.length; i++) {
      if (hz <= HARDWARE_FREQUENCIES_HZ[i]) {
        const lo = Math.log(HARDWARE_FREQUENCIES_HZ[i - 1]);
        const hi = Math.log(HARDWARE_FREQUENCIES_HZ[i]);
        const t = Math.max(0, Math.min(1, (x - lo) / (hi - lo)));
        return levels[i - 1] + t * (levels[i] - levels[i - 1]);
      }
    }
    return levels[levels.length - 1] ?? 0;
  }

  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  private state: EqualizerState;

  constructor() {
    this.nativeModule = NativeModules?.GrooveEqualizer || null;

    // Default to Vintage '66 warm analog curve
    const defaultPreset = EQUALIZER_PRESETS.find((p) => p.id === 'vintage') || EQUALIZER_PRESETS[0];

    const initialBands: EqualizerBand[] = HARDWARE_FREQUENCIES_HZ.map((freq, index) => {
      const db = defaultPreset.bandLevelsDb[index] ?? 0;
      return {
        index,
        centerFreqHz: freq,
        label: HARDWARE_BAND_LABELS[index] || `${freq} Hz`,
        minMilliBels: MIN_GAIN_MB,
        maxMilliBels: MAX_GAIN_MB,
        levelMilliBels: dbToMilliBels(db),
        levelDb: db,
      };
    });

    this.state = {
      isEnabled: true,
      isSupported: Platform.OS === 'android' && Boolean(this.nativeModule),
      isAttached: false,
      currentSessionId: 0,
      activePresetId: defaultPreset.id,
      bands: initialBands,
      error: null,
    };
  }

  /**
   * Initialize service, check hardware support, and restore saved user settings
   */
  public init(): Promise<void> {
    if (!this.initPromise) this.initPromise = this.restore();
    return this.initPromise;
  }

  private async restore(): Promise<void> {

    // Check native support
    if (this.nativeModule && typeof this.nativeModule.isSupported === 'function') {
      try {
        const supported = await this.nativeModule.isSupported();
        this.state.isSupported = Boolean(supported);
      } catch (err: any) {
        console.warn('[EqualizerService] Native isSupported check error:', err);
      }
    }

    // Restore persisted settings
    try {
      const raw = await AsyncStorage.getItem(EQUALIZER_STORAGE_KEY);
      if (raw) {
        const parsed: PersistedEqualizerData = JSON.parse(raw);
        if (typeof parsed.isEnabled === 'boolean') {
          this.state.isEnabled = parsed.isEnabled;
        }

        if (Array.isArray(parsed.bandLevelsDb) && parsed.bandLevelsDb.length > 0 && parsed.bandLevelsDb.every(Number.isFinite)) {
          const frequencies = Array.isArray(parsed.frequencies) && parsed.frequencies.length === parsed.bandLevelsDb.length &&
            parsed.frequencies.every(f => Number.isFinite(f) && f > 0) ? parsed.frequencies : [...HARDWARE_FREQUENCIES_HZ];
          this.savedCurve = { frequencies, levels: parsed.bandLevelsDb };
          this.state.bands = this.state.bands.map((band, idx) => {
            const db = Math.max(MIN_GAIN_DB, Math.min(MAX_GAIN_DB, parsed.bandLevelsDb[idx] ?? 0));
            return {
              ...band,
              levelDb: db,
              levelMilliBels: dbToMilliBels(db),
            };
          });

          this.state.activePresetId =
            (parsed.activePresetId === 'custom' || getPresetById(parsed.activePresetId)) ? parsed.activePresetId : matchPresetId(parsed.bandLevelsDb);
        }
      }
    } catch (err) {
      console.warn('[EqualizerService] Failed to restore saved equalizer settings:', err);
    }

    this.notify();
  }

  /**
   * Current snapshot of equalizer state
   */
  public getState(): EqualizerState {
    return {
      ...this.state,
      bands: this.state.bands.map((b) => ({ ...b })),
    };
  }

  /**
   * Subscribe to equalizer state modifications
   */
  public subscribe(listener: EqualizerListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (e) {
        console.warn('[EqualizerService] Listener dispatch error:', e);
      }
    });
  }

  /**
   * Synchronize active native ExoPlayer audio session ID.
   * Called by AudioPlayer whenever a track is loaded or session changes.
   */
  public syncAudioSession(sessionId: number): Promise<void> {
    sessionId = Number.isInteger(sessionId) && sessionId > 0 ? sessionId : 0;
    if (sessionId === this.requestedSessionId &&
        (!sessionId || this.state.isAttached || Date.now() - this.lastAttemptAt < 2000)) return this.nativeQueue;
    this.lastAttemptAt = Date.now();
    this.requestedSessionId = sessionId;
    const revision = ++this.sessionRevision;
    return this.enqueue(async () => {
      await this.init();
      if (revision !== this.sessionRevision) return;
      this.state.isAttached = false;
      this.state.currentSessionId = sessionId;
      try {
        if (!sessionId) {
          await this.nativeModule?.release?.();
          this.state.error = null;
        } else if (!this.nativeModule?.attachToSession) {
          this.state.isSupported = false;
          this.state.error = 'Native equalizer unavailable in this build';
        } else {
          const params = await this.nativeModule.attachToSession(sessionId);
          this.checkResult(params);
          if (!params?.attached || params.sessionId !== sessionId || !params.bands?.length ||
              !Number.isFinite(params.minLevel) || !Number.isFinite(params.maxLevel) || params.minLevel >= params.maxLevel) {
            throw new Error('Invalid native equalizer capabilities');
          }
          if (revision !== this.sessionRevision) return;
          const previous = this.savedCurve || {
            frequencies: this.state.bands.map(b => b.centerFreqHz),
            levels: this.state.bands.map(b => b.levelDb),
          };
          this.state.bands = params.bands.map((band: any) => {
            const saved = previous.frequencies.indexOf(band.centerFreq);
            const desired = saved >= 0 ? previous.levels[saved] :
              this.presetGain(getPresetById(this.state.activePresetId)?.bandLevelsDb || [0, 0, 0, 0, 0], band.centerFreq);
            const mb = Math.max(params.minLevel, Math.min(params.maxLevel, Math.round(desired * 100)));
            return { index: band.index, centerFreqHz: band.centerFreq,
              label: band.centerFreq >= 1000 ? `${+(band.centerFreq / 1000).toFixed(1)} kHz` : `${band.centerFreq} Hz`,
              minMilliBels: params.minLevel, maxMilliBels: params.maxLevel,
              levelMilliBels: mb, levelDb: mb / 100 };
          });
          this.checkResult(await this.nativeModule.setAllBandLevels(this.state.bands.map(b => b.levelMilliBels)));
          this.checkResult(await this.nativeModule.setEnabled(this.state.isEnabled));
          this.state.isAttached = revision === this.sessionRevision;
          this.state.isSupported = true;
          this.state.error = null;
        }
      } catch (err: any) {
        this.state.isAttached = false;
        this.state.error = err?.message || 'Equalizer attachment failed';
        try { await this.nativeModule?.release?.(); } catch {}
      }
      this.notify();
    });
  }

  /**
   * Toggle the equalizer circuit on/off (bypass vs engaged)
   */
  public async setEnabled(enabled: boolean): Promise<void> {
    await this.init();
    this.state.isEnabled = enabled;

    if (this.nativeModule && typeof this.nativeModule.setEnabled === 'function') {
      try {
        await this.enqueue(async () => { this.checkResult(await this.nativeModule.setEnabled(enabled)); });
      } catch (err: any) {
        this.state.error = err?.message || 'Enable failed';
        this.state.isAttached = false;
      }
    }

    this.schedulePersist();
    this.notify();
  }

  public async toggleEnabled(): Promise<void> {
    await this.setEnabled(!this.state.isEnabled);
  }

  /**
   * Adjust gain on a specific frequency band (-15 dB to +15 dB)
   */
  public async setBandLevel(bandIndex: number, dbLevel: number): Promise<void> {
    await this.init();
    if (!Number.isInteger(bandIndex) || !Number.isFinite(dbLevel) || bandIndex < 0 || bandIndex >= this.state.bands.length) return;

    const target = this.state.bands[bandIndex];
    const clampedDb = Math.max(target.minMilliBels / 100, Math.min(target.maxMilliBels / 100, Math.round(dbLevel * 2) / 2));
    const milliBels = Math.round(clampedDb * 100);

    this.state.bands = this.state.bands.map((band) => {
      if (band.index === bandIndex) {
        return {
          ...band,
          levelDb: clampedDb,
          levelMilliBels: milliBels,
        };
      }
      return band;
    });

    this.savedCurve = { frequencies: this.state.bands.map(b => b.centerFreqHz), levels: this.state.bands.map(b => b.levelDb) };

    // Check if new curve matches an existing preset or becomes custom
    const currentDbCurve = this.state.bands.map((b) => b.levelDb);
    this.state.activePresetId = matchPresetId(currentDbCurve);

    // Send to native equalizer if available
    if (this.nativeModule && typeof this.nativeModule.setBandLevel === 'function') {
      try {
        await this.enqueue(async () => { this.checkResult(await this.nativeModule.setBandLevel(bandIndex, milliBels)); });
      } catch (err: any) {
        this.state.error = err?.message || 'Band update failed';
        this.state.isAttached = false;
      }
    }

    this.schedulePersist();
    this.notify();
  }

  /**
   * Apply a predefined vintage/modern equalizer preset
   */
  public async applyPreset(presetId: EqualizerPresetId): Promise<void> {
    await this.init();
    const preset = getPresetById(presetId);
    if (!preset) return;

    this.state.activePresetId = presetId;
    const millibelsArray: number[] = [];

    this.state.bands = this.state.bands.map((band, idx) => {
      const desired = this.presetGain(preset.bandLevelsDb, band.centerFreqHz);
      const mb = Math.max(band.minMilliBels, Math.min(band.maxMilliBels, Math.round(desired * 100)));
      const db = mb / 100;
      millibelsArray.push(mb);
      return {
        ...band,
        levelDb: db,
        levelMilliBels: mb,
      };
    });

    this.savedCurve = { frequencies: this.state.bands.map(b => b.centerFreqHz), levels: this.state.bands.map(b => b.levelDb) };

    if (this.nativeModule && typeof this.nativeModule.setAllBandLevels === 'function') {
      try {
        await this.enqueue(async () => { this.checkResult(await this.nativeModule.setAllBandLevels(millibelsArray)); });
      } catch (err: any) {
        this.state.error = err?.message || 'Preset update failed';
        this.state.isAttached = false;
      }
    }

    this.schedulePersist();
    this.notify();
  }

  /**
   * Reset all bands to 0 dB flat reference
   */
  public async resetToFlat(): Promise<void> {
    await this.applyPreset('flat');
  }

  /**
   * Debounced persistence to avoid unnecessary flash writes during rapid slider dragging
   */
  private schedulePersist(): void {
    if (this.persistTimer) {
      clearTimeout(this.persistTimer);
    }

    this.persistTimer = setTimeout(async () => {
      try {
        const data: PersistedEqualizerData = {
          isEnabled: this.state.isEnabled,
          activePresetId: this.state.activePresetId,
          bandLevelsDb: this.savedCurve?.levels || this.state.bands.map(b => b.levelDb),
          frequencies: this.savedCurve?.frequencies || this.state.bands.map(b => b.centerFreqHz),
        };
        await AsyncStorage.setItem(EQUALIZER_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.warn('[EqualizerService] Error persisting equalizer settings:', err);
      }
    }, 300);
  }
}

export const equalizerService = new EqualizerService();
