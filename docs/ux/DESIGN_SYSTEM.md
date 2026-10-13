# Design system — Groove '66 / reference locked

> Always open `../reference/groove66-ui-master.png` before editing tokens. Values here are implementation approximations of a rendered concept, not pixel measurements from a Figma file.

## Personality
Warm, friendly, tactile, mid-century American record shop. Cream card stock, muted rainbow ink, vintage wood, grooved black vinyl, brass details, and rounded illustrated album sleeves. **Do not** switch to neon cyberpunk, black glassmorphism, Spotify green, material-you gradients, or an all-modern minimal layout.

## Color tokens (hex; semantic names)

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F6EFD9` | Light-screen background |
| `paperLight` | `#FCF6E8` | Cards, foreground sheets |
| `paperMuted` | `#EBDFC7` | Search fields/segmented backgrounds |
| `ink` | `#34251B` | Headline, body on paper |
| `inkMuted` | `#74695A` | Secondary text |
| `rust` | `#BD5940` | Selected pills, CTA, hearts |
| `rustDark` | `#A84329` | Pressed CTA |
| `tangerine` | `#D86F3C` | Sunburst and highlights |
| `mustard` | `#EAC47B` | Record labels, gold decorations |
| `olive` | `#647254` | Genre art and trim |
| `teal` | `#4E8681` | Surf imagery |
| `wood` | `#4E2615` | Player background foundation |
| `woodDeep` | `#281309` | Player lower gradient, shadows |
| `ivoryOnWood` | `#F7E8C9` | Now-playing labels |
| `vinyl` | `#181614` | LP face |
| `hairline` | `#DED2B9` | Quiet separators |

Keep a source token map in `src/theme/tokens.ts`. Avoid ad-hoc color literals in screen components. Text contrast matters more than making every exact tiny label match the rendering.

## Typography
| Role | Intended feel | Suggested implementation | 393 dp size |
|---|---|---|---|
| Brand wordmark | Heavy 1960s slab/rounded serif | Custom text styling or original vector wordmark | 28–30 |
| Screen H1 (`Records`, `Favorites`) | Black high-contrast vintage serif | Fraunces bold/black or legally distributable equivalent | 29–32 |
| Section title | Editorial serif | Matching display serif bold | 18–21 |
| Track title | Dense, readable body | DM Sans/Inter semibold or bundled open licensed equivalent | 13–15 |
| Body / metadata | Unobtrusive grotesk | Same sans | 11–14 |
| Eyebrow (`STEREO`, badge) | Wide spaced lettering | Sans uppercase 600 | 9–11 |
| Player song title | Oversized vintage serif | Display serif bold | 24–28 |

Fonts must load deterministically before screenshots; use `expo-font` or a supported google-font package. Don't ship font files without confirming licenses. Never use fake handwritten text for essential UX copy.

## Spacing / sizing
- Target reference: Android portrait around **393×852 logical dp**. Also test 360×800 and 412×915 dp. Screenshot's phone frame is decorative; ignore poster framing and external captions.
- Safe-area padding: actual inset from `react-native-safe-area-context` (no hardcoded status-bar compensation).
- Light-screen horizontal padding: **20 dp**. Search/bottom nav can use 16–18 dp.
- Vertical gap system: `4, 8, 12, 16, 20, 24, 32` dp.
- Corner radius: card `12–16`; search field `18–24`; pills `999`; record sleeve `8–10`.
- Touch targets: min **44×44 dp**, prefer `48×48`; do not render 10dp icons with 10dp hit areas.
- Card shadow: short/soft warm-gray; one elevation style, not heavy diffuse floating boxes.
- Top and bottom rules: 1px `hairline`; avoid thick separators.
- Bottom bar: fixed/safe-area-aware, approx 60–68 dp content height; cream background. Four equally spaced icons/labels; selected icon deep/darker or rust.

## Composition rules
- Light-screen backgrounds contain subtle warm texture, but not noisy wallpaper behind every line of text.
- Discover hero is an original **orange jukebox** at left, dark olive/charcoal text panel at right; the image/card should occupy most of page width and ~180–205 dp height at 393 dp.
- Record sleeves are square. Records protrude from **the right side** of a sleeve by roughly 25–35% of their diameter, behind text if needed. Do not flatten to a generic list icon.
- Now Playing: edge-to-edge **dark brown wood**, large black LP at center-top, original label in mustard/teal, static tonearm on right, circular metallic dial/knob upper-left and small `STEREO` upper-right.
- The Now Playing orange circular pause button is the strongest control accent. Keep neighboring controls ivory, with ample separation.
- Now Playing footer has **Lyrics**, **Queue**, **Devices**, not the primary four-tab navigation.

## Motion
- Vinyl rotates only while `playing` is true (demo playback may animate if explicitly labeled). Use native-thread-friendly rotation animation, roughly **33⅓ RPM impression** (not required physical simulation).
- Ease in/out for record start/stop; honor reduced-motion setting: pause rotation and replace animated transitions with static state change.
- Page transitions: short 150–240ms fade/slide; nothing bouncy that distracts from the retro feel.
- Heart tap can scale gently for feedback; animation never blocks favorite state updates.

## Component inventory
`BrandLogo`, `VintageHeading`, `SunburstIcon`, `JukeboxHero`, `PlaylistCard`, `GenreTile`, `RetroSearchInput`, `FilterChip`, `RecordSleeve`, `ExposedVinyl`, `RecordListRow`, `FavoritesSegmentedControl`, `FavoriteSongRow`, `AlbumStrip`, `RetroBottomBar`, `Turntable`, `VinylDisc`, `Tonearm`, `StereoBadge`, `MetalKnob`, `NowPlayingControls`, `NowPlayingUtilityBar`, `MiniPlayer` (conditional), `EmptyState`.

## Screen-specific prohibition
Do not use a platform-native Material bottom bar or generic native large headers: both would break the screenshot's custom editorial shapes and sizing. Native navigation still works; only the **visible tab bar** is custom.
