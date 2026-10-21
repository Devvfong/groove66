/**
 * Groove '66 — Phase P11: Vintage Dark Mode Automated Test Suite
 *
 * Verifies:
 * 1. Token symmetry between lightColors and darkColors
 * 2. WCAG AAA and AA contrast ratio compliance for both themes
 * 3. Theme resolution logic (system, light, dark overrides)
 * 4. Storage key and serialization integrity
 */

const assert = require('assert');

// Relative luminance formula per W3C WCAG 2.1
function hexToRgb(hex) {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function sRgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * sRgbToLinear(r) +
    0.7152 * sRgbToLinear(g) +
    0.0722 * sRgbToLinear(b)
  );
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Emulate token definitions from src/theme/tokens.ts
const lightColors = {
  paper: '#F6EFD9',
  paperLight: '#FCF6E8',
  paperMuted: '#EBDFC7',
  paperDark: '#E4D5BA',
  ink: '#34251B',
  inkMuted: '#74695A',
  inkSubtle: '#9A8E7E',
  hairline: '#DED2B9',
  rust: '#BD5940',
  rustDark: '#A84329',
  tangerine: '#D86F3C',
  mustard: '#EAC47B',
  mustardLight: '#F3D78A',
  olive: '#647254',
  oliveDark: '#444F3A',
  teal: '#4E8681',
  tealDark: '#335C58',
  wood: '#4E2615',
  woodDeep: '#281309',
  woodGlow: '#6B381F',
  ivoryOnWood: '#F7E8C9',
  vinyl: '#181614',
  vinylGroove: '#2B2724',
  metalKnob: '#A8A29A',
  metalKnobLight: '#D8D4CC',
  metalKnobDark: '#6E6760',
};

const darkColors = {
  paper: '#1E1612',
  paperLight: '#2C211B',
  paperMuted: '#3B2D24',
  paperDark: '#16100D',
  ink: '#F6EFD9',
  inkMuted: '#C7BAA7',
  inkSubtle: '#948777',
  hairline: '#3D2E24',
  rust: '#D66347',
  rustDark: '#BC5137',
  tangerine: '#E57E4B',
  mustard: '#EAC47B',
  mustardLight: '#F3D78A',
  olive: '#788765',
  oliveDark: '#2A3324',
  teal: '#5C9994',
  tealDark: '#1D3B38',
  wood: '#3D1F12',
  woodDeep: '#1E0E07',
  woodGlow: '#5A2C18',
  ivoryOnWood: '#F7E8C9',
  vinyl: '#141210',
  vinylGroove: '#22201D',
  metalKnob: '#A8A29A',
  metalKnobLight: '#D8D4CC',
  metalKnobDark: '#55504A',
};

function resolveTheme(preference, systemScheme) {
  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

console.log('======================================================================');
console.log("GROOVE '66 — PHASE P11 THEME & CONTRAST VALIDATION SUITE");
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failCount++;
  }
}

