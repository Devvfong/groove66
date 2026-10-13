# UX flows, interaction states and navigation rules

## Information architecture

```text
Tab shell (light cream):
  Discover  ── playlist card ──> Playlist detail (later)
     └── genre ───────────────> Records(filter)
  Records ── tap record ───────> Now Playing (immersive dark)
  Favorites ── tap track ──────> Now Playing
  Search ── tap result ────────> Now Playing

Now Playing ── Back / Android back ──> prior tab and prior scroll position
```

The bottom tabs are Discover, Records, Favorites and Search. Do not add Now Playing as a fifth tab. Now Playing replaces the light shell with its own utility footer. In a future functional audio build, an active track may add a small mini-player above the light-screen tab bar.

## Screen/action matrix
| User action | Expected response | Scope |
|---|---|---|
| Tap Discover genre tile | Open Records with matching genre chip selected | P0 |
| Tap playlist art or hero arrow | Open themed playlist/results; no dead tap | P1 |
| Tap record row | Open Now Playing for that track | P0 |
| Tap tab icon or label | Switch to destination, update active state | P0 |
| Type Records search | Live filter title, artist and album; case insensitive | P0 |
| Select genre pill | Apply genre alongside search term | P0 |
| Clear query | Restore search results immediately | P0 |
| Tap Favorite heart | Toggle immediately and sync list/player state | P0 |
| Switch Favorites segment | Songs/Albums/Playlists content changes | P0 |
| Tap player pause | Toggle `isPlaying` visual state; label UI_DEMO until real audio | P0 |
| Tap next/previous | Choose next/previous item, reset progress state | P0 |
| Tap player shuffle/repeat | Show persistent selected mode while session lasts | P0 |
| Tap player progress rail | In demo, show explanatory disabled behavior; in P2 seek through actual audio state | P2 |
| Tap Lyrics | Show unavailable/demo explanation until rights-cleared lyrics exist | P0 |
| Tap Queue | Show queued items sheet (seeded data) | P1 |
| Tap Devices | Show local-only audio output info or disabled state; no fake casting | P1 |
| System Android back on player | Return to origin tab | P0 |

## User states
1. **First launch:** Discover visible; no permissions gate, no audio automatically playing. Favorites can be seeded for design demo but must be labeled demo data.
2. **Empty favorites:** friendly compact illustration and `No favorites yet` with link to Records; no broken blank screen.
3. **No search results:** `No records found` and `Clear filters` CTA; use original typography and paper colors.
4. **No media loaded:** Now Playing may show fictional reference track with `DEMO PREVIEW` label; pause/play only animate visuals, not real sound.
5. **Real media loaded (P2):** player metadata/album art come from selected local file, elapsed/duration from actual playback event, and buttons control audio.
6. **Media/file inaccessible:** show readable error and option to choose another file; don't crash, deadlock or claim success.
7. **Reduced motion:** stop continuous record spin but keep control state changes visually apparent.

## Android specifics
- `BackHandler` only if needed; avoid intercepting back inconsistently with navigation library.
- Respect safe top/bottom insets, soft keyboard, and gesture navigation.
- Never request broad file permissions just for the design preview.
- When implementing local audio, use user-mediated file selection and supported Expo APIs; confirm permissions on a real device.

## Data behavior
Single source of truth for `currentTrack`, `isPlaying`, `favoriteTrackIds`, `favoriteAlbumIds`, `searchText`, `genreFilter`, `queue`, `shuffle`, `repeatMode` and navigation origin. Derived lists should be selectors rather than duplicated arrays per screen.

## Micro-interactions
- Selected genre/favorite tab change uses a short color/opacity transition.
- Pressed card briefly darkens; playlist art shifts minimally, never flips/springs wildly.
- Vinyl is visual centerpiece; spin is smooth; tonearm can move slightly only after accurately placed static version is approved.
- Avoid modal interruptions in primary listening flow.
