import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Rect, Path, G } from 'react-native-svg';
import { Heart, Search } from 'lucide-react-native';
import { colors, spacing } from '../../theme/tokens';

export type TabKey = 'discover' | 'records' | 'favorites' | 'search';

type Props = {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  bottomInset?: number;
};

// Custom SVG Disc Icon for Discover tab (matching reference)
const DiscoverIcon = ({ active }: { active: boolean }) => {
  if (active) {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24">
        {/* Filled dark vinyl disc */}
        <Circle cx="12" cy="12" r="10" fill={colors.ink} />
        {/* Subtle inner groove ring */}
        <Circle cx="12" cy="12" r="7.5" stroke="#4A382A" strokeWidth="1" fill="none" />
        {/* Gold center spindle hub */}
        <Circle cx="12" cy="12" r="3" fill={colors.mustard} />
        <Circle cx="12" cy="12" r="1.2" fill={colors.ink} />
      </Svg>
    );
  }
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" stroke={colors.inkMuted} strokeWidth="1.8" fill="none" />
      <Circle cx="12" cy="12" r="5" stroke={colors.inkMuted} strokeWidth="1.2" fill="none" opacity="0.6" />
      <Circle cx="12" cy="12" r="2.2" stroke={colors.inkMuted} strokeWidth="1.5" fill="none" />
    </Svg>
  );
};

// Custom SVG Records Icon (sleeve with protruding disc)
const RecordsIcon = ({ active }: { active: boolean }) => {
  const strokeColor = active ? colors.ink : colors.inkMuted;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      {/* Vinyl disc peeking out behind sleeve */}
      <Circle cx="14" cy="12" r="7" stroke={strokeColor} strokeWidth="1.5" fill={active ? '#2C1F16' : 'none'} />
      {active && <Circle cx="14" cy="12" r="2.5" fill={colors.mustard} />}
      {/* Square sleeve */}
      <Rect
        x="3"
        y="5"
        width="14"
        height="14"
        rx="2"
        fill={colors.paper}
        stroke={strokeColor}
        strokeWidth={1.8}
      />
      {/* Sleeve spine line */}
      <Path d="M 6 7 L 6 17" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
    </Svg>
  );
};

export const RetroBottomBar: React.FC<Props> = ({ activeTab, onSelectTab, bottomInset = 0 }) => {
  const tabs: { key: TabKey; label: string; renderIcon: (active: boolean) => React.ReactNode }[] = [
    {
      key: 'discover',
      label: 'Discover',
      renderIcon: (active) => <DiscoverIcon active={active} />,
    },
    {
      key: 'records',
      label: 'Records',
      renderIcon: (active) => <RecordsIcon active={active} />,
    },
    {
      key: 'favorites',
      label: 'Favorites',
      renderIcon: (active) => (
        <Heart
          size={23}
          color={active ? colors.rust : colors.inkMuted}
          fill={active ? colors.rust : 'none'}
          strokeWidth={active ? 2.2 : 1.8}
        />
      ),
    },
    {
      key: 'search',
      label: 'Search',
      renderIcon: (active) => (
        <Search
          size={23}
          color={active ? colors.ink : colors.inkMuted}
          strokeWidth={active ? 2.4 : 1.8}
        />
      ),
    },
  ];

  return (
    <View style={[styles.barContainer, { paddingBottom: Math.max(bottomInset, 10) }]}>
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectTab(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              style={({ pressed }) => [
                styles.tabItem,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.iconWrapper}>{tab.renderIcon(isActive)}</View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? (tab.key === 'favorites' ? colors.rust : colors.ink) : colors.inkMuted,
                    fontWeight: isActive ? '800' : '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: 8,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 52,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },
  iconWrapper: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 3,
    letterSpacing: 0.1,
  },
});
