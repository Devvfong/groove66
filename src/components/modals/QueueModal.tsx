import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { X, Disc3, Play } from 'lucide-react-native';
import { AlbumCoverArtwork } from '../artwork/AlbumCoverArtwork';
import { TRACKS, type Track } from '../../data/musicData';
import { colors, radius, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  currentTrackId: string;
  onClose: () => void;
  onSelectTrack: (track: Track) => void;
};

export const QueueModal: React.FC<Props> = ({
  visible,
  currentTrackId,
  onClose,
  onSelectTrack,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Disc3 size={20} color={colors.rust} strokeWidth={2.2} />
              <Text style={styles.title}>Turntable Queue</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close queue"
              style={styles.closeBtn}
            >
              <X size={20} color={colors.inkMuted} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Up next in your 1960s vinyl rotation
          </Text>

          <View style={styles.divider} />

          {/* Queue List */}
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {TRACKS.map((t, index) => {
              const isCurrent = t.id === currentTrackId;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => {
                    onSelectTrack(t);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.trackRow,
                    isCurrent && styles.trackRowActive,
                    { opacity: pressed ? 0.75 : 1 },
                  ]}
                >
                  <Text style={styles.indexNum}>{index + 1}</Text>

                  <View style={styles.coverThumb}>
                    <AlbumCoverArtwork coverType={t.coverType} size={42} />
                  </View>

                  <View style={styles.meta}>
                    <Text
                      numberOfLines={1}
                      style={[styles.trackTitle, isCurrent && styles.trackTitleActive]}
                    >
                      {t.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.trackArtist}>
                      {t.artist} • {t.durationFormatted}
                    </Text>
                  </View>

                  {isCurrent ? (
                    <View style={styles.spinningBadge}>
                      <Text style={styles.spinningText}>SPINNING</Text>
                    </View>
                  ) : (
                    <Play size={16} color={colors.inkMuted} style={styles.playIcon} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 10, 6, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.inkMuted,
    marginTop: 3,
  },
  closeBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#DFD3BD',
    marginVertical: 14,
  },
  list: {
    maxHeight: 380,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  trackRowActive: {
    backgroundColor: '#ECE2CC',
  },
  indexNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkMuted,
    width: 20,
  },
  coverThumb: {
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 10,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  trackTitleActive: {
    color: colors.rust,
    fontWeight: '800',
  },
  trackArtist: {
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  spinningBadge: {
    backgroundColor: colors.rust,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  spinningText: {
    color: '#FFF8EA',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  playIcon: {
    marginLeft: 6,
  },
});
