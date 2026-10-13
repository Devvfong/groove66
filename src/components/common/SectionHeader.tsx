import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, typography } from '../../theme/tokens';

type Props = {
  title: string;
  actionText?: string;
  onAction?: () => void;
};

export const SectionHeader: React.FC<Props> = ({ title, actionText = 'See all', onAction }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionText && (
        <Pressable
          onPress={onAction}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={`${actionText} for ${title}`}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  title: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 18.5,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.2,
  },
  actionText: {
    fontSize: 13,
    color: colors.inkMuted,
    fontWeight: '600',
  },
});
