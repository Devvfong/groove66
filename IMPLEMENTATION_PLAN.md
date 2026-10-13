# IMPLEMENTATION_PLAN — visual-first, one phase at a time

**Baseline:** starter UI exists; visual reference alignment incomplete; audio absent.  
**Execution:** work serially, record screenshot evidence after every phase; avoid building the entire app in one unreviewable agent run.

| Phase | Outcome | Blocking acceptance gate |
|---|---|---|
| **P0** | Project baseline, references, original artwork pipeline | Docs/reference accessible; track current source & no false PASS |
| **P1** | Design tokens, typography, layout/chrome | Cream theme + four-tab bar match; screenshot at 360/393 dp |
| **P2** | Discover exact remake | Greeting, jukebox hero, three playlists, six illustrated genre tiles |
| **P3** | Records exact remake | Search+filters, **single-column protruding-vinyl rows** |
| **P4** | Favorites remake | Segmented Songs/Albums/Playlists, saved song rows, album strip |
| **P5** | Now Playing exact remake | Dark wood, large grooved vinyl, tonearm, controls, utility footer |
| **P6** | Search screen and cross-screen UX | Fourth tab functional, filters and search reuse record rows |
| **P7** | State integration, navigation and responsiveness | No dead essential taps; Android back + selected track/favorites consistent |
| **P8** | Animation, accessibility and screenshot QA | Motion/reduced motion; >=90/100 review score; no critical fail |
| **P9** | Real local audio (separate optional release gate) | Real `expo-audio` playback verified with user-licensed files |
| **P10** | Persist favorites, release docs and Android build | No regression in screen fidelity or navigation |

## P0 — Document and asset baseline
Tasks: save master poster and four reference crops, inventory current project, decide safe original assets, add licensing manifest when artwork files arrive, confirm Expo SDK compatibility. Do not remove current code or misrepresent its status.

## P1 — Visual foundation
Create color/spacing/type tokens, header and custom bottom bar with **Discover / Records / Favorites / Search**; centralize screen templates with safe area and consistent background. Do not use stock platform tabs. Ensure 44–48 dp hit targets.

## P2 — Discover
Replace current typographic/vinyl hero with the **jukebox** card. Implement greeting, sunburst, featured playlists row and 2×3 genre grid; ship original art assets. Verify section proportions and screenshot on narrow Android screen.

## P3 — Records
Replace **2-column grid** with **vertical list rows**. Reusable RecordSleeve + ExposedVinyl layers; album metadata to right; search and five filter pills. Confirm vinyl protrudes behind sleeve, no offscreen clipping, and list scrolls smoothly.

## P4 — Favorites
Three-segment tabs, saved-song rows, heart toggle, Favorite Albums strip, empty states. Preserve seeded demo state (not real music). Cross-screen favorite interactions must synchronize.

## P5 — Now Playing
Build wood/textures, centered brand, silver knob, STEREO mark, LP, center label and tonearm, song text/heart, gold seek bar, orange transport button, Lyrics/Queue/Devices. Guarantee compact size fit and appropriate back behavior. **No generic album cover card replacing the turntable.**

## P6 — Search
New fourth bottom tab, style derived from Records: same search input and record rows, recent/genre chips. Test keyboard and empty states.

## P7 — Wiring and layout polish
Single player state, routing origin, keep scroll/filter state, functional favorite/query/filter interactions. Identify UI-demo transport state; avoid fake progress claims. Complete 360/393/412 tests.

## P8 — Visual gates
Refine typography/asset crop/spacing only based on screenshots, reduce-motion accessibility, test font scaling, avoid section drift. Require 90/100 rubric with no critical misses (see `docs/engineering/VISUAL_QA.md`) **before** starting real audio.

## P9 — Optional real sound
Integrate `expo-audio` to play imported, locally licensed or user-owned tracks. Use DocumentPicker and permissions carefully; replace demo position with player events; seek, pause, next, cleanup; test playback/lifecycle on real Android device. Keep reference UI unchanged.

## P10 — Optional release
Persist favorites and settings, test restore, handle missing files, polish app icon/splash, validate EAS Android development/preview build; record versions, QA and changelog.

## Global stop conditions
- Any primary screen uses screenshot image as its entire UI.
- Any use of unlicensed commercial recording/album cover.
- Any major styling change that makes the result unlike reference.
- Claiming sound works when only visuals are simulated.
- Declaring visual milestone done without device/emulator screenshot evidence.

## Task handoff
The AI execution prompts in `docs/agent/PHASE_PROMPTS.md` specify deliverables. Use **one prompt/phase at a time**, attach the master reference image to the coding agent when its environment cannot inspect repository images automatically, and require screenshots + explicit gap report before approving the next phase.
