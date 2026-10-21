import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  playbackService,
  type PlaybackSnapshot,
} from '../services/audio/PlaybackService';
import {
  TRACKS,
  ALBUMS,
  LICENSED_TEST_TRACK,
  type Track,
  type Album,
  type Playlist,
  getPlaylistTracks,
} from '../data/musicData';
import { type RepeatMode } from '../services/audio/QueueManager';

export interface PlayerContextType {
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

  playTrack: (track: Track, newQueue?: Track[]) => void;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  playAlbum: (album: Album) => void;
  playPlaylist: (playlist: Playlist) => void;
  playAllTracks: (tracks: Track[]) => void;
  playSampleTrack: () => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  stepTrack: (delta: number) => void;
  seekTo: (seconds: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: ReactNode; initialTracks?: Track[] }> = ({
  children,
  initialTracks = TRACKS,
}) => {
  const [snapshot, setSnapshot] = useState<PlaybackSnapshot>(() => playbackService.getState());

  useEffect(() => {
    playbackService.init(initialTracks);
    const unsubscribe = playbackService.subscribe((nextState) => {
      setSnapshot(nextState);
    });
    return unsubscribe;
  }, [initialTracks]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    playbackService.playTrack(track, newQueue);
  }, []);

  const playQueue = useCallback((tracks: Track[], startIndex: number = 0) => {
    playbackService.playQueue(tracks, startIndex);
  }, []);

  const playAlbum = useCallback((album: Album) => {
    const albumTracks = initialTracks.filter((t) => t.albumId === album.id || t.album === album.title);
    const playable = albumTracks.length > 0 ? albumTracks : [initialTracks[0]];
    playbackService.playQueue(playable, 0);
  }, [initialTracks]);

  const playPlaylist = useCallback((playlist: Playlist) => {
    const plTracks = getPlaylistTracks(playlist.id);
    playbackService.playQueue(plTracks, 0);
  }, []);

  const playAllTracks = useCallback((tracks: Track[]) => {
    if (tracks.length > 0) {
      playbackService.playQueue(tracks, 0);
    }
  }, []);

  const playSampleTrack = useCallback(() => {
    playbackService.playTrack(LICENSED_TEST_TRACK);
  }, []);

  const togglePlay = useCallback(() => {
    playbackService.togglePlay();
  }, []);

  const play = useCallback(() => {
    playbackService.play();
  }, []);

  const pause = useCallback(() => {
    playbackService.pause();
  }, []);

  const stepTrack = useCallback((delta: number) => {
    playbackService.step(delta);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playbackService.seekTo(seconds);
  }, []);

  const toggleShuffle = useCallback(() => {
    playbackService.toggleShuffle();
  }, []);

  const toggleRepeat = useCallback(() => {
    playbackService.toggleRepeat();
  }, []);

  const value = useMemo<PlayerContextType>(() => ({
    currentTrack: snapshot.currentTrack,
    currentIndex: snapshot.currentIndex,
    playing: snapshot.playing,
    progressSeconds: snapshot.progressSeconds,
    duration: snapshot.duration,
    isBuffering: snapshot.isBuffering,
    isLoaded: snapshot.isLoaded,
    shuffle: snapshot.shuffle,
    repeat: snapshot.repeat,
    repeatMode: snapshot.repeatMode,
    queue: snapshot.queue,
    hasStartedPlayback: snapshot.hasStartedPlayback,
    error: snapshot.error,

    playTrack,
    playQueue,
    playAlbum,
    playPlaylist,
    playAllTracks,
    playSampleTrack,
    togglePlay,
    play,
    pause,
    stepTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
  }), [
    snapshot,
    playTrack,
    playQueue,
    playAlbum,
    playPlaylist,
    playAllTracks,
    playSampleTrack,
    togglePlay,
    play,
    pause,
    stepTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
  ]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