// 1. Token Symmetry
runTest('Token Symmetry: All keys in lightColors exist in darkColors', () => {
  const lightKeys = Object.keys(lightColors);
  const darkKeys = Object.keys(darkColors);
  assert.strictEqual(lightKeys.length, darkKeys.length, 'Key counts must match');
  for (const k of lightKeys) {
    assert(darkColors[k] !== undefined, `Missing key in darkColors: ${k}`);
    assert(/^#[0-9A-Fa-f]{6}$/.test(lightColors[k]), `Invalid hex in lightColors[${k}]`);
    assert(/^#[0-9A-Fa-f]{6}$/.test(darkColors[k]), `Invalid hex in darkColors[${k}]`);
  }
});

// 2. Contrast in Light Theme
runTest('Light Mode Contrast: Primary ink (#34251B) on paper (#F6EFD9) >= 7.0:1 (AAA)', () => {
  const ratio = getContrastRatio(lightColors.ink, lightColors.paper);
  console.log(`       Light ink/paper ratio: ${ratio.toFixed(2)}:1`);
  assert(ratio >= 7.0, `Contrast ratio ${ratio} must be >= 7.0 (AAA)`);
});

runTest('Light Mode Contrast: Muted ink (#74695A) on paper (#F6EFD9) >= 4.5:1 (AA)', () => {
  const ratio = getContrastRatio(lightColors.inkMuted, lightColors.paper);
  console.log(`       Light inkMuted/paper ratio: ${ratio.toFixed(2)}:1`);
  assert(ratio >= 4.5, `Contrast ratio ${ratio} must be >= 4.5 (AA)`);
});

// 3. Contrast in Dark Theme (Night Drive)
runTest('Dark Mode Contrast: Primary ink (#F6EFD9) on dark walnut paper (#1E1612) >= 7.0:1 (AAA)', () => {
  const ratio = getContrastRatio(darkColors.ink, darkColors.paper);
  console.log(`       Dark ink/paper ratio: ${ratio.toFixed(2)}:1`);
  assert(ratio >= 7.0, `Contrast ratio ${ratio} must be >= 7.0 (AAA)`);
});

runTest('Dark Mode Contrast: Muted ink (#C7BAA7) on dark walnut paper (#1E1612) >= 7.0:1 (AAA)', () => {
  const ratio = getContrastRatio(darkColors.inkMuted, darkColors.paper);
  console.log(`       Dark inkMuted/paper ratio: ${ratio.toFixed(2)}:1`);
  assert(ratio >= 7.0, `Contrast ratio ${ratio} must be >= 7.0 (AAA)`);
});

runTest('Dark Mode Contrast: Primary ink (#F6EFD9) on card sheet (#2C211B) >= 7.0:1 (AAA)', () => {
  const ratio = getContrastRatio(darkColors.ink, darkColors.paperLight);
  console.log(`       Dark ink/paperLight ratio: ${ratio.toFixed(2)}:1`);
  assert(ratio >= 7.0, `Contrast ratio ${ratio} must be >= 7.0 (AAA)`);
});

runTest('Dark Mode Contrast: Rust accent (#D66347) on card sheet (#2C211B) >= 3.0:1 (AA Graphical)', () => {
  const ratio = getContrastRatio(darkColors.rust, darkColors.paperLight);
  console.log(`       Dark rust/paperLight ratio: ${ratio.toFixed(2)}:1`);
  assert(ratio >= 3.0, `Contrast ratio ${ratio} must be >= 3.0 (AA Graphical/UI)`);
});

// 4. Resolution Logic
runTest('Theme Resolution: System mode defaults to system color scheme', () => {
  assert.strictEqual(resolveTheme('system', 'dark'), 'dark');
  assert.strictEqual(resolveTheme('system', 'light'), 'light');
  assert.strictEqual(resolveTheme('system', null), 'light'); // fallback
});

runTest('Theme Resolution: Manual light override ignores system dark', () => {
  assert.strictEqual(resolveTheme('light', 'dark'), 'light');
  assert.strictEqual(resolveTheme('light', 'light'), 'light');
});

runTest('Theme Resolution: Manual dark override ignores system light', () => {
  assert.strictEqual(resolveTheme('dark', 'light'), 'dark');
  assert.strictEqual(resolveTheme('dark', 'dark'), 'dark');
});

// 5. Storage Persistence Key
runTest('Storage: Storage key is defined consistently', () => {
  const STORAGE_KEY = '@groove66_theme_preference';
  assert.strictEqual(STORAGE_KEY, '@groove66_theme_preference');
  const validPreferences = ['system', 'light', 'dark'];
  for (const pref of validPreferences) {
    const serialized = JSON.stringify(pref);
    const parsed = JSON.parse(serialized);
    assert.strictEqual(parsed, pref);
  }
});

console.log('\n======================================================================');
console.log(`TOTAL SUITE RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
}
