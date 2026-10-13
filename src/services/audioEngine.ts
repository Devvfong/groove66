import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
  type AudioStatus,
} from 'expo-audio';
import { type Track } from '../data/musicData';

export type RepeatMode = 'off' | 'all' | 'one';

export type AudioPlaybackState = {
  playing: boolean;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  isLoaded: boolean;
  error: string | null;
};

export type PlaybackListener = (state: AudioPlaybackState) => void;
export type TrackFinishedListener = () => void;

class AudioEngineService {
  private player: AudioPlayer | null = null;
  private statusSubscription: { remove: () => void } | null = null;
  private isAudioModeConfigured: boolean = false;
  private listeners: Set<PlaybackListener> = new Set();
  private finishedListeners: Set<TrackFinishedListener> = new Set();
  private hasHandledFinish: boolean = false;
  private currentTrack: Track | null = null;

  private state: AudioPlaybackState = {
    playing: false,
    currentTime: 0,
    duration: 0,
    isBuffering: false,
    isLoaded: false,
    error: null,
  };

  /**
   * Configure Android and iOS audio modes for media playback
   */
  public async initAudioMode(): Promise<void> {
    if (this.isAudioModeConfigured) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'doNotMix',
        shouldPlayInBackground: false,
      });
      this.isAudioModeConfigured = true;
    } catch (err) {
      console.warn('[AudioEngine] setAudioModeAsync initialization note:', err);
    }
  }

  /**
   * Current snapshot of playback state
   */
  public getState(): AudioPlaybackState {
    return { ...this.state };
  }

  /**
   * Subscribe to real-time playback updates
   */
  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to track completion events
   */
  public onTrackFinished(listener: TrackFinishedListener): () => void {
    this.finishedListeners.add(listener);
    return () => {
      this.finishedListeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (e) {
        console.warn('[AudioEngine] Listener notification error:', e);
      }
    });
  }

  private notifyFinished(): void {
    this.finishedListeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.warn('[AudioEngine] Finished listener error:', e);
      }
    });
  }

  /**
   * Load an audio track and optionally begin playback immediately
   */
  public async loadTrack(track: Track, autoPlay: boolean = true): Promise<void> {
    await this.initAudioMode();

    if (!track.audioUri) {
      this.stop();
      this.state = {
        playing: false,
        currentTime: 0,
        duration: track.duration || 0,
        isBuffering: false,
        isLoaded: false,
        error: 'No audio file attached to this track.',
      };
      this.notifyListeners();
      return;
    }

    this.currentTrack = track;
    this.hasHandledFinish = false;

    // Clear prior subscription
    if (this.statusSubscription) {
      this.statusSubscription.remove();
      this.statusSubscription = null;
    }

    // Release prior player instance to prevent overlapping audio
    if (this.player) {
      try {
        this.player.remove();
      } catch (err) {
        // Safe disposal
      }
      this.player = null;
    }

    const source: AudioSource = track.audioUri;

    try {
      this.player = createAudioPlayer(source, {
        updateInterval: 250,
      });

      this.statusSubscription = this.player.addListener(
        'playbackStatusUpdate',
        (status: AudioStatus) => {
          this.handleStatusUpdate(status, track);
        }
      );

      if (autoPlay) {
        this.player.play();
        this.state.playing = true;
      } else {
        this.state.playing = false;
      }

      this.state.error = null;
      this.state.isLoaded = true;
      this.notifyListeners();
    } catch (err: any) {
      console.error('[AudioEngine] Failed to create audio player for source:', err);
      this.state.playing = false;
      this.state.isLoaded = false;
      this.state.error = err?.message || 'Error loading audio file';
      this.notifyListeners();
      throw err;
    }
  }

  private handleStatusUpdate(status: AudioStatus, track: Track): void {
    const duration = status.duration > 0 ? status.duration : (track.duration || 0);
    const isFinished = status.didJustFinish || (duration > 0 && status.currentTime >= duration);

    this.state = {
      playing: status.playing,
      currentTime: Math.floor(status.currentTime),
      duration: Math.floor(duration),
      isBuffering: status.isBuffering,
      isLoaded: status.isLoaded,
      error: status.error,
    };

    this.notifyListeners();

    if (isFinished && !this.hasHandledFinish) {
      this.hasHandledFinish = true;
      this.notifyFinished();
    } else if (!isFinished) {
      this.hasHandledFinish = false;
    }
  }

  public play(): void {
    if (this.player) {
      try {
        this.player.play();
        this.state.playing = true;
        this.notifyListeners();
      } catch (err) {
        console.warn('[AudioEngine] Play execution error:', err);
      }
    }
  }

  public pause(): void {
    if (this.player) {
      try {
        this.player.pause();
        this.state.playing = false;
        this.notifyListeners();
      } catch (err) {
        console.warn('[AudioEngine] Pause execution error:', err);
      }
    }
  }

  public async seekTo(seconds: number): Promise<void> {
    if (this.player) {
      try {
        const clamped = Math.max(0, Math.min(seconds, this.state.duration || 3600));
        await this.player.seekTo(clamped);
        this.state.currentTime = Math.floor(clamped);
        this.hasHandledFinish = false;
        this.notifyListeners();
      } catch (err) {
        console.warn('[AudioEngine] Seek error:', err);
      }
    }
  }

  public stop(): void {
    if (this.player) {
      try {
        this.player.pause();
        this.player.seekTo(0);
      } catch (err) {}
    }
    this.state.playing = false;
    this.state.currentTime = 0;
    this.hasHandledFinish = false;
    this.notifyListeners();
  }

  public release(): void {
    if (this.statusSubscription) {
      this.statusSubscription.remove();
      this.statusSubscription = null;
    }
    if (this.player) {
      try {
        this.player.remove();
      } catch (err) {}
      this.player = null;
    }
    this.state = {
      playing: false,
      currentTime: 0,
      duration: 0,
      isBuffering: false,
      isLoaded: false,
      error: null,
    };
    this.hasHandledFinish = false;
    this.currentTrack = null;
    this.notifyListeners();
  }
}

export const audioEngine = new AudioEngineService();
