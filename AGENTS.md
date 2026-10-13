# AGENTS.md — Instructions for vibe-coding agents

## Mission (non-negotiable)
Build a faithful implementation of the provided Groove '66 four-phone design. **Treat `docs/reference/groove66-ui-master.png` and its four crops as the UI source of truth.** Preserve the 1960s aesthetic across all changes. Prioritize visible similarity on a real Android device over adding features.

## Read order
1. `CURRENT_STATE.md` and `DECISIONS.md`
2. `docs/ux/SCREEN_SPECS.md` and `docs/ux/DESIGN_SYSTEM.md`
3. `docs/ux/INTERACTIONS.md`
4. `docs/engineering/ARCHITECTURE.md` and `docs/engineering/VISUAL_QA.md`
5. `IMPLEMENTATION_PLAN.md`; execute one phase at a time.

## Rules
- **Do not silently redesign** any of the four reference screens, reorder sections, change the palette, substitute material/system-native tabs, or replace the player with a generic Spotify-like card.
- Do not recreate the entire mockup as a static image: implement responsive React Native text, pressables, lists, SVG shapes and original image assets.
- Use `docs/reference/0*-reference.png` for side-by-side comparisons; a phone crop is a screenshot target, not a source of copyrighted cover art.
- Start by preserving the existing Expo SDK and dependency versions; use `npx expo install <packages>` for compatible additions. Verify before changing SDK.
- The existing app uses `App.tsx` + `index.js`; only migrate to Expo Router in the designated phase, with navigation regression checks.
- Keep presentation and playback separate. On UI-only phases, no fake claim of audio playback. A demo mode must be explicitly identified.
- Music art and tracks must be original, commissioned, public domain, or licensed. Never bundle a third-party commercial recording/cover by default.
- Android back button returns from Now Playing to the previous tab; back from the root follows platform behavior.
- Follow accessibility: touch targets >= 44x44 dp (prefer 48), informative labels, non-color-only state, reduced-motion option, proper system insets.
- No analytics SDK, user accounts, backend, or network dependency in the UI-fidelity milestone.
- Before making a large refactor, record the current working state and scope of changes. Do not edit unrelated files.

## Required phase completion report
Every completion message from an agent must include:

```
PHASE: <identifier>
FILES_CHANGED: <paths>
SCREENS_CHANGED: <names>
REFERENCE_CHECK: <side-by-side screenshot evidence or NOT_RUN>
DEVICE_SIZE_TESTED: <360 / 393 / 412 dp or NOT_RUN>
VALIDATION: <typecheck, tests, Expo launch; PASS/FAIL/NOT_RUN>
VISUAL_DEVIATIONS: <explicit list>
AUDIO_STATUS: <UI_DEMO / REAL_LOCAL_AUDIO>
NEXT_PHASE: <identifier>
```

## Definition of done for any visual phase
- The screen retains the reference's information hierarchy, illustration placement, color blocks and typography.
- All relevant actions have deterministic behavior or are visibly disabled/labelled as demo.
- No clipped content at 360/393 dp; safe-area/navigation-bar insets respected.
- Screen comparison is recorded. No unapproved decorative elements or major visual changes.

## Exact design precedence
1. Four-phone reference image / crops (visual intent)
2. `docs/ux/SCREEN_SPECS.md` (interaction-specific refinements)
3. `docs/ux/DESIGN_SYSTEM.md` (shared tokens)
4. Existing starter code (implementation reference only)

An image-rendered mockup can contain impossible tiny text, fake system chrome or celebrity record sleeves; implement readable UI and lawful original artwork without losing the layout.
