import { Platform } from 'react-native';

// Theme tokens for Groove '66 - locked to docs/ux/DESIGN_SYSTEM.md

export const colors = {
  // Paper & light background system
  paper: '#F6EFD9',       // Light-screen background
  paperLight: '#FCF6E8',  // Cards, foreground sheets
  paperMuted: '#EBDFC7',  // Search fields/segmented backgrounds
  paperDark: '#E4D5BA',   // Card borders and deeper cream

  // Typography inks
  ink: '#34251B',         // Primary headline and body on paper
  inkMuted: '#74695A',    // Secondary text, subtitles
  inkSubtle: '#9A8E7E',   // Timestamps, placeholders
  hairline: '#DED2B9',    // Quiet separators

  // Brand accents
  rust: '#BD5940',        // Selected pills, CTA, hearts, '66 logo
  rustDark: '#A84329',    // Pressed CTA, active badges
  tangerine: '#D86F3C',   // Sunburst and highlights
  mustard: '#EAC47B',     // Record labels, gold decorations, timeline
  mustardLight: '#F3D78A',// Highlights on gold
  olive: '#647254',       // Genre art, jukebox moss panel
  oliveDark: '#444F3A',   // Deep moss for jukebox hero card
  teal: '#4E8681',        // Surf imagery, cool accents
  tealDark: '#335C58',

  // Wood & Turntable system
  wood: '#4E2615',        // Player background foundation
  woodDeep: '#281309',    // Player lower gradient, shadows
  woodGlow: '#6B381F',    // Warm wood center highlight
  ivoryOnWood: '#F7E8C9', // Now-playing labels and metadata
  vinyl: '#181614',       // LP face
  vinylGroove: '#2B2724', // Subtle sheen on record grooves
  metalKnob: '#A8A29A',   // Brushed aluminum knob
  metalKnobLight: '#D8D4CC',
  metalKnobDark: '#6E6760',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  card: 14,
  search: 20,
  pill: 999,
  full: 9999,
};

export const typography = {
  fontFamilySerif: Platform.select({
    web: 'Fraunces_700Bold, Georgia, serif',
    default: 'Fraunces_700Bold',
  }),
  fontFamilySerifBold: Platform.select({
    web: 'Fraunces_700Bold, Georgia, serif',
    default: 'Fraunces_700Bold',
  }),
  fontFamilySerifBlack: Platform.select({
    web: 'Fraunces_900Black, Georgia, serif',
    default: 'Fraunces_900Black',
  }),
  fontFamilySerifExtraBold: Platform.select({
    web: 'Fraunces_800ExtraBold, Georgia, serif',
    default: 'Fraunces_800ExtraBold',
  }),
  fontFamilySerifSemiBold: Platform.select({
    web: 'Fraunces_600SemiBold, Georgia, serif',
    default: 'Fraunces_600SemiBold',
  }),
  fontFamilySerifRegular: Platform.select({
    web: 'Fraunces_400Regular, Georgia, serif',
    default: 'Fraunces_400Regular',
  }),
  fontFamilySans: Platform.select({
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }),
  fontFamilySerifFallback: 'serif',
};
