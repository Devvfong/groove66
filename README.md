# Groove '66 — Design-locked Expo Android music player

> **UI master:** [`docs/reference/groove66-ui-master.png`](docs/reference/groove66-ui-master.png)  
> **Status:** EXISTING UI PROTOTYPE; image-faithful rebuild PLANNED, not implemented.  
> **Priority:** screen fidelity → navigation and interaction → local persistence → actual audio.

Groove '66 is a portrait-first, 1960s-inspired jukebox and vinyl music player for Android, made with Expo, React Native, and TypeScript. The illustrated four-phone poster is the **visual contract**, not a generic inspiration board. Work through the documented milestones without substituting a different visual design.

## First read (for humans and coding agents)

1. [`AGENTS.md`](AGENTS.md) — rules for visual fidelity and controlled changes.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — what the checked-in starter actually implements.
3. [`docs/ux/SCREEN_SPECS.md`](docs/ux/SCREEN_SPECS.md) — pixel-intent descriptions for each screen.
4. [`docs/ux/DESIGN_SYSTEM.md`](docs/ux/DESIGN_SYSTEM.md) — colors, typography, measurements, component rules.
5. [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — ordered phases, completion gates.
6. [`docs/engineering/VISUAL_QA.md`](docs/engineering/VISUAL_QA.md) — screenshot acceptance criteria.

See [`docs/INDEX.md`](docs/INDEX.md) for the full document map.

## Existing starter: run locally

```bash
npm install
npx expo install --fix
npx expo start
```

> The app currently starts at `index.js` and renders `App.tsx`; it does **not** use Expo Router yet. Do not change `main` or assume an `app/` folder exists until the dedicated migration phase. Expo Go must support the project's Expo SDK; otherwise use an Android development build.

### Known differences versus reference

- Discover currently uses a type/vinyl hero instead of the **jukebox** image.
- Records currently uses a **two-column grid**, not the reference's **stacked horizontal record cards**.
- Favorites currently lacks **Songs / Albums / Playlists** segments and favorite-album strip.
- Bottom nav is **three destinations**, not four (**Search** missing).
- Now Playing needs the **wood-grain turntable, tonearm, knob, STEREO badge, record label and bottom utilities**.
- Current `src/music.ts` is fictional display data, with **no audio**. Demo transport controls simulate state; do not describe them as audio playback.

## Scope and safety

Use fictional sample songs or content with verified usage rights. Don't scrape or redistribute commercial songs or album covers. Bundled reference images guide layout/color only; **do not use the marketing poster or cropped screenshots as app UI backgrounds**. Build native components and original illustration assets.

## Delivery standard

On a 360 dp and 393 dp portrait Android screen, the four primary screens must be immediately recognizable as the matching phones in the reference image. Functionality must not degrade visual fidelity; if a detail is unclear, follow the image and the written UX contract before inventing a redesign.
