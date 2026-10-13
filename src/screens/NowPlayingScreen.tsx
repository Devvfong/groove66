import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {
  ChevronDown,
  Cast,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat2,
  FileText,
  ListMusic,
  Tv2,
} from 'lucide-react-native';
import { colors, typography } from '../theme/tokens';
import { BrandLogo } from '../components/common/BrandLogo';
import { TurntableDeck } from '../components/player/TurntableDeck';
import { Tonearm } from '../components/player/Tonearm';
import { MetalKnob, StereoBadge } from '../components/player/DeckDetails';
import { WoodCabinetBackground } from '../components/player/WoodCabinetBackground';
import { QueueModal } from '../components/modals/QueueModal';
import { LyricsModal } from '../components/modals/LyricsModal';
import { DevicesModal } from '../components/modals/DevicesModal';
import { formatTime, type Track } from '../data/musicData';

type Props = {
  track: Track;
  playing: boolean;
  progressSeconds: number;
  duration?: number;
  liked: boolean;
  shuffle: boolean;
  repeat: boolean;
  repeatMode?: 'off' | 'all' | 'one';
  onBack: () => void;
  onTogglePlay: () => void;
  onStepTrack: (delta: number) => void;
  onToggleLike: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSeek: (seconds: number) => void;
  onSelectTrack?: (track: Track) => void;
};

