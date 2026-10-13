import React from 'react';
import Svg, {
  Rect,
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { type Album } from '../../data/musicData';

type Props = {
  coverType: Album['coverType'];
  size?: number;
};

export const AlbumCoverArtwork: React.FC<Props> = ({ coverType, size = 80 }) => {
  if (coverType === 'rubber_soul') {
    return (
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          {/* Olive-brown photographic background */}
          <LinearGradient id="rubberSoulBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4A5833" />
            <Stop offset="45%" stopColor="#2E391E" />
            <Stop offset="100%" stopColor="#1A2210" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#rubberSoulBg)" />

        {/* Famous Bubbly Slanted Title: RUBBER SOUL */}
        <G transform="translate(10, 20) rotate(-14)">
          <Path
            d="M 2 4 Q 18 -3 36 2 Q 46 5 48 11 Q 34 15 16 13 Q 4 11 2 4 Z"
            fill="#DF6B35"
          />
          <Path
            d="M 6 12 Q 22 8 42 12 Q 47 18 36 21 Q 20 19 4 19 Z"
            fill="#EB8B3D"
          />
          <SvgText
            x="4"
            y="12"
            fill="#FFF1D6"
            fontSize="9"
            fontWeight="900"
            fontFamily="serif"
          >
            RUBBER
          </SvgText>
          <SvgText
            x="8"
            y="20"
            fill="#FFE7BA"
            fontSize="8"
            fontWeight="900"
            fontFamily="serif"
          >
            SOUL
          </SvgText>
        </G>

        {/* Four Beatles Portait Silhouettes in 1965 perspective looking down */}
        <G transform="translate(11, 30)">
          {/* John (left) */}
          <Circle cx="12" cy="22" r="10" fill="#3D4D28" stroke="#6D854A" strokeWidth="1" />
          <Path d="M 6 18 Q 12 12 18 18 Q 18 26 12 30 Q 6 26 6 18 Z" fill="#243015" />

          {/* Paul (center-top) */}
          <Circle cx="29" cy="15" r="9" fill="#3A4826" stroke="#6D854A" strokeWidth="1" />
          <Path d="M 23 12 Q 29 8 35 12 Q 35 20 29 23 Q 23 20 23 12 Z" fill="#202A12" />

          {/* George (center-bottom) */}
          <Circle cx="29" cy="33" r="9" fill="#344222" stroke="#6D854A" strokeWidth="1" />
          <Path d="M 23 30 Q 29 26 35 30 Q 35 38 29 41 Q 23 38 23 30 Z" fill="#1C2610" />

          {/* Ringo (right) */}
          <Circle cx="45" cy="22" r="10" fill="#3D4D28" stroke="#6D854A" strokeWidth="1" />
          <Path d="M 39 18 Q 45 12 51 18 Q 51 26 45 30 Q 39 26 39 18 Z" fill="#243015" />
        </G>
      </Svg>
    );
  }

  if (coverType === 'aretha') {
    return (
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          {/* Warm aged paper cover gradient */}
          <LinearGradient id="arethaSleeveBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#EDE1CE" />
            <Stop offset="30%" stopColor="#DFD0BA" />
            <Stop offset="100%" stopColor="#9C7F64" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#arethaSleeveBg)" />

        {/* Vintage Red Atlantic Title Banner at Top */}
        <Rect x="7" y="6" width="66" height="11" rx="1.5" fill="#8A2318" />
        <SvgText
          x="10"
          y="14.5"
          fill="#FFF6E8"
          fontSize="7"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="0.4"
        >
          ARETHA FRANKLIN
        </SvgText>

        {/* Subtitle text */}
        <SvgText
          x="10"
          y="22"
          fill="#3E2B1E"
          fontSize="5"
          fontWeight="bold"
          fontFamily="serif"
        >
          I NEVER LOVED A MAN THE WAY I LOVE YOU
        </SvgText>

        {/* Aretha Franklin Soulful Portrait */}
        <G transform="translate(18, 23)">
          {/* Elegant Updo Bouffant Hairstyle */}
          <Circle cx="22" cy="18" r="15" fill="#24160E" />
          <Circle cx="25" cy="11" r="11" fill="#24160E" />
          <Circle cx="17" cy="14" r="10" fill="#24160E" />

          {/* Face profile & neck in warm sepia */}
          <Path
            d="M 15 18 Q 28 19 28 29 Q 26 35 22 43 L 11 43 Z"
            fill="#693F27"
          />

          {/* Pearl necklace */}
          <Circle cx="14" cy="41" r="1.6" fill="#FFFBF2" />
          <Circle cx="18" cy="42" r="1.6" fill="#FFFBF2" />
          <Circle cx="22" cy="42" r="1.6" fill="#FFFBF2" />
          <Circle cx="26" cy="41" r="1.6" fill="#FFFBF2" />
          <Circle cx="30" cy="40" r="1.6" fill="#FFFBF2" />
        </G>
      </Svg>
    );
  }

  if (coverType === 'pet_sounds') {
    return (
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          {/* Forest green header and warm zoo background */}
          <LinearGradient id="petSoundsBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#223E22" />
            <Stop offset="28%" stopColor="#223E22" />
            <Stop offset="30%" stopColor="#8C7456" />
            <Stop offset="100%" stopColor="#4A3A26" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#petSoundsBg)" />

        {/* Forest Green Header Banner */}
        <Rect x="0" y="0" width="80" height="23" fill="#1E381E" />
        <SvgText
          x="7"
          y="10.5"
          fill="#F5DD58"
          fontSize="7"
          fontWeight="bold"
          fontFamily="serif"
        >
          The Beach Boys
        </SvgText>
        <SvgText
          x="7"
          y="19"
          fill="#FFFCEB"
          fontSize="8.5"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="0.2"
        >
          PET SOUNDS
        </SvgText>

        {/* Band Members in Sweaters feeding goats at the zoo */}
        <G transform="translate(10, 26)">
          <Circle cx="15" cy="14" r="7" fill="#6A563F" />
          <Circle cx="29" cy="13" r="7" fill="#584632" />
          <Circle cx="43" cy="14" r="7" fill="#6A563F" />

          {/* Sweaters & clothing */}
          <Path d="M 8 20 L 22 20 L 23 38 L 7 38 Z" fill="#886B4C" />
          <Path d="M 22 19 L 36 19 L 37 38 L 21 38 Z" fill="#4B3928" />
          <Path d="M 36 20 L 50 20 L 51 38 L 35 38 Z" fill="#886B4C" />

          {/* Zoo animals (white/tan goats) */}
          <Path d="M 10 35 Q 22 29 34 35 L 34 44 L 8 44 Z" fill="#E6DCCB" />
          <Path d="M 36 33 Q 46 27 56 34 L 56 44 L 34 44 Z" fill="#D2C3AA" />
        </G>
      </Svg>
    );
  }

  if (coverType === 'miles') {
    return (
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          {/* Deep midnight blue moody jazz studio */}
          <LinearGradient id="milesSleeveBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1B3147" />
            <Stop offset="50%" stopColor="#0F1D2B" />
            <Stop offset="100%" stopColor="#080F16" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#milesSleeveBg)" />

        {/* Bold Blue/White Typography: MILES DAVIS / Kind of Blue */}
        <SvgText
          x="7"
          y="13"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="sans-serif"
          letterSpacing="0.8"
        >
          MILES DAVIS
        </SvgText>
        <SvgText
          x="7"
          y="22"
          fill="#6DA6DC"
          fontSize="7"
          fontWeight="bold"
          fontFamily="serif"
        >
          Kind of Blue
        </SvgText>

        {/* Miles Davis Playing Trumpet in Blue Spotlight */}
        <G transform="translate(12, 26)">
          <Circle cx="24" cy="18" r="17" fill="#19334C" opacity="0.6" />

          {/* Profile leaning into trumpet */}
          <Path
            d="M 14 12 Q 22 8 26 18 Q 24 28 20 42 L 8 42 Z"
            fill="#09121A"
          />

          {/* Brass Trumpet angled downward */}
          <Path
            d="M 18 18 L 38 28 L 44 32"
            stroke="#9BC4EB"
            strokeWidth="2.8"
            fill="none"
          />
          {/* Trumpet bell flare */}
          <Path d="M 42 26 L 46 34" stroke="#9BC4EB" strokeWidth="3.5" fill="none" />
        </G>
      </Svg>
    );
  }

  if (coverType === 'supremes') {
    return (
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          {/* Warm retro cream cardstock */}
          <LinearGradient id="supremesSleeveBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#EAD8B7" />
            <Stop offset="100%" stopColor="#CDB48E" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#supremesSleeveBg)" />

        {/* Red Title Banner: THE SUPREMES */}
        <Rect x="6" y="5" width="68" height="13" rx="1.5" fill="#A83222" />
        <SvgText
          x="9"
          y="14.5"
          fill="#FFF6E5"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="0.4"
        >
          THE SUPREMES
        </SvgText>

        {/* Subtitle Motown script */}
        <SvgText
          x="9"
          y="23"
          fill="#583B25"
          fontSize="4.8"
          fontWeight="bold"
          fontFamily="serif"
        >
          MORE HITS BY THE SUPREMES
        </SvgText>

        {/* The Supremes Trio in matching dresses & bouffant hairstyles */}
        <G transform="translate(10, 24)">
          {/* Left Singer (Mary Wilson) */}
          <Circle cx="12" cy="15" r="8" fill="#3A2619" />
          <Path d="M 6 21 L 18 21 L 20 46 L 4 46 Z" fill="#826248" />

          {/* Center Singer (Diana Ross) */}
          <Circle cx="30" cy="13" r="9" fill="#301D13" />
          <Path d="M 23 20 L 37 20 L 40 46 L 20 46 Z" fill="#9C3426" />

          {/* Right Singer (Florence Ballard) */}
          <Circle cx="48" cy="15" r="8" fill="#3A2619" />
          <Path d="M 42 21 L 54 21 L 56 46 L 40 46 Z" fill="#826248" />
        </G>
      </Svg>
    );
  }

  if (coverType === 'united') {
    return (
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <LinearGradient id="unitedSleeveBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#223348" />
            <Stop offset="50%" stopColor="#172433" />
            <Stop offset="100%" stopColor="#0E1620" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#unitedSleeveBg)" />

        {/* Vintage Top Banner */}
        <Rect x="5" y="5" width="70" height="12" rx="1.5" fill="#C2943E" opacity="0.9" />
        <SvgText
          x="9"
          y="13.5"
          fill="#17222F"
          fontSize="6.2"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="0.4"
        >
          MARVIN & TAMMI
        </SvgText>

        {/* Duet Silhouettes in warm gold/sepia */}
        <G transform="translate(10, 19)">
          {/* Marvin Gaye (Left) */}
          <Circle cx="16" cy="15" r="8.5" fill="#2E1B14" />
          <Path d="M 11 17 Q 18 16 21 23 L 21 34 L 8 34 Z" fill="#7A4E31" />
          <Path d="M 5 29 L 23 29 L 25 54 L 3 54 Z" fill="#8E4334" />

          {/* Tammi Terrell (Right) */}
          <Circle cx="39" cy="16" r="8" fill="#2E1B14" />
          <Circle cx="43" cy="13" r="6" fill="#2E1B14" />
          <Path d="M 33 18 Q 39 17 42 23 L 42 34 L 30 34 Z" fill="#8B5B3B" />
          <Path d="M 28 29 L 47 29 L 49 54 L 26 54 Z" fill="#A87739" />
        </G>
      </Svg>
    );
  }

  if (coverType === 'songs_in_key') {
    return (
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <LinearGradient id="songsInKeyBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E26A4D" />
            <Stop offset="50%" stopColor="#D5593C" />
            <Stop offset="100%" stopColor="#AA3B26" />
          </LinearGradient>
          <LinearGradient id="sunDialInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4D2026" />
            <Stop offset="100%" stopColor="#2D1115" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#songsInKeyBg)" />

        {/* Central Sunburst Wheel / Dial emblem */}
        <Circle cx="40" cy="38" r="23" fill="#F4B846" opacity="0.35" />
        <Circle cx="40" cy="38" r="17" fill="url(#sunDialInner)" />
        <Circle cx="40" cy="38" r="16" stroke="#F6CB55" strokeWidth="1" fill="none" />

        {/* Radiating spokes */}
        <G transform="translate(40, 38)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rot = i * 30;
            return (
              <Rect
                key={i}
                x="-1.2"
                y="-15"
                width="2.4"
                height="8"
                rx="1"
                fill="#F6CB55"
                transform={`rotate(${rot})`}
              />
            );
          })}
          <Circle cx="0" cy="0" r="5" fill="#F6CB55" />
          <Circle cx="0" cy="0" r="2.5" fill="#4D2026" />
        </G>

        {/* Vintage album banner lettering at bottom */}
        <Rect x="10" y="61" width="60" height="11" rx="2" fill="#3D181C" opacity="0.6" />
        <SvgText
          x="14"
          y="69"
          fill="#FFF0C4"
          fontSize="5.5"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="0.4"
        >
          STEVIE WONDER
        </SvgText>
      </Svg>
    );
  }

  // summer_love
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Defs>
        <LinearGradient id="summerLoveSleeveBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#DF7B41" />
          <Stop offset="50%" stopColor="#E8AA4C" />
          <Stop offset="100%" stopColor="#8A482B" />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="80" height="80" rx="5" fill="url(#summerLoveSleeveBg)" />

      {/* Sun & 60s Daisy flower */}
      <Circle cx="40" cy="40" r="23" fill="#FFE8A3" opacity="0.6" />
      <G transform="translate(40, 40)">
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          return (
            <Circle
              key={i}
              cx={14 * Math.cos(angle)}
              cy={14 * Math.sin(angle)}
              r="7.5"
              fill="#D2552B"
              opacity="0.8"
            />
          );
        })}
        <Circle cx="0" cy="0" r="9" fill="#FFF4D0" />
      </G>
      <SvgText
        x="8"
        y="14"
        fill="#FFFFFF"
        fontSize="8"
        fontWeight="900"
        fontFamily="serif"
      >
        SUMMER OF LOVE
      </SvgText>
    </Svg>
  );
};
