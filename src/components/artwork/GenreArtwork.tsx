import React from 'react';
import Svg, {
  Rect,
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Line,
} from 'react-native-svg';

type Props = {
  type: 'soul' | 'motown' | 'surf' | 'jazz' | 'psychedelic' | 'british';
  width?: number;
  height?: number;
};

export const GenreArtwork: React.FC<Props> = ({ type, width = 106, height = 106 }) => {
  if (type === 'soul') {
    return (
      <Svg width={width} height={height} viewBox="0 0 106 106">
        <Defs>
          {/* Burnt orange tile background */}
          <LinearGradient id="soulTileRef" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#D96332" />
            <Stop offset="100%" stopColor="#A8441A" />
          </LinearGradient>
          <RadialGradient id="soulHaloRef" cx="50%" cy="40%" r="50%">
            <Stop offset="0%" stopColor="#F7B27C" stopOpacity="0.75" />
            <Stop offset="80%" stopColor="#D96332" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#D96332" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width="106" height="106" fill="url(#soulTileRef)" />

        {/* Singer Silhouette singing passionately with head tilted up */}
        <G transform="translate(16, 8)">
          {/* Warm circular halo behind head */}
          <Circle cx="44" cy="36" r="28" fill="url(#soulHaloRef)" />

          {/* Natural Afro Hairstyle */}
          <Circle cx="42" cy="28" r="21" fill="#1C1008" />
          <Circle cx="49" cy="22" r="18" fill="#1C1008" />
          <Circle cx="35" cy="24" r="17" fill="#1C1008" />
          <Circle cx="44" cy="38" r="18" fill="#1C1008" />

          {/* Head & Neck tilted up/back singing */}
          <Path
            d="M 32 26 Q 22 30 25 38 Q 28 42 24 46 Q 30 52 30 60 Q 31 72 35 84 L 62 84 L 62 48 Z"
            fill="#1C1008"
          />

          {/* Warm Golden Edge Rim Light along forehead, nose, lips and jaw */}
          <Path
            d="M 23 32 Q 20 38 24 43 Q 22 47 25 52 Q 27 58 31 70 Q 33 78 35 84"
            stroke="#FFE2BC"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />

          {/* Ear with gold earring hoop */}
          <Circle cx="38" cy="42" r="3.5" fill="#3D2111" />
          <Circle cx="38" cy="46" r="3" stroke="#FCE18B" strokeWidth="1.2" fill="none" />
        </G>
      </Svg>
    );
  }

  if (type === 'motown') {
    return (
      <Svg width={width} height={height} viewBox="0 0 106 106">
        <Defs>
          {/* Mustard golden background matching reference */}
          <LinearGradient id="motownTileRef" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E9B23E" />
            <Stop offset="100%" stopColor="#C99026" />
          </LinearGradient>
          {/* Vinyl face sheen */}
          <LinearGradient id="motownVinylFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2A241F" />
            <Stop offset="50%" stopColor="#120F0D" />
            <Stop offset="100%" stopColor="#251F1B" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="106" height="106" fill="url(#motownTileRef)" />

        {/* Centered Vinyl LP Record */}
        <G transform="translate(53, 44)">
          {/* Vinyl Disc Body */}
          <Circle cx="0" cy="0" r="34" fill="url(#motownVinylFace)" />

          {/* Concentric Audio Grooves */}
          <Circle cx="0" cy="0" r="31" stroke="#463E36" strokeWidth="0.8" fill="none" opacity="0.75" />
          <Circle cx="0" cy="0" r="28" stroke="#362E27" strokeWidth="0.8" fill="none" opacity="0.65" />
          <Circle cx="0" cy="0" r="25" stroke="#463E36" strokeWidth="0.8" fill="none" opacity="0.75" />
          <Circle cx="0" cy="0" r="22" stroke="#362E27" strokeWidth="0.8" fill="none" opacity="0.65" />
          <Circle cx="0" cy="0" r="19" stroke="#463E36" strokeWidth="0.8" fill="none" opacity="0.75" />

          {/* Gold Center Record Label */}
          <Circle cx="0" cy="0" r="14.5" fill="#EDB848" stroke="#FDE296" strokeWidth="1.2" />
          <Circle cx="0" cy="0" r="11.5" fill="#C99326" />

          {/* Spindle Hub & Hole */}
          <Circle cx="0" cy="0" r="3.5" fill="#E9B23E" />
          <Circle cx="0" cy="0" r="2.2" fill="#120F0D" />

          {/* Specular sheen reflection across vinyl face */}
          <Path
            d="M -26 -19 Q 0 -32 26 -19 Q 15 -12 0 -16 Z"
            fill="#FFFFFF"
            opacity="0.14"
          />
          <Path
            d="M -26 19 Q 0 32 26 19 Q 15 12 0 16 Z"
            fill="#FFFFFF"
            opacity="0.14"
          />
        </G>
      </Svg>
    );
  }

  if (type === 'surf') {
    return (
      <Svg width={width} height={height} viewBox="0 0 106 106">
        <Defs>
          {/* Deep ocean turquoise gradient */}
          <LinearGradient id="surfTileRef" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#3C7774" />
            <Stop offset="60%" stopColor="#2D605D" />
            <Stop offset="100%" stopColor="#1E4442" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="106" height="106" fill="url(#surfTileRef)" />

        {/* Vintage Sun Disc in sky */}
        <Circle cx="28" cy="30" r="13" fill="#FCE5B5" opacity="0.4" />

        {/* Crashing Barrel Wave with White Foam Spray */}
        <G transform="translate(6, 32)">
          {/* Dark under-water mass */}
          <Path
            d="M 0 46 Q 35 34 68 36 L 86 48 L 0 48 Z"
            fill="#163836"
          />
          {/* Wave body */}
          <Path
            d="M 0 38 Q 28 24 52 28 Q 70 32 74 20 Q 66 12 56 15 Q 42 19 46 26 Q 30 24 0 38 Z"
            fill="#72AFA9"
          />
          {/* Crest White Foam */}
          <Path
            d="M 0 35 Q 24 20 46 24 Q 64 28 68 15 Q 64 8 52 11 Q 38 14 43 22 Q 32 20 22 27 L 0 35 Z"
            fill="#F4FCFA"
            opacity="0.95"
          />
          {/* Foam curl details */}
          <Circle cx="64" cy="18" r="3.5" fill="#F4FCFA" />
          <Circle cx="70" cy="19" r="2.5" fill="#F4FCFA" />
          <Circle cx="56" cy="13" r="2" fill="#F4FCFA" />
        </G>

        {/* Silhouette Leaning Palm Tree on Right */}
        <G transform="translate(74, 15)" opacity="0.95">
          {/* Leaning Trunk */}
          <Path d="M 14 68 Q 18 38 8 20" stroke="#102524" strokeWidth="2.8" fill="none" />
          {/* Fronds */}
          <Path d="M 8 20 Q -6 16 -12 22" stroke="#102524" strokeWidth="2.2" fill="none" />
          <Path d="M 8 20 Q 0 8 -8 6" stroke="#102524" strokeWidth="2.2" fill="none" />
          <Path d="M 8 20 Q 18 8 26 10" stroke="#102524" strokeWidth="2.2" fill="none" />
          <Path d="M 8 20 Q 24 22 28 28" stroke="#102524" strokeWidth="2.2" fill="none" />
          <Path d="M 8 20 Q 15 32 16 38" stroke="#102524" strokeWidth="2" fill="none" />
        </G>
      </Svg>
    );
  }

  if (type === 'jazz') {
    return (
      <Svg width={width} height={height} viewBox="0 0 106 106">
        <Defs>
          {/* Dark chocolate espresso background */}
          <LinearGradient id="jazzTileRef" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2E2018" />
            <Stop offset="60%" stopColor="#1E140E" />
            <Stop offset="100%" stopColor="#120A06" />
          </LinearGradient>
          {/* Brass trumpet gradient */}
          <LinearGradient id="brassTrumpetRef" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#DF9F32" />
            <Stop offset="40%" stopColor="#FFE082" />
            <Stop offset="70%" stopColor="#FFF2BD" />
            <Stop offset="100%" stopColor="#BF841E" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="106" height="106" fill="url(#jazzTileRef)" />

        {/* Golden Sound Glow Halo around Trumpet Bell */}
        <Circle cx="80" cy="34" r="26" fill="#F8C754" opacity="0.22" />
        <Circle cx="80" cy="34" r="16" fill="#FFE594" opacity="0.18" />

        {/* Golden Brass Trumpet (angled upwards to right) */}
        <G transform="translate(15, 26) rotate(-16 40 24)">
          {/* Mouthpiece */}
          <Rect x="3" y="21.5" width="7" height="4.5" rx="1" fill="url(#brassTrumpetRef)" />
          {/* Leadpipe & Body tube */}
          <Rect x="9" y="22" width="48" height="3.2" fill="url(#brassTrumpetRef)" />
          {/* Lower parallel tube */}
          <Rect x="18" y="29.5" width="35" height="3.2" fill="url(#brassTrumpetRef)" />
          {/* Tuning slide curve */}
          <Path d="M 18 23 Q 11 26.5 18 31.5" stroke="url(#brassTrumpetRef)" strokeWidth="3.2" fill="none" />

          {/* 3 Valves with tops & caps */}
          <Rect x="30" y="15" width="4" height="19" rx="1.2" fill="url(#brassTrumpetRef)" />
          <Rect x="36.5" y="15" width="4" height="19" rx="1.2" fill="url(#brassTrumpetRef)" />
          <Rect x="43" y="15" width="4" height="19" rx="1.2" fill="url(#brassTrumpetRef)" />
          {/* Valve caps */}
          <Circle cx="32" cy="14" r="2.5" fill="#FFF2BD" />
          <Circle cx="38.5" cy="14" r="2.5" fill="#FFF2BD" />
          <Circle cx="45" cy="14" r="2.5" fill="#FFF2BD" />

          {/* Flared Trumpet Bell */}
          <Path
            d="M 54 22.5 Q 68 20 74 13 L 74 33 Q 68 26.5 54 24.5 Z"
            fill="url(#brassTrumpetRef)"
          />
          {/* Bell opening rim ellipse */}
          <Path
            d="M 74 13 A 3.2 10 0 0 1 74 33 A 3.2 10 0 0 1 74 13 Z"
            fill="#B87D1B"
            stroke="#FFF2BD"
            strokeWidth="1"
          />
        </G>
      </Svg>
    );
  }

  if (type === 'psychedelic') {
    return (
      <Svg width={width} height={height} viewBox="0 0 106 106">
        <Defs>
          {/* Deep warm rust/maroon background */}
          <LinearGradient id="psychTileRef" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8C361F" />
            <Stop offset="50%" stopColor="#6E2614" />
            <Stop offset="100%" stopColor="#4A170A" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="106" height="106" fill="url(#psychTileRef)" />

        {/* 1960s Retro Flower Power Daisy */}
        <G transform="translate(53, 40)">
          {/* 8 rounded yellow petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x = 16.5 * Math.cos(angle);
            const y = 16.5 * Math.sin(angle);
            return (
              <Circle
                key={i}
                cx={x}
                cy={y}
                r="9"
                fill="#F2C553"
                stroke="#541B0D"
                strokeWidth="1.2"
              />
            );
          })}
          {/* Outer orange center ring */}
          <Circle cx="0" cy="0" r="11.5" fill="#C84820" stroke="#F2C553" strokeWidth="1.5" />
          {/* Inner core circle */}
          <Circle cx="0" cy="0" r="6.5" fill="#FFE28C" />
        </G>
      </Svg>
    );
  }

  // british
  return (
    <Svg width={width} height={height} viewBox="0 0 106 106">
      <Defs>
        {/* Dark vintage slate green background */}
        <LinearGradient id="britishTileRef" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#36544B" />
          <Stop offset="60%" stopColor="#253D36" />
          <Stop offset="100%" stopColor="#172823" />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="106" height="106" fill="url(#britishTileRef)" />

      {/* Retro Distressed Union Jack Flag Graphic in upper half */}
      <G transform="translate(13, 13)">
        {/* Flag background navy field */}
        <Rect x="0" y="0" width="80" height="48" rx="4" fill="#20333C" />

        {/* White saltire diagonals */}
        <Path d="M 0 0 L 80 48 M 80 0 L 0 48" stroke="#EAE0CC" strokeWidth="9.5" />
        {/* Red saltire diagonals */}
        <Path d="M 0 0 L 80 48 M 80 0 L 0 48" stroke="#C43424" strokeWidth="4.8" />

        {/* White St George cross */}
        <Path d="M 40 0 L 40 48 M 0 24 L 80 24" stroke="#EAE0CC" strokeWidth="13.5" />
        {/* Red St George cross */}
        <Path d="M 40 0 L 40 48 M 0 24 L 80 24" stroke="#C43424" strokeWidth="7.5" />

        {/* Border frame */}
        <Rect
          x="0"
          y="0"
          width="80"
          height="48"
          rx="4"
          stroke="#E0D2B6"
          strokeWidth="1.5"
          fill="none"
          opacity="0.75"
        />
      </G>
    </Svg>
  );
};
