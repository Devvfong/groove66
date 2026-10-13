import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { X, FileText } from 'lucide-react-native';
import { type Track } from '../../data/musicData';
import { colors, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  track: Track;
  onClose: () => void;
};

export const LyricsModal: React.FC<Props> = ({ visible, track, onClose }) => {
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
              <FileText size={20} color={colors.rust} strokeWidth={2.2} />
              <Text style={styles.title}>Sleeve Lyrics</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close lyrics"
              style={styles.closeBtn}
            >
              <X size={20} color={colors.inkMuted} />
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.songTitle}>{track.title}</Text>
            <Text style={styles.songArtist}>
              {track.artist}  •  {track.album} ({track.year})
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Lyrics Content */}
          <ScrollView
            style={styles.lyricsScroll}
            showsVerticalScrollIndicator={false}
          >
            {track.lyrics && track.lyrics.length > 0 ? (
              <View style={styles.lyricsContainer}>
                {track.lyrics.map((line, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.lyricsLine,
                      line === '' && styles.lyricsSpace,
                    ]}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Lyrics not available for this recording.
                </Text>
              </View>
            )}

            <View style={styles.sleeveFooter}>
              <Text style={styles.sleeveFooterText}>
                Printed for Groove '66 Hi-Fi Audio Club • All Rights Reserved
              </Text>
            </View>
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
    paddingHorizontal: 22,
    paddingBottom: 36,
    maxHeight: '80%',
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
  closeBtn: {
    padding: 6,
  },
  metaRow: {
    marginTop: 6,
    gap: 2,
  },
  songTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  songArtist: {
    fontSize: 12.5,
    color: colors.inkMuted,
  },
  divider: {
    height: 1,
    backgroundColor: '#DFD3BD',
    marginVertical: 14,
  },
  lyricsScroll: {
    maxHeight: 400,
  },
  lyricsContainer: {
    paddingVertical: 6,
  },
  lyricsLine: {
    fontFamily: typography.fontFamilySerifRegular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.ink,
    textAlign: 'center',
  },
  lyricsSpace: {
    height: 16,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.inkMuted,
  },
  sleeveFooter: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E6DCBF',
    alignItems: 'center',
  },
  sleeveFooterText: {
    fontSize: 10.5,
    color: '#9E917D',
    letterSpacing: 0.4,
  },
});
