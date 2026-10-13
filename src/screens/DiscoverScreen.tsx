import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Settings } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme/tokens';
import { BrandLogo } from '../components/common/BrandLogo';
import { SunburstIcon } from '../components/common/SunburstIcon';
import { SectionHeader } from '../components/common/SectionHeader';
import { JukeboxHero } from '../components/hero/JukeboxHero';
import { PlaylistCard } from '../components/cards/PlaylistCard';
import { GenreTile } from '../components/cards/GenreTile';
import { PLAYLISTS, GENRES, type GenreName } from '../data/musicData';

type Props = {
  onOpenPlayer: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  onSelectGenre: (genre: GenreName) => void;
  onOpenSettings: () => void;
};

export const DiscoverScreen: React.FC<Props> = ({
  onOpenPlayer,
  onSelectPlaylist,
  onSelectGenre,
  onOpenSettings,
}) => {
  const { width } = useWindowDimensions();

  // Responsive calculations for 360dp, 393dp, 412dp
  const horizontalPadding = 20;
  const availableWidth = width - horizontalPadding * 2;

  // 3 Playlist cards across available width with 10dp gaps
  const playlistGap = 10;
  const playlistCardWidth = Math.max(98, Math.min(120, (availableWidth - playlistGap * 2) / 3));
  const playlistCardHeight = Math.round(playlistCardWidth * 1.15);

  // 3 Genre columns across available width with 10dp gaps
  const genreGap = 10;
  const genreTileWidth = Math.max(98, Math.min(120, (availableWidth - genreGap * 2) / 3));
  const genreTileHeight = Math.round(genreTileWidth * 1.02);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: horizontalPadding }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Brand Wordmark & Settings Action */}
      <View style={styles.topHeader}>
        <BrandLogo size={28} />
        <Pressable
          onPress={onOpenSettings}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          style={({ pressed }) => [styles.settingsButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Settings size={22} color={colors.ink} strokeWidth={1.8} />
        </Pressable>
      </View>

      {/* 2. Headline Greeting & Sunburst Icon */}
      <View style={styles.greetingSection}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingTitle}>Good to see you</Text>
          <Text style={styles.greetingSubtitle}>Same songs. A brighter tomorrow.</Text>
        </View>
        <View style={styles.sunburstWrapper}>
          <SunburstIcon size={40} color={colors.tangerine} />
        </View>
      </View>

      {/* 3. Illustrated Jukebox Hero Card */}
      <View style={styles.heroSection}>
        <JukeboxHero onPress={onOpenPlayer} />
      </View>

      {/* 4. Featured Playlists Section */}
      <View style={styles.sectionContainer}>
        <SectionHeader
          title="Featured Playlists"
          actionText="See all"
          onAction={() => onSelectPlaylist(PLAYLISTS[0].id)}
        />
        <View style={[styles.playlistRow, { gap: playlistGap }]}>
          {PLAYLISTS.map((item) => (
            <PlaylistCard
              key={item.id}
              playlist={item}
              width={playlistCardWidth}
              height={playlistCardHeight}
              onPress={() => onSelectPlaylist(item.id)}
            />
          ))}
        </View>
      </View>

      {/* 5. Genres Grid (2 rows x 3 columns) */}
      <View style={styles.sectionContainer}>
        <SectionHeader
          title="Genres"
          actionText="See all"
          onAction={() => onSelectGenre('Soul')}
        />
        <View style={[styles.genreGrid, { gap: genreGap }]}>
          {GENRES.map((item) => (
            <GenreTile
              key={item.id}
              genre={item}
              width={genreTileWidth}
              height={genreTileHeight}
              onPress={() => onSelectGenre(item.name)}
            />
          ))}
        </View>
      </View>

      {/* Extra space at bottom so bottom bar doesn't obscure content */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 16,
  },
  greetingTextContainer: {
    flex: 1,
    gap: 4,
  },
  greetingTitle: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 27,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontSize: 13.5,
    color: colors.inkMuted,
    fontWeight: '500',
  },
  sunburstWrapper: {
    marginLeft: 12,
    marginTop: 4,
  },
  heroSection: {
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  playlistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
