import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { AlbumCoverArtwork } from './AlbumCoverArtwork';
import { type Album } from '../../data/musicData';

type Props = {
  coverType: Album['coverType'];
  labelColor?: string;
  size?: number; // size of sleeve, default 76
};

export const ExposedVinyl: React.FC<Props> = ({
  coverType,
  labelColor = '#D86F3C',
  size = 76,
}) => {
  const discDiameter = size * 0.94;
  const protrusion = size * 0.36; // disc peeking out by 36%
  const totalWidth = size + protrusion;

  return (
    <View style={[styles.container, { width: totalWidth, height: size }]}>
      {/* Vinyl Disc - positioned behind sleeve but extending right */}
      <View
        style={[
          styles.vinylDisc,
          {
            left: protrusion,
            width: discDiameter,
            height: discDiameter,
            top: (size - discDiameter) / 2,
          },
        ]}
      >
        <Svg width={discDiameter} height={discDiameter} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="vinylBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#25211E" />
              <Stop offset="50%" stopColor="#12100E" />
              <Stop offset="100%" stopColor="#221E1B" />
            </LinearGradient>
          </Defs>
          {/* Main Disc */}
          <Circle cx="50" cy="50" r="49" fill="url(#vinylBody)" />
          {/* Concentric Grooves */}
          <Circle cx="50" cy="50" r="45" stroke="#3D3732" strokeWidth="0.8" fill="none" opacity="0.65" />
          <Circle cx="50" cy="50" r="41" stroke="#312B26" strokeWidth="0.8" fill="none" opacity="0.55" />
          <Circle cx="50" cy="50" r="37" stroke="#3D3732" strokeWidth="0.8" fill="none" opacity="0.65" />
          <Circle cx="50" cy="50" r="33" stroke="#312B26" strokeWidth="0.8" fill="none" opacity="0.55" />
          <Circle cx="50" cy="50" r="29" stroke="#3D3732" strokeWidth="0.8" fill="none" opacity="0.65" />

          {/* Center Record Label */}
          <Circle cx="50" cy="50" r="18" fill={labelColor} stroke="#EAC47B" strokeWidth="1" />
          <Circle cx="50" cy="50" r="15" fill={labelColor} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
          {/* Spindle hole */}
          <Circle cx="50" cy="50" r="3.5" fill="#12100E" />

          {/* Specular sheen reflection on vinyl */}
          <Path
            d="M 15 25 Q 50 10 85 25 Q 70 35 50 30 Q 30 35 15 25 Z"
            fill="#FFFFFF"
            opacity="0.08"
          />
        </Svg>
      </View>

      {/* Front Album Sleeve Card */}
      <View style={[styles.sleeveWrapper, { width: size, height: size }]}>
        <AlbumCoverArtwork coverType={coverType} size={size} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  vinylDisc: {
    position: 'absolute',
    zIndex: 1,
  },
  sleeveWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#1A120D',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
  },
});
