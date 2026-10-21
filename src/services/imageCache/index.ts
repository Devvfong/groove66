import { Image } from 'react-native';

interface CacheEntry {
  uri: string;
  timestamp: number;
  size?: number;
}

class ImageCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private maxEntries: number = 100;
  private hitCount: number = 0;
  private missCount: number = 0;

  /**
   * Preload an image URL or local asset into the native image cache
   */
  public async prefetch(uri: string): Promise<boolean> {
    if (!uri) return false;

    if (this.cache.has(uri)) {
      this.hitCount++;
      return true;
    }

    this.missCount++;
    try {
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        await Image.prefetch(uri);
      }
      this.setCacheEntry(uri);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Preload a batch of artwork URIs
   */
  public async prefetchBatch(uris: string[]): Promise<void> {
    const promises = uris.filter(Boolean).map((uri) => this.prefetch(uri));
    await Promise.allSettled(promises);
  }

  /**
   * Record a cache entry with LRU eviction
   */
  private setCacheEntry(uri: string): void {
    if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (LRU)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(uri, {
      uri,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if an artwork URI has already been cached
   */
  public isCached(uri: string): boolean {
    return this.cache.has(uri);
  }

  /**
   * Clear in-memory cache to release memory
   */
  public clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Retrieve cache diagnostics
   */
  public getStats() {
    return {
      size: this.cache.size,
      maxEntries: this.maxEntries,
      hits: this.hitCount,
      misses: this.missCount,
      hitRatio:
        this.hitCount + this.missCount > 0
          ? (this.hitCount / (this.hitCount + this.missCount)).toFixed(2)
          : '0.00',
    };
  }
}

export const imageCache = new ImageCacheService();
