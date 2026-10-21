import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer as ExpoAudioPlayerInstance,
  type AudioSource,
  type AudioStatus,
} from 'expo-audio';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { type Track } from '../../data/musicData';
import { equalizerService } from '../equalizer/EqualizerService';

export type AudioPlayerState = {
  playing: boolean;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  isLoaded: boolean;
  error: string | null;
};

export type PlaybackStatusListener = (state: AudioPlayerState) => void;
export type TrackCompletionListener = () => void;

export class AudioPlayer {
  private player: ExpoAudioPlayerInstance | null = null;
  private statusSubscription: { remove: () => void } | null = null;
  private isAudioModeConfigured: boolean = false;
  private statusListeners: Set<PlaybackStatusListener> = new Set();
  private completionListeners: Set<TrackCompletionListener> = new Set();
  private hasHandledFinish: boolean = false;
  private currentTrack: Track | null = null;

  private state: AudioPlayerState = {
    playing: false,
    currentTime: 0,
    duration: 0,
    isBuffering: false,
    isLoaded: false,
    error: null,
  };

  /**
   * Configure global audio mode with background playback enabled
   */
  public async initAudioMode(enableBackground: boolean = true): Promise<void> {
    if (this.isAudioModeConfigured) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'doNotMix',
        shouldPlayInBackground: enableBackground,
      });
      this.isAudioModeConfigured = true;
    } catch (err) {
      console.warn('[AudioPlayer] setAudioModeAsync initialization note:', err);
    }
  }

  /**
   * Get current playback state snapshot
   */
  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  /**
   * Subscribe to playback status updates
   */
  public subscribe(listener: PlaybackStatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.getState());
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  /**
   * Subscribe to track completion events
   */
  public onTrackFinished(listener: TrackCompletionListener): () => void {
    this.completionListeners.add(listener);
    return () => {
      this.completionListeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const snapshot = this.getState();
    this.statusListeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (e) {
        console.warn('[AudioPlayer] Listener notification error:', e);
      }
    });
  }

  private notifyFinished(): void {
    this.completionListeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.warn('[AudioPlayer] Finished listener error:', e);
      }
    });
  }

  /**
   * Load an audio track and optionally start playing immediately
   */
  public async loadTrack(track: Track, autoPlay: boolean = true): Promise<void> {
    await this.initAudioMode(true);

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

    // Remove previous status subscription
    if (this.statusSubscription) {
      this.statusSubscription.remove();
      this.statusSubscription = null;
    }

    void equalizerService.syncAudioSession(0);

    // Release existing player instance
    if (this.player) {
      try {
        this.player.remove();
      } catch (err) {
        // Safe disposal
      }
      this.player = null;
    }

    let source: AudioSource = track.audioUri;

    // Handle bundled asset modules in native standalone builds
    if (typeof track.audioUri === 'number') {
      try {
        const { Asset } = require('expo-asset');
        const asset = Asset.fromModule(track.audioUri);
        if (asset && !asset.localUri && typeof asset.downloadAsync === 'function') {
          await asset.downloadAsync();
        }
        if (asset?.localUri) {
          source = { uri: asset.localUri };
        }
      } catch (assetErr) {
        // Fallback to module identifier directly
      }
    } else if (typeof track.audioUri === 'string') {
      source = { uri: track.audioUri };
    }

    try {
      this.player = createAudioPlayer(source, {
        updateInterval: 250,
      });

      const activePlayer = this.player;
      this.statusSubscription = this.player.addListener(
        'playbackStatusUpdate',
        (status: AudioStatus) => {
          if (this.player === activePlayer) this.handleStatusUpdate(status, track);
        }
      );

      // Set lock screen info if supported and not running in generic Expo Go client
      try {
        const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
        if (!isExpoGo && typeof this.player.setActiveForLockScreen === 'function') {
          this.player.setActiveForLockScreen(true, {
            title: track.title,
            artist: track.artist,
            albumTitle: track.album,
          });
        }
      } catch (e) {
        // Safe lock screen fallback
      }

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
      console.error('[AudioPlayer] Failed to create audio player for source:', err);
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

    if (typeof status.audioSessionId === 'number') {
      equalizerService.syncAudioSession(status.audioSessionId);
    }

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
        console.warn('[AudioPlayer] Play execution error:', err);
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
        console.warn('[AudioPlayer] Pause execution error:', err);
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
        console.warn('[AudioPlayer] Seek error:', err);
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
    void equalizerService.syncAudioSession(0);
    if (this.statusSubscription) {
      this.statusSubscription.remove();
      this.statusSubscription = null;
    }
    if (this.player) {
      try {
        if (typeof this.player.clearLockScreenControls === 'function') {
          this.player.clearLockScreenControls();
        }
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
