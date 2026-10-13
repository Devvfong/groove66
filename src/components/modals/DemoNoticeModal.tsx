import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { Disc3, FolderPlus, Play, X } from 'lucide-react-native';
import { colors, radius, typography } from '../../theme/tokens';
import { type Track } from '../../data/musicData';

type Props = {
  visible: boolean;
  track: Track | null;
  onClose: () => void;
  onImportAudio: () => void;
  onPlaySample: () => void;
};

export const DemoNoticeModal: React.FC<Props> = ({
  visible,
  track,
  onClose,
  onImportAudio,
  onPlaySample,
}) => {
  if (!track) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Close Button */}
              <Pressable
                onPress={onClose}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close demo notice"
                style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
              >
                <X size={20} color={colors.inkMuted} />
              </Pressable>

              {/* Vintage Vinyl Icon Badge */}
              <View style={styles.iconCircle}>
                <Disc3 size={32} color={colors.rust} />
              </View>

              {/* Title & Track Details */}
              <Text style={styles.title}>1960s Demo Recording</Text>
              <Text style={styles.trackSubtitle}>
                "{track.title}" • {track.artist}
              </Text>

              {/* Explanatory Body */}
              <Text style={styles.bodyText}>
                This catalog entry is an illustrative reference without a bundled audio recording to respect copyright and fair use.
              </Text>
              <Text style={styles.bodyHighlight}>
                Import your own offline MP3, M4A, or WAV files to spin them on the turntable, or listen to the licensed 1960s studio test track!
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <Pressable
                  onPress={() => {
                    onClose();
                    onImportAudio();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Import audio file"
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                >
                  <FolderPlus size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryBtnText}>Import Audio File</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    onClose();
                    onPlaySample();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Play licensed studio test track"
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                >
                  <Play size={16} color={colors.ink} fill={colors.ink} style={{ marginRight: 8 }} />
                  <Text style={styles.secondaryBtnText}>Spin Licensed Test Groove</Text>
                </Pressable>

                <Pressable
                  onPress={onClose}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss notice"
                  style={({ pressed }) => [styles.dismissBtn, { opacity: pressed ? 0.6 : 1 }]}
                >
                  <Text style={styles.dismissBtnText}>Dismiss</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 16, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.paper,
    borderRadius: radius.card + 4,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(213, 102, 55, 0.25)',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(213, 102, 55, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(213, 102, 55, 0.3)',
  },
  title: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 6,
  },
  trackSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.rust,
    textAlign: 'center',
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.inkMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  bodyHighlight: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: colors.rust,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    minHeight: 46,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    backgroundColor: '#E6D9C5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(58, 42, 34, 0.15)',
    minHeight: 44,
  },
  secondaryBtnText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  dismissBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  dismissBtnText: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '500',
  },
});
