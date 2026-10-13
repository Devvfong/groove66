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
  type: 'summer' | 'soul' | 'roadtrip';
  width?: number;
  height?: number;
};

export const PlaylistArtwork: React.FC<Props> = ({ type, width = 110, height = 120 }) => {
  if (type === 'summer') {
    return (
      <Svg width={width} height={height} viewBox="0 0 110 120">
        <Defs>
          {/* Sunset sky gradient matching reference */}
          <LinearGradient id="summerSkyRef" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#3C7E8A" />
            <Stop offset="30%" stopColor="#6CA6B0" />
            <Stop offset="55%" stopColor="#E29452" />
            <Stop offset="75%" stopColor="#F2BA5A" />
            <Stop offset="100%" stopColor="#A8572C" />
          </LinearGradient>
          {/* Van body gradient */}
          <LinearGradient id="vanTurquoise" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#417D87" />
            <Stop offset="50%" stopColor="#5E9EA8" />
            <Stop offset="100%" stopColor="#3C737C" />
          </LinearGradient>
          {/* Sandy foreground glow */}
          <LinearGradient id="sandGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#B66B3F" />
            <Stop offset="100%" stopColor="#69341B" />
          </LinearGradient>
        </Defs>

        {/* Sky */}
        <Rect x="0" y="0" width="110" height="120" fill="url(#summerSkyRef)" />

        {/* Setting Golden Sun */}
        <Circle cx="44" cy="62" r="19" fill="#FFF4CA" opacity="0.9" />
        <Circle cx="44" cy="62" r="28" fill="#FCE18A" opacity="0.25" />

        {/* Distant Sea Horizon with Golden Sun Reflection */}
        <Rect x="0" y="68" width="110" height="14" fill="#C87A46" opacity="0.45" />
        <Rect x="25" y="70" width="38" height="10" fill="#FFEAA8" opacity="0.35" />

        {/* Coastal Highway & Dune */}
        <Path d="M 0 79 Q 55 74 110 81 L 110 120 L 0 120 Z" fill="url(#sandGlow)" />
        <Path d="M 0 85 Q 55 80 110 87 L 110 120 L 0 120 Z" fill="#522915" />

        {/* Feathery Silhouette Palm Trees on Left */}
        <G opacity="0.95">
          {/* Main Tall Palm Trunk */}
          <Path d="M 12 110 Q 16 68 8 38" stroke="#1E120A" strokeWidth="3" fill="none" />
          {/* Palm Fronds */}
          <Path d="M 8 38 Q -6 34 -14 42" stroke="#1E120A" strokeWidth="2.2" fill="none" />
          <Path d="M 8 38 Q -2 22 -10 20" stroke="#1E120A" strokeWidth="2.2" fill="none" />
          <Path d="M 8 38 Q 10 18 6 14" stroke="#1E120A" strokeWidth="2" fill="none" />
          <Path d="M 8 38 Q 22 24 30 26" stroke="#1E120A" strokeWidth="2.2" fill="none" />
          <Path d="M 8 38 Q 28 38 34 46" stroke="#1E120A" strokeWidth="2.2" fill="none" />
          <Path d="M 8 38 Q 18 52 20 60" stroke="#1E120A" strokeWidth="2" fill="none" />

          {/* Secondary Palm Trunk */}
          <Path d="M 24 115 Q 28 80 24 54" stroke="#1E120A" strokeWidth="2.2" fill="none" />
          <Path d="M 24 54 Q 12 44 6 48" stroke="#1E120A" strokeWidth="1.8" fill="none" />
          <Path d="M 24 54 Q 34 42 42 48" stroke="#1E120A" strokeWidth="1.8" fill="none" />
          <Path d="M 24 54 Q 28 36 26 32" stroke="#1E120A" strokeWidth="1.8" fill="none" />
        </G>

        {/* Vintage Turquoise & Cream VW Camper Van */}
        <G transform="translate(45, 58)">
          {/* Van Cream Roof & Upper Half */}
          <Path
            d="M 6 12 Q 22 7 42 7 Q 48 7 50 14 L 50 20 L 4 20 Q 4 14 6 12 Z"
            fill="#FFF6E0"
          />
          {/* Split Windshield Glass */}
          <Rect x="8" y="14" width="18" height="9" rx="1.5" fill="#243C42" />
          <Rect x="28" y="14" width="18" height="9" rx="1.5" fill="#243C42" />
          <Line x1="27" y1="14" x2="27" y2="23" stroke="#FFF6E0" strokeWidth="2" />

          {/* Turquoise Lower Body */}
          <Path
            d="M 4 24 L 50 24 Q 52 26 52 36 L 2 36 Q 2 26 4 24 Z"
            fill="url(#vanTurquoise)"
          />

          {/* Front V-Line Cream Stripe on front */}
          <Path d="M 4 24 L 27 34 L 50 24" stroke="#FFF6E0" strokeWidth="2.2" fill="none" />

          {/* Chrome VW Emblem */}
          <Circle cx="27" cy="30" r="4.5" fill="#FFF6E0" stroke="#335960" strokeWidth="1" />
          <Circle cx="27" cy="30" r="2.8" fill="#335960" />

          {/* Headlights with yellow glow */}
          <Circle cx="8" cy="29" r="3" fill="#FFF8D0" stroke="#FFF6E0" strokeWidth="0.8" />
          <Circle cx="46" cy="29" r="3" fill="#FFF8D0" stroke="#FFF6E0" strokeWidth="0.8" />

          {/* Chrome Front Bumper */}
          <Rect x="3" y="34.5" width="48" height="3" rx="1.5" fill="#E8E2D5" />

          {/* Wheels */}
          <Circle cx="12" cy="39" r="5.5" fill="#181412" />
          <Circle cx="12" cy="39" r="2.5" fill="#E4DAC8" />
          <Circle cx="42" cy="39" r="5.5" fill="#181412" />
          <Circle cx="42" cy="39" r="2.5" fill="#E4DAC8" />
        </G>
      </Svg>
    );
  }

  if (type === 'soul') {
    return (
      <Svg width={width} height={height} viewBox="0 0 110 120">
        <Defs>
          {/* Deep warm sepia/amber studio background */}
          <LinearGradient id="soulSepiaBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6E3D1D" />
            <Stop offset="45%" stopColor="#4A2510" />
            <Stop offset="100%" stopColor="#221006" />
          </LinearGradient>
          <RadialGradient id="soulGlowWarm" cx="50%" cy="38%" r="60%">
            <Stop offset="0%" stopColor="#E59958" stopOpacity="0.75" />
            <Stop offset="60%" stopColor="#824119" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#221006" stopOpacity="0" />
          </RadialGradient>
          {/* Skin tones */}
          <LinearGradient id="soulSkinTone" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#9E582E" />
            <Stop offset="50%" stopColor="#7E411F" />
            <Stop offset="100%" stopColor="#5E2F14" />
          </LinearGradient>
        </Defs>

        {/* Sepia Background */}
        <Rect x="0" y="0" width="110" height="120" fill="url(#soulSepiaBg)" />
        <Rect x="0" y="0" width="110" height="120" fill="url(#soulGlowWarm)" />

        {/* Vintage baroque ornamental pattern in background */}
        <G opacity="0.18">
          <Circle cx="20" cy="25" r="24" stroke="#F5D0A9" strokeWidth="1.2" fill="none" />
          <Circle cx="20" cy="25" r="16" stroke="#F5D0A9" strokeWidth="0.8" fill="none" />
          <Circle cx="95" cy="30" r="26" stroke="#F5D0A9" strokeWidth="1.2" fill="none" />
          <Circle cx="95" cy="30" r="18" stroke="#F5D0A9" strokeWidth="0.8" fill="none" />
          <Circle cx="15" cy="95" r="22" stroke="#F5D0A9" strokeWidth="1.2" fill="none" />
          <Circle cx="90" cy="95" r="22" stroke="#F5D0A9" strokeWidth="1.2" fill="none" />
        </G>

        {/* Soulful Woman Portrait with Natural Afro & Rim Light */}
        <G transform="translate(18, 10)">
          {/* Soft backlight halo around afro */}
          <Circle cx="38" cy="35" r="28" fill="#F0A668" opacity="0.35" />

          {/* Natural Afro Hair mass */}
          <Circle cx="38" cy="34" r="25" fill="#1A0E07" />
          <Circle cx="46" cy="26" r="21" fill="#1A0E07" />
          <Circle cx="29" cy="30" r="21" fill="#1A0E07" />
          <Circle cx="44" cy="42" r="19" fill="#1A0E07" />

          {/* Delicate rim light on afro edge */}
          <Path
            d="M 16 34 A 26 26 0 0 1 58 14"
            stroke="#F5B27A"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Detailed Face Profile & Head */}
          {/* Head base */}
          <Path
            d="M 28 32 Q 40 33 44 38 Q 42 44 45 47 Q 41 50 39 55 Q 36 62 36 74 L 22 74 Z"
            fill="url(#soulSkinTone)"
          />

          {/* Forehead, eye contour & nose highlight */}
          <Path
            d="M 37 36 Q 42 38 43 43 Q 40 45 44 48 Q 39 51 38 56 Q 36 62 35 70"
            stroke="#F0A668"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Cheekbone & jaw soft shadow */}
          <Path
            d="M 34 44 Q 38 48 36 54 Q 33 58 34 66"
            stroke="#4A2510"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Soulful Ear with Gold Hoop Earring */}
          <Circle cx="29" cy="46" r="3.5" fill="#753C1B" />
          <Circle cx="29" cy="50" r="3.5" stroke="#FCE18B" strokeWidth="1.2" fill="none" />

          {/* Vintage Collared Blouse / Dress */}
          <Path
            d="M 18 72 Q 36 68 54 72 L 62 105 L 10 105 Z"
            fill="#5A2E16"
          />
          {/* Blouse V-Neck & Collar details */}
          <Path
            d="M 30 72 L 36 88 L 42 72"
            stroke="#D99158"
            strokeWidth="1.8"
            fill="none"
          />
          <Path d="M 24 72 L 34 86" stroke="#421E0B" strokeWidth="1.5" fill="none" />
          <Path d="M 48 72 L 38 86" stroke="#421E0B" strokeWidth="1.5" fill="none" />
          <Circle cx="36" cy="94" r="1.5" fill="#FCE18B" />
          <Circle cx="36" cy="101" r="1.5" fill="#FCE18B" />
        </G>
      </Svg>
    );
  }

  // roadtrip
  return (
    <Svg width={width} height={height} viewBox="0 0 110 120">
      <Defs>
        {/* Scenic country highway sky */}
        <LinearGradient id="tripSkyRef" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#5B8D98" />
          <Stop offset="40%" stopColor="#A2C3C9" />
          <Stop offset="75%" stopColor="#E2DFC9" />
          <Stop offset="100%" stopColor="#A4B384" />
        </LinearGradient>
        {/* Asphalt highway vanishing */}
        <LinearGradient id="asphaltRoad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#69655D" />
          <Stop offset="100%" stopColor="#2E2822" />
        </LinearGradient>
      </Defs>

      {/* Sky */}
      <Rect x="0" y="0" width="110" height="120" fill="url(#tripSkyRef)" />

      {/* Soft Retro Clouds */}
      <G opacity="0.55">
        <Circle cx="30" cy="30" r="14" fill="#FFFFFF" />
        <Circle cx="44" cy="27" r="18" fill="#FFFFFF" />
        <Circle cx="58" cy="31" r="13" fill="#FFFFFF" />
        <Rect x="20" y="32" width="46" height="12" rx="6" fill="#FFFFFF" />
      </G>

      {/* Rolling Hills / Countryside */}
      <Path d="M 0 54 Q 30 46 65 52 Q 95 48 110 52 L 110 70 L 0 70 Z" fill="#6B7A54" />
      <Path d="M 0 60 Q 45 55 80 58 L 110 57 L 110 75 L 0 75 Z" fill="#4B5B38" />

      {/* Pine Trees / Forest on Right */}
      <G transform="translate(80, 42)" opacity="0.9">
        <Path d="M 12 28 L 8 16 L 16 16 Z" fill="#2E3C1E" />
        <Path d="M 12 20 L 7 10 L 17 10 Z" fill="#2E3C1E" />
        <Path d="M 12 12 L 8 4 L 16 4 Z" fill="#3D4E28" />

        <Path d="M 22 30 L 18 18 L 26 18 Z" fill="#263418" />
        <Path d="M 22 22 L 17 12 L 27 12 Z" fill="#344422" />
        <Path d="M 22 14 L 18 6 L 26 6 Z" fill="#344422" />
      </G>

      {/* Trees on Left */}
      <G transform="translate(4, 46)" opacity="0.85">
        <Circle cx="10" cy="18" r="8" fill="#3A4D26" />
        <Circle cx="16" cy="16" r="9" fill="#465C30" />
        <Circle cx="8" cy="22" r="7" fill="#2B3A1C" />
      </G>

      {/* Asphalt Highway in perspective */}
      <Path d="M 36 68 L 74 68 L 106 120 L 4 120 Z" fill="url(#asphaltRoad)" />
      {/* Dashed Center Highway Line */}
      <Path d="M 55 69 L 55 120" stroke="#F4D368" strokeWidth="2.4" strokeDasharray="6,5" />

      {/* Roadside Shoulders */}
      <Path d="M 0 68 L 36 68 L 4 120 L 0 120 Z" fill="#7E744E" />
      <Path d="M 74 68 L 110 68 L 110 120 L 106 120 Z" fill="#7E744E" />

      {/* Red Vintage Pickup / Wagon Cruising into Horizon */}
      <G transform="translate(40, 68)">
        {/* Shadow */}
        <Rect x="0" y="24" width="30" height="4" rx="2" fill="#14110E" opacity="0.6" />

        {/* Cabin Glass & Roof */}
        <Path d="M 5 6 Q 15 2 25 6 L 28 13 L 2 13 Z" fill="#D7EDF0" opacity="0.95" />
        <Path d="M 5 6 Q 15 2 25 6" stroke="#9A2216" strokeWidth="1.8" fill="none" />
        {/* Center window pillar */}
        <Line x1="15" y1="5" x2="15" y2="13" stroke="#9A2216" strokeWidth="1.2" />

        {/* Red Vehicle Body */}
        <Rect x="0" y="12" width="30" height="11" rx="3.5" fill="#BF291A" />
        <Rect x="1" y="14" width="28" height="2" fill="#E85D4E" opacity="0.6" />

        {/* Chrome Rear Bumper */}
        <Rect x="1" y="20.5" width="28" height="2.5" rx="1.2" fill="#EAE5DC" />

        {/* Tail Lights */}
        <Circle cx="4" cy="16.5" r="2.2" fill="#FF4D3B" />
        <Circle cx="26" cy="16.5" r="2.2" fill="#FF4D3B" />
        <Circle cx="4" cy="16.5" r="1" fill="#FFFFFF" />
        <Circle cx="26" cy="16.5" r="1" fill="#FFFFFF" />

        {/* License plate */}
        <Rect x="11.5" y="17" width="7" height="3" fill="#FFFBE8" rx="0.5" />

        {/* Wheels */}
        <Rect x="1" y="19" width="5.5" height="6" rx="1.5" fill="#181410" />
        <Rect x="23.5" y="19" width="5.5" height="6" rx="1.5" fill="#181410" />
      </G>
    </Svg>
  );
};
