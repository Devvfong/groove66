# Copy/paste implementation prompts — one phase per agent run

Use the master prompt **plus** one task below. Do not ask an agent to implement the entire project in one shot; the checkpoint screenshots are part of the work.

## P0 — Baseline & preparation
> Inspect the existing Expo 57 Groove '66 starter and all docs without changing screen behavior. Inventory the current screen/UI elements, identify deviations from `docs/reference/groove66-ui-master.png`, create a legally safe original-artwork asset manifest, and report exact code changes needed for P1. Confirm whether Android device/emulator screenshot capture is available. Never call the prototype 'pixel perfect' before checking.

## P1 — Shared design foundation
> Implement tokens and shared light-screen chrome based on `docs/ux/DESIGN_SYSTEM.md`. Upgrade the bottom bar to Discover, Records, Favorites, Search with the correct vintage icon/label styling and responsive safe-area layout. Preserve other screens' behavior. Do not replace the tab bar with native Material tabs. Show 360/393 dp screenshots and any mismatch.

## P2 — Discover reference match
> Rebuild Discover to match the leftmost reference crop: logo+gear, Good to see you greeting, rust sunburst, original orange jukebox hero with dark right-side message and circular CTA, exactly three illustrated featured playlists, and a 3×2 illustrated genre grid with the intended colors. Original art only, never use the cropped screenshot as a UI component. Match spacing and type closely. Tap actions must be meaningful. Test 360/393 dp screenshot fidelity.

## P3 — Records reference match
> Replace the current Records two-column grid with the reference's vertical album list. Add correct header, search input, pills All/Soul/Motown/Rock/Jazz, and original square album sleeves with a **black grooved vinyl disc protruding behind to the right**. Each row must have artist, album, year/genre and ellipsis. Use a virtualized list, preserve live search+filter and tap-to-player. Screenshot compare to `docs/reference/02-records-reference.png`.

## P4 — Favorites reference match
> Refactor Favorites to match the third phone: vintage heading with top-right affordance, rounded Songs/Albums/Playlists segments (Songs active rust), list of compact square art+title+artist/duration+rust filled heart rows, and a `Favorite Albums` cover strip below. All favorite toggles must update the shared source of truth. Include empty states for each segment. Compare screenshot and test the 360dp layout.

## P5 — Now Playing reference match
> Rebuild Now Playing to match the fourth phone: deep walnut/wood background, centered Groove '66 branding, brushed metallic knob upper-left, small STEREO label upper-right, huge black vinyl with concentric grooves and original 1960s beach-style label, visibly positioned silver tonearm on right, ivory title/artist/heart, mustard progress line, large burnt-orange playback button, shuffle/previous/next/repeat, and bottom Lyrics/Queue/Devices utilities. Player must be a separate immersive screen with reliable Android back. Retain honest `UI_DEMO` audio state. Compare screenshot on 360/393dp and do not omit tonearm.

## P6 — Search style extension
> Implement Search as fourth tab with the same cream background, vintage typography, search pill and exposed-vinyl record-row components used in Records. Support query by title/artist/album, recent search chips or genre discovery, empty states, clear button and keyboard behavior. Avoid new app-like design patterns not present in the visual master.

## P7 — Cross-screen state & responsive QA
> Centralize current selected track, play/pause demo state, repeat/shuffle, favorites, origin tab and search/filter selectors without breaking visuals. Ensure back from player restores the tab that opened it; no hidden clipped nav; correct mini-player rules; verify both narrow and tall phone layouts. List visible mismatches rather than claiming complete.

## P8 — Animation & visual acceptance
> Add smooth, accessible vinyl spin while `playing`, gentle press/favorite feedback, reduced-motion support and font loading. Collect 393dp screenshots for Discover/Records/Favorites/Now Playing, compare them side by side to four provided reference crops, score with `docs/engineering/VISUAL_QA.md`, and fix critical differences. Do not add audio yet. No claimed pass unless screenshots are actually inspected.

## P9 — Actual local audio (separate scope)
> After visual acceptance, implement `expo-audio` using a user-imported or rights-cleared local file. Connect play/pause/skip/seek/status to true player events, handle missing files and activity lifecycle, and update `AUDIO_STATUS` to REAL_LOCAL_AUDIO only when verified on Android. Preserve all layouts and visual assets exactly. Do not fetch commercial tracks or build a download service.

## P10 — Persistence & release
> Add local persistence for favorites and settings, optional restored playback queue, regression tests, minimal offline permissions, icon/splash, and an Android preview build. Run screenshot regression first. Record dependencies/build output accurately and report remaining unsupported background media behavior if any.
