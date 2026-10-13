# Expo implementation architecture

## Source baseline / migration strategy
The supplied starter has `App.tsx` controlled by local page state. This is intentional baseline. A migration to Expo Router is **optional until the UI screens match**, and must never be allowed to change visible UI. Native-looking system tabs would conflict with the mockup; use a custom tab renderer (or `expo-router/ui` headless tabs once migrated). Official navigation docs: https://docs.expo.dev/router/advanced/custom-tabs/

## Proposed target structure

```text
groove66-ui/
  App.tsx                         # entry until navigation migration
  index.js
  src/
    theme/
      tokens.ts                   # palette, spacing, radii, typography
      typography.ts
    data/
      demoMusic.ts                # fictional tracks, artists, playlists
    types/
      music.ts
    state/
      playerStore.ts
      libraryStore.ts
    components/
      layout/RetroBottomBar.tsx
      typography/VintageHeading.tsx
      hero/JukeboxHero.tsx
      artwork/ExposedVinyl.tsx
      artwork/RecordSleeve.tsx
      cards/PlaylistCard.tsx
      cards/GenreTile.tsx
      rows/RecordRow.tsx
      rows/FavoriteSongRow.tsx
      player/Turntable.tsx
      player/Tonearm.tsx
      player/NowPlayingControls.tsx
    screens/
      DiscoverScreen.tsx
      RecordsScreen.tsx
      FavoritesScreen.tsx
      SearchScreen.tsx
      NowPlayingScreen.tsx
    hooks/
      useReducedMotion.ts
    services/
      audioDemo.ts                # UI only, clearly labeled
      audioNative.ts              # P2, after audio integration
    assets/
      covers/                     # original artwork (future)
      playlists/
      genres/
      textures/
  docs/
    reference/
```

When transitioning to Expo Router, use `src/app/(tabs)/...` route wrappers delegating to existing screen components, plus `src/app/player.tsx`; migrate `main` and packages according to official docs. Keep design components independent from routing so screenshots do not change.

## UI dependencies (incrementally, not all at once)
- Existing: React Native, `react-native-svg`, `react-native-safe-area-context`, Lucide icons and Expo SDK.
- Later: `expo-font` (for display serif), `expo-image` (as required), `react-native-reanimated` if supported by installed Expo SDK for motion, plus locally sourced original art.
- Navigation: use current state machine initially; when scale requires it, `expo-router` custom tabs, not platform-native tabs.
- Storage: `expo-sqlite` or AsyncStorage for favorites after UX milestone.
- Audio: `expo-audio` only in the real-audio milestone. Official docs: https://docs.expo.dev/versions/latest/sdk/audio/
- File import: `expo-document-picker` and tested file copying after UI fidelity; no bulk device scan without a real user need.

Always install SDK-matched versions via `npx expo install <package>` and `npx expo install --check`. Don't copy versions from an unrelated Expo release.

## Domain types (design-oriented)

```ts
type Genre = 'Soul' | 'Motown' | 'Surf Rock' | 'Jazz' | 'Psychedelic Rock' | 'British Invasion';
type Album = {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: Genre;
  coverAssetId: string;      // original bundled art, not arbitrary URL
  trackIds: string[];
};
type Track = {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  durationSeconds: number;
  isDemoOnly: boolean;
  localUri?: string;        // only after import and permissions
};
type Playlist = { id: string; title: string; coverAssetId: string; trackIds: string[] };
type RepeatMode = 'off' | 'all' | 'one';
type PlayerState = {
  currentTrackId: string | null;
  playing: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  positionSeconds: number;
  originTab: 'discover' | 'records' | 'favorites' | 'search';
};
```

The existing source `src/music.ts` has a different `Genre` union. Migrate demo data with an explicit, reviewed mapping rather than silently changing behavior. The above types describe the **target** model, not current code.

## State ownership
- One player store for active track, play state, position, queue, shuffle and repeat.
- One library store for favorites (track, album, playlist), search history, user-added files (later).
- `Records` filter and Favorites segment may be route-local states.
- Original sample data constants stay read-only; don't mix them with mutable favorites.
- Use selectors for filtered tracks and ordered playlists. Avoid duplicated arrays and stale UI.

## Rendering / performance
- `FlatList` for Records/Favorites/Search, stable keys, memoized row components if necessary.
- Avoid 300 nested SVG circles that rerender with progress; animate a vinyl wrapper transform.
- Cache or bundle artwork locally; use static asset mapping for `require()` since dynamic require is restricted.
- Keep actual file/audio APIs isolated from presentation. No media permissions in UI demo.

## Security and privacy
- No hard-coded API keys or secrets in APK.
- Never access private music/files without explicit user action and Android permission rules.
- Do not run a local open HTTP server merely to play offline tracks.
- Do not imply DRM bypass, catalog downloads or scraping.
- If adding any remote content in future, prefer HTTPS and a verifiable rights/source policy.
