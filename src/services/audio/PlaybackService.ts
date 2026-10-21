import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, type AppStateStatus } from 'react-native';
import { AudioPlayer, type AudioPlayerState } from './AudioPlayer';
import { QueueManager, type RepeatMode } from './QueueManager';
import { TRACKS, type Track, isAudioAvailable } from '../../data/musicData';
import { equalizerService } from '../equalizer/EqualizerService';

const PLAYBACK_STORAGE_KEY = '@groove66_playback_state_v1';

export type PlaybackSnapshot = {
  currentTrack: Track;
  currentIndex: number;
  playing: boolean;
  progressSeconds: number;
  duration: number;
  isBuffering: boolean;
  isLoaded: boolean;
  shuffle: boolean;
  repeat: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  hasStartedPlayback: boolean;
  error: string | null;
};

export type PlaybackListener = (state: PlaybackSnapshot) => void;

class PlaybackService {
  private audioPlayer: AudioPlayer;
  private queueManager: QueueManager;
  private listeners: Set<PlaybackListener> = new Set();
  private isInitialized: boolean = false;
  private hasStartedPlayback: boolean = false;
  private appStateSubscription: { remove: () => void } | null = null;
  private persistDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.queueManager = new QueueManager(TRACKS);

    // Subscribe to raw audio status updates
    this.audioPlayer.subscribe((audioState) => {
      this.handleAudioStatusUpdate(audioState);
    });

    // Auto-advance when track finishes
    this.audioPlayer.onTrackFinished(() => {
      this.handleTrackFinished();
    });

    // Setup app state listener
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  /**
   * Initialize service and restore persisted playback state
   */
  public async init(allAvailableTracks: Track[] = TRACKS): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Initialize vintage equalizer service & restore gains
    equalizerService.init().catch((err) => {
      console.warn('[PlaybackService] Equalizer init note:', err);
    });

