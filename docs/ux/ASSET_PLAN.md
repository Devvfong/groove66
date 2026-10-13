# Original asset plan and licensing requirements

## Important distinction
The original marketing concept contains record art that resembles real-world album packaging. **Those compositions are visual inspiration, not distributable app assets.** Do not extract covers out of the mockup and display them in a shipped music app. Do not download a famous album cover from the web unless a valid license grants intended reuse. Build original assets instead.

## Required assets by phase
| ID | Asset | Preferred form | Visual requirement |
|---|---|---|---|
| A-01 | Brand wordmark | Text/SVG | Vintage heavy serif; `Groove` dark, `'66` rust |
| A-02 | Sunburst | Inline SVG | 12–16 tapered rust/gold rays |
| A-03 | Jukebox illustration | Transparent PNG/WebP or authored SVG | Tall chromed orange/gold 60s jukebox; rounded arch, glowing ribs |
| A-04 | Three playlist covers | Three square locally stored WebP | Summer road/palm, soul portrait-style original illustration, roadtrip scenery |
| A-05 | Six genre tiles | Local WebP/SVG | Soul silhouette, vinyl Motown, surf wave, jazz trumpet, psychedelic flower, British-invasion pattern |
| A-06 | Six+ fictional album covers | Local WebP | Color-distinct, typographic/illustrated 1960s record sleeves, 1:1 |
| A-07 | Vinyl disc | `react-native-svg` | Black with layered groove rings; central dynamic label |
| A-08 | Tonearm | SVG overlaid on vinyl | Metallic slim diagonal arm with head near lower-right |
| A-09 | Metallic knob | SVG/gradients | Silver brushed circular control in player upper-left |
| A-10 | Wood grain | Original tiled subtle background asset | Dark warm brown with restrained grain; must not impair contrast |
| A-11 | Jukebox border/chrome details | SVG/local components | Gold/orange accent; use sparingly |
| A-12 | App icon/splash | Original logo/icon | Same cream/rust palette |

## Art direction prompts for original assets
**Jukebox:** "Isolated 1960s chrome-and-amber jukebox illustration, symmetrical arched silhouette, illuminated orange and gold tubes, tasteful record-store editorial art, transparent background, no brand logo, high-resolution asset for a mobile hero card."

**Playlist sleeves:** "Original mid-century screenprinted vinyl sleeve illustration, warm grain and 1960s color blocks, 1:1 square crop, no celebrity likeness, no existing album composition, ample safe area for overlay title."

**Player record label:** "Original 1960s beach-and-sun vinyl center label, circles and teal/mustard stripes, dark legible small wordmark, 1:1, no existing band logo."

**Wood texture:** "Seamless subtle walnut-brown 1960s turntable veneer texture, low contrast, no knobs, no writing, 1:1 tile."

## Visual consistency requirements
- Every album cover should look like part of the **same imaginary record shop**, with shared paper/grain treatment and ink restraint.
- Prefer artwork created specifically for the app, not indiscriminate stock photos.
- Keep key art legible at 45 dp thumbnails; no microtext requirements on covers.
- Use `expo-image` or React Native `Image` with `resizeMode=cover` for square cards as appropriate; validate exact Expo compatibility before adding dependencies.
- Core UI must work with local assets and without network access.
- Store asset origins, author, license, attribution and hash in `docs/ux/ASSET_LICENSES.md` when adding each binary. Never commit uncertain-licensed music/art.

## Existing demo data
The source `src/music.ts` provides six **fictional** tracks. Keep their identifiers stable during initial UI migration or provide an explicit migration map; the screenshot's famous catalog entries are NOT backend requirements.

## Asset validation
Generate/approve assets first, then compare screens. Screenshots must show original art with the same **roles, colors, aspect ratios, and layout balance** as the master without copying commercial imagery.