export const NowPlayingScreen: React.FC<Props> = ({
  track,
  playing,
  progressSeconds,
  duration,
  liked,
  shuffle,
  repeat,
  repeatMode,
  onBack,
  onTogglePlay,
  onStepTrack,
  onToggleLike,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onSelectTrack,
}) => {
  const { width, height } = useWindowDimensions();

  // Responsive sizing for 360, 393, 412dp viewports
  // vinylSize scales to occupy the primary visual upper portion matching 04-now-playing-reference
  const vinylSize = Math.max(250, Math.min(width - 80, 304));
  const totalDuration = duration || track.duration || 8;
  const progressRatio = Math.min(1, Math.max(0, totalDuration > 0 ? progressSeconds / totalDuration : 0));

  // Interactive utility sheets
  const [showQueue, setShowQueue] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      return window.location.hash.toLowerCase().includes('queue');
    }
    return false;
  });
  const [showLyrics, setShowLyrics] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      return window.location.hash.toLowerCase().includes('lyrics');
    }
    return false;
  });
  const [showDevices, setShowDevices] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      return window.location.hash.toLowerCase().includes('device');
    }
    return false;
  });

  // Listen to hash changes for automated QA captures
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h.includes('queue')) {
        setShowQueue(true);
        setShowLyrics(false);
        setShowDevices(false);
      } else if (h.includes('lyrics')) {
        setShowLyrics(true);
        setShowQueue(false);
        setShowDevices(false);
      } else if (h.includes('device')) {
        setShowDevices(true);
        setShowQueue(false);
        setShowLyrics(false);
      } else {
        setShowQueue(false);
        setShowLyrics(false);
        setShowDevices(false);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectQueuedTrack = useCallback(
    (t: Track) => {
      onSelectTrack?.(t);
      setShowQueue(false);
    },
    [onSelectTrack]
  );

  return (
    <View style={styles.fullScreen}>
      {/* 1. Rich Dark Walnut Cabinet Wood Surface */}
      <WoodCabinetBackground width={width} height={height} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* 2. Top Navigation Bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel="Close player"
            style={styles.backButton}
          >
            <ChevronDown size={28} color={colors.ivoryOnWood} strokeWidth={2} />
          </Pressable>

          <BrandLogo light={true} size={25} />

          <Pressable
            onPress={() => setShowDevices(true)}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel="Audio output and devices"
            style={styles.castButton}
          >
            <Cast size={21} color={colors.ivoryOnWood} strokeWidth={1.8} />
          </Pressable>
        </View>

        {/* 3. Turntable Deck Area */}
        <View style={[styles.deckContainer, { height: vinylSize + 28 }]}>
          {/* Deck Top Details: Metal Volume/Tone Knob (Left) and STEREO Badge (Right) */}
          <View style={styles.deckTopDetails}>
            <MetalKnob size={36} />
            <StereoBadge />
          </View>

          {/* Center Turntable Platter & Grooved Vinyl Disc */}
          <View style={styles.deckCenter}>
            <TurntableDeck track={track} playing={playing} size={vinylSize} />
          </View>

          {/* Tonearm Assembly extending from upper-right down onto the vinyl grooves */}
          <Tonearm
            width={Math.round(vinylSize * 0.44)}
            height={vinylSize + 22}
            playing={playing}
          />
        </View>

        {/* 4. Song Metadata: Title, Artist, and Filled Rust Heart */}
        <View style={styles.metaRow}>
          <View style={styles.metaTextContainer}>
            <Text numberOfLines={1} style={styles.songTitle}>
              {track.title}
            </Text>
            <Text numberOfLines={1} style={styles.artistName}>
              {track.artist}
            </Text>
          </View>

          <Pressable
            onPress={onToggleLike}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Remove from favorites' : 'Add to favorites'}
            style={({ pressed }) => [
              styles.heartButton,
              { transform: [{ scale: pressed ? 1.2 : 1 }], opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Heart
              size={25}
              color={liked ? colors.rust : '#C8BA9F'}
              fill={liked ? colors.rust : 'none'}
              strokeWidth={liked ? 2.4 : 1.8}
            />
          </Pressable>
        </View>

        {/* 5. Mustard Progress Slider & Timestamps */}
        <View style={styles.progressSection}>
          <Pressable
            accessibilityRole="adjustable"
            accessibilityLabel="Playback progress"
            hitSlop={12}
            onPress={(e) => {
              const targetRatio = Math.max(0, Math.min(1, e.nativeEvent.locationX / (width - 44)));
              onSeek(Math.round(targetRatio * totalDuration));
            }}
            style={styles.seekBarTrack}
          >
            <View style={styles.seekBarBg}>
              <View
                style={[
                  styles.seekBarFill,
                  { width: `${progressRatio * 100}%` },
                ]}
              />
            </View>
            <View
              style={[
                styles.seekThumb,
                { left: `${progressRatio * 100}%` },
              ]}
            />
          </Pressable>

          <View style={styles.timestampRow}>
            <Text style={styles.timestampText}>{formatTime(progressSeconds)}</Text>
            <Text style={styles.timestampText}>{formatTime(totalDuration)}</Text>
          </View>
        </View>

        {/* 6. Main Transport Controls */}
        <View style={styles.controlsRow}>
          <Pressable
            onPress={onToggleShuffle}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Shuffle ${shuffle ? 'on' : 'off'}`}
            style={styles.controlSecondary}
          >
            <Shuffle
              size={21}
              color={shuffle ? colors.rust : '#C8BA9F'}
              strokeWidth={2}
            />
          </Pressable>

          <Pressable
            onPress={() => onStepTrack(-1)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Previous track"
            style={styles.controlSecondary}
          >
            <SkipBack size={26} color="#F7E8C9" fill="#F7E8C9" />
          </Pressable>

          {/* Large 68dp Rust-Orange Play/Pause Circular Button */}
          <Pressable
            onPress={onTogglePlay}
            accessibilityRole="button"
            accessibilityLabel={playing ? 'Pause' : 'Play'}
            style={({ pressed }) => [
              styles.playButton,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
            ]}
          >
            {playing ? (
              <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={28} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
            )}
          </Pressable>

          <Pressable
            onPress={() => onStepTrack(1)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Next track"
            style={styles.controlSecondary}
          >
            <SkipForward size={26} color="#F7E8C9" fill="#F7E8C9" />
          </Pressable>

          <Pressable
            onPress={onToggleRepeat}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Repeat ${repeatMode ? repeatMode : (repeat ? 'on' : 'off')}`}
            style={styles.controlSecondary}
          >
            <Repeat2
              size={21}
              color={repeat ? colors.rust : '#C8BA9F'}
              strokeWidth={2}
            />
            {repeatMode === 'one' && (
              <Text
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -4,
                  fontSize: 10,
                  fontWeight: '800',
                  color: colors.rust,
                }}
              >
                1
              </Text>
            )}
          </Pressable>
        </View>

        {/* 7. Utility Bar: Lyrics | Queue | Devices */}
        <View style={styles.utilityBar}>
          <Pressable
            onPress={() => setShowLyrics(true)}
            accessibilityRole="button"
            accessibilityLabel="View sleeve lyrics"
            style={styles.utilityItem}
          >
            <FileText size={19} color="#C8BA9F" strokeWidth={1.8} />
            <Text style={styles.utilityLabel}>Lyrics</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowQueue(true)}
            accessibilityRole="button"
            accessibilityLabel="View track queue"
            style={styles.utilityItem}
          >
            <ListMusic size={19} color="#C8BA9F" strokeWidth={1.8} />
            <Text style={styles.utilityLabel}>Queue</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowDevices(true)}
            accessibilityRole="button"
            accessibilityLabel="Audio output devices"
            style={styles.utilityItem}
          >
            <Tv2 size={19} color="#C8BA9F" strokeWidth={1.8} />
            <Text style={styles.utilityLabel}>Devices</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Interactive Modal Sheets */}
      <QueueModal
        visible={showQueue}
        currentTrackId={track.id}
        onClose={() => setShowQueue(false)}
        onSelectTrack={handleSelectQueuedTrack}
      />

      <LyricsModal
        visible={showLyrics}
        track={track}
        onClose={() => setShowLyrics(false)}
      />

      <DevicesModal
        visible={showDevices}
        onClose={() => setShowDevices(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 22,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  castButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deckContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 2,
    marginBottom: 8,
  },
  deckTopDetails: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5,
  },
  deckCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  metaTextContainer: {
    flex: 1,
    gap: 4,
  },
  songTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 25,
    fontWeight: '900',
    color: colors.ivoryOnWood,
    letterSpacing: -0.3,
  },
  artistName: {
    fontSize: 14.5,
    color: '#D8C8AA',
    fontWeight: '500',
  },
  heartButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginBottom: 20,
  },
  seekBarTrack: {
    height: 24,
    justifyContent: 'center',
    position: 'relative',
  },
  seekBarBg: {
    height: 3.5,
    backgroundColor: '#4A2A17',
    borderRadius: 2,
    overflow: 'hidden',
  },
  seekBarFill: {
    height: '100%',
    backgroundColor: colors.mustard,
    borderRadius: 2,
  },
  seekThumb: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#FFF8E7',
    borderWidth: 2,
    borderColor: colors.mustard,
    marginLeft: -6.5,
    top: 5.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.45,
    shadowRadius: 2.5,
    elevation: 4,
  },
  timestampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timestampText: {
    fontSize: 12,
    color: '#C8BA9F',
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 22,
  },
  controlSecondary: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.rust,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 7,
  },
  utilityBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(216, 186, 148, 0.15)',
    paddingTop: 14,
    paddingBottom: 6,
  },
  utilityItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 56,
    minHeight: 44,
  },
  utilityLabel: {
    fontSize: 11,
    color: '#C8BA9F',
    fontWeight: '500',
  },
});