    try {
      const savedData = await AsyncStorage.getItem(PLAYBACK_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.queueTrackIds && Array.isArray(parsed.queueTrackIds)) {
          const restoredQueue = parsed.queueTrackIds
            .map((id: string) => allAvailableTracks.find((t) => t.id === id))
            .filter(Boolean) as Track[];

          if (restoredQueue.length > 0) {
            const startIndex = parsed.currentTrackId
              ? restoredQueue.findIndex((t) => t.id === parsed.currentTrackId)
              : 0;
            this.queueManager.setQueue(restoredQueue, startIndex >= 0 ? startIndex : 0);
          }
        }

        if (parsed.repeatMode) {
          this.queueManager.setRepeatMode(parsed.repeatMode);
        }
        if (parsed.shuffle !== undefined) {
          this.queueManager.setShuffle(Boolean(parsed.shuffle));
        }

        const current = this.queueManager.getCurrentTrack();
        if (current && parsed.progressSeconds > 0) {
          // Pre-load track without auto-playing on app launch
          await this.audioPlayer.loadTrack(current, false);
          if (parsed.progressSeconds < (current.duration || 300)) {
            await this.audioPlayer.seekTo(parsed.progressSeconds);
          }
        }
      }
    } catch (err) {
      console.warn('[PlaybackService] Failed to restore playback state:', err);
    }

    this.notifyListeners();
  }

  /**
   * Get complete reactive snapshot of playback state
   */
  public getState(): PlaybackSnapshot {
    const audioState = this.audioPlayer.getState();
    const currentTrack = this.queueManager.getCurrentTrack() || TRACKS[0];
    const repeatMode = this.queueManager.getRepeatMode();

    return {
      currentTrack,
      currentIndex: this.queueManager.getCurrentIndex(),
      playing: audioState.playing,
      progressSeconds: audioState.currentTime,
      duration: audioState.duration || currentTrack.duration || 0,
      isBuffering: audioState.isBuffering,
      isLoaded: audioState.isLoaded,
      shuffle: this.queueManager.isShuffle(),
      repeat: repeatMode !== 'off',
      repeatMode,
      queue: this.queueManager.getQueue(),
      hasStartedPlayback: this.hasStartedPlayback,
      error: audioState.error,
    };
  }

  /**
   * Subscribe to playback snapshot changes
   */
  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.warn('[PlaybackService] Listener notification error:', err);
      }
    });
    this.schedulePersist();
  }

  private handleAudioStatusUpdate(_audioState: AudioPlayerState): void {
    this.notifyListeners();
  }

  private async handleTrackFinished(): Promise<void> {
    const repeatMode = this.queueManager.getRepeatMode();
    if (repeatMode === 'one') {
      await this.audioPlayer.seekTo(0);
      this.audioPlayer.play();
      this.notifyListeners();
      return;
    }

    const nextTrack = this.queueManager.step(1);
    if (nextTrack) {
      await this.playTrackInternal(nextTrack, true);
    } else {
      // Reached end of queue without repeat all
      this.audioPlayer.stop();
      this.notifyListeners();
    }
  }

  private handleAppStateChange = (_status: AppStateStatus): void => {
    // Background playback is managed via setAudioModeAsync shouldPlayInBackground: true
  };

  /**
   * Play a specific track, optionally replacing the queue
   */
  public async playTrack(track: Track, newQueue?: Track[]): Promise<void> {
    this.hasStartedPlayback = true;

    if (newQueue && newQueue.length > 0) {
      const trackIdx = newQueue.findIndex((t) => t.id === track.id);
      this.queueManager.setQueue(newQueue, trackIdx >= 0 ? trackIdx : 0);
    } else {
      const currentQueue = this.queueManager.getQueue();
      const existingIdx = currentQueue.findIndex((t) => t.id === track.id);
      if (existingIdx >= 0) {
        this.queueManager.setCurrentIndex(existingIdx);
      } else {
        this.queueManager.setQueue([track, ...currentQueue], 0);
      }
    }

    await this.playTrackInternal(track, true);
  }

  /**
   * Play an entire queue starting from a specific index
   */
  public async playQueue(tracks: Track[], startIndex: number = 0): Promise<void> {
    if (tracks.length === 0) return;
    this.hasStartedPlayback = true;
    this.queueManager.setQueue(tracks, startIndex);
    const targetTrack = this.queueManager.getCurrentTrack();
    if (targetTrack) {
      await this.playTrackInternal(targetTrack, true);
    }
  }

  private async playTrackInternal(track: Track, autoPlay: boolean = true): Promise<void> {
    try {
      if (isAudioAvailable(track)) {
        await this.audioPlayer.loadTrack(track, autoPlay);
      } else {
        // Track has no audio (demo mode track)
        this.audioPlayer.stop();
      }
    } catch (err) {
      console.warn('[PlaybackService] Failed to load track into AudioPlayer:', err);
    }
    this.notifyListeners();
  }

  /**
   * Toggle play / pause
   */
  public togglePlay(): void {
    this.hasStartedPlayback = true;
    const state = this.audioPlayer.getState();
    const currentTrack = this.queueManager.getCurrentTrack();

    if (state.playing) {
      this.audioPlayer.pause();
    } else {
      if (state.isLoaded) {
        this.audioPlayer.play();
      } else if (currentTrack && isAudioAvailable(currentTrack)) {
        this.audioPlayer.loadTrack(currentTrack, true);
      }
    }
    this.notifyListeners();
  }

  public play(): void {
    this.hasStartedPlayback = true;
    const state = this.audioPlayer.getState();
    const currentTrack = this.queueManager.getCurrentTrack();
    if (state.isLoaded) {
      this.audioPlayer.play();
    } else if (currentTrack && isAudioAvailable(currentTrack)) {
      this.audioPlayer.loadTrack(currentTrack, true);
    }
    this.notifyListeners();
  }

  public pause(): void {
    this.audioPlayer.pause();
    this.notifyListeners();
  }

  public stop(): void {
    this.audioPlayer.stop();
    this.notifyListeners();
  }

  /**
   * Step to next (+1) or previous (-1) track
   */
  public async step(delta: number): Promise<void> {
    this.hasStartedPlayback = true;
    const targetTrack = this.queueManager.step(delta);
    if (targetTrack) {
      await this.playTrackInternal(targetTrack, true);
    }
  }

  /**
   * Seek playback to a specific timestamp in seconds
   */
  public async seekTo(seconds: number): Promise<void> {
    await this.audioPlayer.seekTo(seconds);
    this.notifyListeners();
  }

  /**
   * Toggle shuffle mode
   */
  public toggleShuffle(): boolean {
    const nextShuffle = this.queueManager.toggleShuffle();
    this.notifyListeners();
    return nextShuffle;
  }

  /**
   * Toggle repeat mode: off -> all -> one -> off
   */
  public toggleRepeat(): RepeatMode {
    const nextMode = this.queueManager.toggleRepeat();
    this.notifyListeners();
    return nextMode;
  }

  /**
   * Debounced persistence of playback state
   */
  private schedulePersist(): void {
    if (this.persistDebounceTimer) {
      clearTimeout(this.persistDebounceTimer);
    }
    this.persistDebounceTimer = setTimeout(() => {
      this.persistState();
    }, 1000);
  }

  private async persistState(): Promise<void> {
    try {
      const state = this.getState();
      const payload = {
        currentTrackId: state.currentTrack.id,
        progressSeconds: state.progressSeconds,
        shuffle: state.shuffle,
        repeatMode: state.repeatMode,
        queueTrackIds: state.queue.map((t) => t.id),
      };
      await AsyncStorage.setItem(PLAYBACK_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('[PlaybackService] Failed to persist state:', err);
    }
  }

  public release(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    if (this.persistDebounceTimer) {
      clearTimeout(this.persistDebounceTimer);
      this.persistDebounceTimer = null;
    }
    this.audioPlayer.release();
    this.listeners.clear();
  }
}

export const playbackService = new PlaybackService();
