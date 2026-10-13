import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Play, Heart, ListMusic, X, Disc3, Trash2 } from 'lucide-react-native';
import { AlbumCoverArtwork } from '../artwork/AlbumCoverArtwork';
import { type Album } from '../../data/musicData';
import { colors, radius, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  album: Album | null;
  isFavorited: boolean;
  onClose: () => void;
  onPlay: (album: Album) => void;
  onToggleFavorite: (album: Album) => void;
  onDelete?: (album: Album) => void;
};

export const AlbumActionModal: React.FC<Props> = ({
  visible,
  album,
  isFavorited,
  onClose,
  onPlay,
  onToggleFavorite,
  onDelete,
}) => {
  if (!album) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
          {/* Header with mini cover and album meta */}
          <View style={styles.headerRow}>
            <View style={styles.coverThumbnail}>
              <AlbumCoverArtwork coverType={album.coverType} size={56} />
            </View>
            <View style={styles.metaContainer}>
              <Text numberOfLines={1} style={styles.albumTitle}>
                {album.title}
              </Text>
              <Text numberOfLines={1} style={styles.artistName}>
                {album.artist}
              </Text>
              <Text style={styles.yearGenre}>
                {album.year}  •  {album.displayGenre || album.genre}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
              <X size={20} color={colors.inkMuted} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          {/* Action List */}
          <View style={styles.actionsList}>
            {/* 1. Spin Record */}
            <Pressable
              onPress={() => {
                onClose();
                onPlay(album);
              }}
              style={({ pressed }) => [
                styles.actionItem,
                { opacity: pressed ? 0.75 : 1, backgroundColor: pressed ? '#EFE6D2' : 'transparent' },
              ]}
            >
              <View style={styles.actionIconWrapper}>
                <Disc3 size={20} color={colors.rust} strokeWidth={2} />
              </View>
              <Text style={styles.actionText}>Spin on Turntable</Text>
            </Pressable>

            {/* 2. Add / Remove from Favorites */}
            <Pressable
              onPress={() => onToggleFavorite(album)}
              style={({ pressed }) => [
                styles.actionItem,
                { opacity: pressed ? 0.75 : 1, backgroundColor: pressed ? '#EFE6D2' : 'transparent' },
              ]}
            >
              <View style={styles.actionIconWrapper}>
                <Heart
                  size={20}
                  color={isFavorited ? colors.rust : colors.ink}
                  fill={isFavorited ? colors.rust : 'none'}
                  strokeWidth={2}
                />
              </View>
              <Text style={[styles.actionText, isFavorited && { color: colors.rust, fontWeight: '800' }]}>
                {isFavorited ? 'Saved in Favorites' : 'Save to Favorites'}
              </Text>
            </Pressable>

            {/* 3. View Tracklist */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.actionItem,
                { opacity: pressed ? 0.75 : 1, backgroundColor: pressed ? '#EFE6D2' : 'transparent' },
              ]}
            >
              <View style={styles.actionIconWrapper}>
                <ListMusic size={20} color={colors.ink} strokeWidth={2} />
              </View>
              <Text style={styles.actionText}>View Album Tracklist</Text>
            </Pressable>

            {/* 4. Remove from Crate (if imported) */}
            {Boolean(onDelete) && (
              <Pressable
                onPress={() => {
                  onClose();
                  if (album && onDelete) onDelete(album);
                }}
                style={({ pressed }) => [
                  styles.actionItem,
                  { opacity: pressed ? 0.75 : 1, backgroundColor: pressed ? '#F7E6E2' : 'transparent' },
                ]}
              >
                <View style={styles.actionIconWrapper}>
                  <Trash2 size={20} color="#BA3C2A" strokeWidth={2} />
                </View>
                <Text style={[styles.actionText, { color: '#BA3C2A', fontWeight: '700' }]}>
                  Remove from Crate
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 17, 10, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#F8F1DE', // Warm cream paper sheet
    borderRadius: radius.card + 4,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#DFD5BD',
    shadowColor: '#1A1009',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverThumbnail: {
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#2C1E15',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  metaContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 3,
  },
  albumTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 15.5,
    fontWeight: '900',
    color: colors.ink,
  },
  artistName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  yearGenre: {
    fontSize: 11.5,
    color: colors.inkMuted,
    marginTop: 1,
  },
  closeButton: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6DCC5',
    marginVertical: 14,
  },
  actionsList: {
    gap: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: radius.md,
  },
  actionIconWrapper: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.1,
  },
});
