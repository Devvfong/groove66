import { type Track } from '../../data/musicData';

export type RepeatMode = 'off' | 'all' | 'one';

export class QueueManager {
  private queue: Track[] = [];
  private originalQueue: Track[] = [];
  private currentIndex: number = 0;
  private shuffle: boolean = false;
  private repeatMode: RepeatMode = 'off';

  constructor(initialTracks: Track[] = []) {
    if (initialTracks.length > 0) {
      this.setQueue(initialTracks, 0);
    }
  }

  /**
   * Replace the entire queue and set active track index
   */
  public setQueue(tracks: Track[], startIndex: number = 0): void {
    this.originalQueue = [...tracks];
    const safeIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));

    if (this.shuffle && tracks.length > 1) {
      const activeTrack = tracks[safeIndex];
      const remaining = tracks.filter((_, idx) => idx !== safeIndex);
      // Fisher-Yates shuffle remaining
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      this.queue = [activeTrack, ...remaining];
      this.currentIndex = 0;
    } else {
      this.queue = [...tracks];
      this.currentIndex = safeIndex;
    }
  }

  /**
   * Append track to the queue
   */
  public addTrack(track: Track): void {
    this.originalQueue.push(track);
    this.queue.push(track);
  }

  /**
   * Get currently active track
   */
  public getCurrentTrack(): Track | null {
    if (this.queue.length === 0) return null;
    if (this.currentIndex < 0 || this.currentIndex >= this.queue.length) {
      this.currentIndex = 0;
    }
    return this.queue[this.currentIndex] || null;
  }

  /**
   * Get current track index
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get current queue list
   */
  public getQueue(): Track[] {
    return [...this.queue];
  }

  /**
   * Check if there are tracks in queue
   */
  public hasTracks(): boolean {
    return this.queue.length > 0;
  }

  /**
   * Peek next track based on repeat and queue state
   */
  public getNextTrack(): Track | null {
    if (this.queue.length === 0) return null;

    if (this.repeatMode === 'one') {
      return this.getCurrentTrack();
    }

    if (this.currentIndex + 1 < this.queue.length) {
      return this.queue[this.currentIndex + 1];
    }

    if (this.repeatMode === 'all') {
      return this.queue[0];
    }

    return null;
  }

  /**
   * Peek previous track
   */
  public getPreviousTrack(): Track | null {
    if (this.queue.length === 0) return null;

    if (this.currentIndex > 0) {
      return this.queue[this.currentIndex - 1];
    }

    if (this.repeatMode === 'all') {
      return this.queue[this.queue.length - 1];
    }

    return this.queue[0];
  }

  /**
   * Advance or step back in the queue
   * @param delta +1 for next, -1 for previous
   */
  public step(delta: number): Track | null {
    if (this.queue.length === 0) return null;

    if (delta > 0) {
      if (this.repeatMode === 'one') {
        return this.getCurrentTrack();
      }
      if (this.currentIndex + 1 < this.queue.length) {
        this.currentIndex += 1;
        return this.queue[this.currentIndex];
      }
      if (this.repeatMode === 'all') {
        this.currentIndex = 0;
        return this.queue[0];
      }
      // Reached end of queue with repeat off
      return null;
    }

    if (delta < 0) {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        return this.queue[this.currentIndex];
      }
      if (this.repeatMode === 'all') {
        this.currentIndex = this.queue.length - 1;
        return this.queue[this.currentIndex];
      }
      this.currentIndex = 0;
      return this.queue[0];
    }

    return this.getCurrentTrack();
  }

  /**
   * Set track index directly
   */
  public setCurrentIndex(index: number): Track | null {
    if (index >= 0 && index < this.queue.length) {
      this.currentIndex = index;
      return this.queue[this.currentIndex];
    }
    return null;
  }

  /**
   * Toggle shuffle mode
   */
  public toggleShuffle(): boolean {
    const nextShuffle = !this.shuffle;
    this.setShuffle(nextShuffle);
    return this.shuffle;
  }

  /**
   * Explicitly set shuffle mode
   */
  public setShuffle(enabled: boolean): void {
    if (this.shuffle === enabled) return;
    this.shuffle = enabled;

    const currentTrack = this.getCurrentTrack();
    if (!currentTrack || this.originalQueue.length <= 1) return;

    if (this.shuffle) {
      // Keep current track at index 0, shuffle remaining
      const remaining = this.originalQueue.filter((t) => t.id !== currentTrack.id);
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      this.queue = [currentTrack, ...remaining];
      this.currentIndex = 0;
    } else {
      // Restore original queue order and find index of current track
      this.queue = [...this.originalQueue];
      const origIdx = this.queue.findIndex((t) => t.id === currentTrack.id);
      this.currentIndex = origIdx >= 0 ? origIdx : 0;
    }
  }

  public isShuffle(): boolean {
    return this.shuffle;
  }

  /**
   * Cycle repeat mode: off -> all -> one -> off
   */
  public toggleRepeat(): RepeatMode {
    if (this.repeatMode === 'off') {
      this.repeatMode = 'all';
    } else if (this.repeatMode === 'all') {
      this.repeatMode = 'one';
    } else {
      this.repeatMode = 'off';
    }
    return this.repeatMode;
  }

  public setRepeatMode(mode: RepeatMode): void {
    this.repeatMode = mode;
  }

  public getRepeatMode(): RepeatMode {
    return this.repeatMode;
  }

  public clear(): void {
    this.queue = [];
    this.originalQueue = [];
    this.currentIndex = 0;
  }
}
