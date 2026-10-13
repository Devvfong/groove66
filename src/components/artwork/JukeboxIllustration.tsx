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
  width?: number;
  height?: number;
};

export const JukeboxIllustration: React.FC<Props> = ({ width = 150, height = 185 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 195" fill="none">
      <Defs>
        {/* Outer glowing neon arch gradient */}
        <LinearGradient id="neonArchMain" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#C8481A" />
          <Stop offset="20%" stopColor="#F79628" />
          <Stop offset="50%" stopColor="#FFE57F" />
          <Stop offset="80%" stopColor="#F79628" />
          <Stop offset="100%" stopColor="#C8481A" />
        </LinearGradient>

        {/* Chrome metallic gradient with specular highlights */}
        <LinearGradient id="chromeShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#5E5851" />
          <Stop offset="25%" stopColor="#D9D5CF" />
          <Stop offset="50%" stopColor="#FFFFFF" />
          <Stop offset="75%" stopColor="#B0ABA4" />
          <Stop offset="100%" stopColor="#55504A" />
        </LinearGradient>

        {/* Pillar glowing column gradient */}
        <LinearGradient id="pillarNeon" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#DF5F24" />
          <Stop offset="30%" stopColor="#FFBA32" />
          <Stop offset="65%" stopColor="#FFE785" />
          <Stop offset="85%" stopColor="#FFBA32" />
          <Stop offset="100%" stopColor="#D35118" />
        </LinearGradient>

        {/* Dome warm interior radial glow */}
        <RadialGradient id="domeInteriorGlow" cx="50%" cy="40%" r="55%">
          <Stop offset="0%" stopColor="#FFF1B8" stopOpacity="1" />
          <Stop offset="45%" stopColor="#F7A72A" stopOpacity="0.9" />
          <Stop offset="80%" stopColor="#D35818" stopOpacity="0.95" />
          <Stop offset="100%" stopColor="#7E2808" stopOpacity="1" />
        </RadialGradient>

        {/* Deep red jewel gradient */}
        <RadialGradient id="redRuby" cx="35%" cy="30%" r="65%">
          <Stop offset="0%" stopColor="#FFA694" />
          <Stop offset="45%" stopColor="#D42B1B" />
          <Stop offset="85%" stopColor="#8A1409" />
          <Stop offset="100%" stopColor="#4A0803" />
        </RadialGradient>

        {/* Speaker grille mesh gradient */}
        <LinearGradient id="grilleDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#22150E" />
          <Stop offset="50%" stopColor="#150C07" />
          <Stop offset="100%" stopColor="#0B0503" />
        </LinearGradient>
      </Defs>

      {/* Ground drop shadow */}
      <Rect x="14" y="185" width="132" height="8" rx="4" fill="#140C07" opacity="0.4" />

      {/* Chrome Base Platter with double bevel */}
      <Rect x="18" y="172" width="124" height="15" rx="3" fill="url(#chromeShine)" />
      <Rect x="23" y="174" width="114" height="2" fill="#FFFFFF" opacity="0.9" />
      <Rect x="20" y="183" width="120" height="2" fill="#443F3A" />

      {/* Main Arch Dark Housing Body */}
      <Path
        d="M 22 172 L 22 64 A 58 58 0 0 1 138 64 L 138 172 Z"
        fill="#1C1009"
      />

      {/* Outer Chrome Bevel Arch */}
      <Path
        d="M 19 172 L 19 64 A 61 61 0 0 1 141 64 L 141 172 Z"
        fill="none"
        stroke="url(#chromeShine)"
        strokeWidth="3.5"
      />

      {/* Glowing Neon Arch Tube */}
      <Path
        d="M 26 172 L 26 64 A 54 54 0 0 1 134 64 L 134 172 Z"
        fill="none"
        stroke="url(#neonArchMain)"
        strokeWidth="9"
      />

      {/* Inner Chrome Arch Frame */}
      <Path
        d="M 33 172 L 33 64 A 47 47 0 0 1 127 64 L 127 172 Z"
        fill="none"
        stroke="url(#chromeShine)"
        strokeWidth="3"
      />

      {/* Crown / Red Jewel Crest at Arch Apex */}
      <Path
        d="M 72 6 Q 80 1 88 6 L 89 20 Q 80 23 71 20 Z"
        fill="url(#redRuby)"
        stroke="url(#chromeShine)"
        strokeWidth="1.5"
      />
      <Circle cx="80" cy="12" r="3" fill="#FFE59E" />
      <Circle cx="80" cy="12" r="1.5" fill="#FFFFFF" />

      {/* UPPER SECTION: Glass Dome & Illuminated Carousel */}
      <G>
        {/* Dome Glass Area */}
        <Path
          d="M 35 66 A 45 45 0 0 1 125 66 L 125 76 L 35 76 Z"
          fill="url(#domeInteriorGlow)"
        />

        {/* Radiating Fan Rays in Dome Window */}
        <G opacity="0.45">
          <Line x1="80" y1="65" x2="52" y2="35" stroke="#FFF7D6" strokeWidth="1.2" />
          <Line x1="80" y1="65" x2="65" y2="25" stroke="#FFF7D6" strokeWidth="1.2" />
          <Line x1="80" y1="65" x2="80" y2="21" stroke="#FFF7D6" strokeWidth="1.2" />
          <Line x1="80" y1="65" x2="95" y2="25" stroke="#FFF7D6" strokeWidth="1.2" />
          <Line x1="80" y1="65" x2="108" y2="35" stroke="#FFF7D6" strokeWidth="1.2" />
        </G>

        {/* Record Carousel Turntable Tiers */}
        <Path d="M 44 65 Q 80 43 116 65" stroke="#FFF8DE" strokeWidth="3" fill="none" opacity="0.95" />
        <Path d="M 50 56 Q 80 39 110 56" stroke="#FFE794" strokeWidth="2" fill="none" opacity="0.8" />
        <Path d="M 58 48 Q 80 35 102 48" stroke="#FFCE48" strokeWidth="1.8" fill="none" opacity="0.7" />

        {/* Record Carousel Spindle Hub */}
        <Circle cx="80" cy="63" r="6.5" fill="#1E120A" />
        <Circle cx="80" cy="63" r="3.5" fill="url(#chromeShine)" />
        <Circle cx="80" cy="63" r="1.5" fill="#1E120A" />
      </G>

      {/* Horizontal Chrome Mid-Belt with Selection Bars */}
      <Rect x="35" y="75" width="90" height="23" fill="#1B1009" />
      <Rect x="35" y="75" width="90" height="2.2" fill="url(#chromeShine)" />
      <Rect x="35" y="96" width="90" height="2.5" fill="url(#chromeShine)" />

      {/* Title Strips / Song Selectors */}
      <G>
        <Rect x="41" y="79" width="78" height="4.2" rx="1" fill="#FFF0BA" />
        <Rect x="41" y="85" width="78" height="4.2" rx="1" fill="#FFF0BA" />
        <Rect x="41" y="91" width="78" height="3.5" rx="1" fill="#FFF0BA" />

        {/* Red selection indicators on title strips */}
        <Rect x="43" y="79.5" width="6.5" height="3.2" rx="0.5" fill="#D42B1B" />
        <Rect x="54" y="79.5" width="6.5" height="3.2" rx="0.5" fill="#D42B1B" />
        <Rect x="78" y="79.5" width="6.5" height="3.2" rx="0.5" fill="#D42B1B" />
        <Rect x="103" y="79.5" width="6.5" height="3.2" rx="0.5" fill="#D42B1B" />
        <Rect x="47" y="85.5" width="6.5" height="3.2" rx="0.5" fill="#D42B1B" />
        <Rect x="72" y="85.5" width="6.5" height="3.2" rx="0.5" fill="#D42B1B" />
        <Rect x="97" y="85.5" width="6.5" height="3.2" rx="0.5" fill="#D42B1B" />
      </G>

      {/* Push Button Selection Row */}
      <Rect x="35.5" y="98.5" width="89" height="8.5" fill="#321D12" />
      <Rect x="35.5" y="105.5" width="89" height="1.8" fill="url(#chromeShine)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <Rect
          key={i}
          x={41 + i * 9}
          y="100.5"
          width="5.8"
          height="4.2"
          rx="1"
          fill="url(#chromeShine)"
        />
      ))}

      {/* LOWER SECTION: Speaker Grille & Center Red Emblem */}
      <Rect x="35.5" y="107" width="89" height="65" fill="url(#grilleDark)" />

      {/* Speaker Grille Louver Lines */}
      <G opacity="0.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Line
            key={i}
            x1={42 + i * 11}
            y1="108"
            x2={42 + i * 11}
            y2="171"
            stroke="url(#chromeShine)"
            strokeWidth="1.4"
          />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <Line
            key={i}
            x1="37"
            y1={112 + i * 6.5}
            x2="123"
            y2={112 + i * 6.5}
            stroke="#634533"
            strokeWidth="0.9"
          />
        ))}
      </G>

      {/* Glowing Center Medallion / Red Ruby Jewel in Chrome Bezel */}
      <Circle cx="80" cy="139" r="15" fill="#1C1009" stroke="url(#chromeShine)" strokeWidth="2.8" />
      <Circle cx="80" cy="139" r="11" fill="url(#redRuby)" />
      <Circle cx="80" cy="139" r="4.5" fill="#FF8D75" opacity="0.9" />
      <Circle cx="80" cy="139" r="2" fill="#FFFFFF" />

      {/* Fluted Chrome Edge Frame on Lower Body */}
      <Rect x="34.5" y="107" width="3.2" height="65" fill="url(#chromeShine)" />
      <Rect x="122.5" y="107" width="3.2" height="65" fill="url(#chromeShine)" />

      {/* SIDE PILLARS: Translucent Glowing Amber Neon Columns with Chrome Caps */}
      {/* Left Pillar */}
      <G>
        {/* Top Chrome Cap with Rings */}
        <Path d="M 17 64 L 32 64 L 30 71 L 19 71 Z" fill="url(#chromeShine)" />
        <Rect x="18" y="70" width="13" height="2" fill="#FFFFFF" opacity="0.8" />
        {/* Glowing Fluted Column */}
        <Rect x="19" y="71" width="11" height="96" rx="3.5" fill="url(#pillarNeon)" />
        <Rect x="22.5" y="71" width="3.5" height="96" rx="1.5" fill="#FFF8E0" opacity="0.8" />
        {/* Pillar mid rings */}
        <Line x1="19" y1="119" x2="30" y2="119" stroke="url(#chromeShine)" strokeWidth="1.5" />
        {/* Bottom Chrome Base Cap */}
        <Path d="M 18 167 L 31 167 L 32 173 L 17 173 Z" fill="url(#chromeShine)" />
      </G>

      {/* Right Pillar */}
      <G>
        {/* Top Chrome Cap with Rings */}
        <Path d="M 128 64 L 143 64 L 141 71 L 130 71 Z" fill="url(#chromeShine)" />
        <Rect x="129" y="70" width="13" height="2" fill="#FFFFFF" opacity="0.8" />
        {/* Glowing Fluted Column */}
        <Rect x="130" y="71" width="11" height="96" rx="3.5" fill="url(#pillarNeon)" />
        <Rect x="133.5" y="71" width="3.5" height="96" rx="1.5" fill="#FFF8E0" opacity="0.8" />
        {/* Pillar mid rings */}
        <Line x1="130" y1="119" x2="141" y2="119" stroke="url(#chromeShine)" strokeWidth="1.5" />
        {/* Bottom Chrome Base Cap */}
        <Path d="M 129 167 L 142 167 L 143 173 L 128 173 Z" fill="url(#chromeShine)" />
      </G>

      {/* Front Glass Arch Specular Sheen Reflection */}
      <Path
        d="M 32 64 A 48 48 0 0 1 80 16"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </Svg>
  );
};
