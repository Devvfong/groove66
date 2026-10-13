import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

type Props = {
  light?: boolean;
  size?: number;
};

export const BrandLogo: React.FC<Props> = ({ light = false, size = 26 }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.grooveText, { fontSize: size, color: light ? colors.ivoryOnWood : colors.ink }]}>
        Groove
        <Text style={[styles.numText, { fontSize: size * 0.95, color: colors.rust }]}>
          {' ’66'}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  grooveText: {
    fontFamily: typography.fontFamilySerifBlack,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  numText: {
    fontFamily: typography.fontFamilySerifBlack,
    fontWeight: '900',
  },
});
