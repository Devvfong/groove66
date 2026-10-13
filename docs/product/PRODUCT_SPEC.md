# Product specification — Groove '66

## Product statement
Groove '66 is an Android-first music player that recreates the feeling of picking a record from a 1960s music shop and placing it on a home turntable. Users browse illustrated collections, save favorites, search for music, and enjoy a richly animated vinyl Now Playing view. Visual craft is the primary differentiator.

## Target users
- Listener who enjoys nostalgic record-store design and playful visual interactions.
- Android user who wants a small, offline-friendly personal music player.
- Developer evaluating a polished React Native/Expo UX as a portfolio demonstration.

## MVP scope (UI-first)
| Requirement | Priority | UI-first implementation |
|---|---|---|
| FR-01 Discover playlist, genre cards | P0 | Browse seeded fictitious data |
| FR-02 Records search + genre filters | P0 | Real client-side filtering |
| FR-03 Records exposed-vinyl row cards | P0 | Layout and original covers matching image |
| FR-04 Favorites: Songs / Albums / Playlists | P0 | Segmented UI and state |
| FR-05 Search tab | P0 | Search all seeded artists/tracks/albums |
| FR-06 Now Playing turntable | P0 | Reusable record, label, tonearm, wood backdrop |
| FR-07 Favorite/unfavorite | P0 | Immediate update across screens |
| FR-08 Play/pause/skip/shuffle/repeat | P0 | Clearly marked **demo state** until audio connected |
| FR-09 Restore favorites after launch | P1 | SQLite/AsyncStorage once UI fidelity passes |
| FR-10 Import compatible local audio files | P2 | DocumentPicker + file handling |
| FR-11 Real audio playback | P2 | expo-audio with proper events and lifecycle |
| FR-12 Background media controls | P3 | Investigate tested Android support; no unconditional promise |

## Out of scope for first release
- Spotify/Apple Music integration; subscription or catalog APIs; online radio service.
- Commercial catalog streaming/download, automatic lyrics scraping, album art scraping.
- Accounts, authentication, cloud sync, backend, ads and payment handling.
- Landscape/tablet-specific redesign; handle gracefully but prioritize portrait.

## Nonfunctional requirements
- **NFR-01 Reference fidelity:** the first three light screens and full dark player are immediately identifiable against the exact crops.
- **NFR-02 Layout:** no horizontal overflow and no CTA under navbar/safe area on 360, 393 and 412 dp widths.
- **NFR-03 Interaction:** tappable elements >= 44 dp and clear loading/empty/disabled feedback.
- **NFR-04 Accessibility:** readable key text, screen-reader labels, reduced motion, status bar contrast.
- **NFR-05 Smoothness:** scrolling and animations should feel stable on midrange Android; animate transforms rather than rerendering large lists.
- **NFR-06 Privacy:** UI-only build has no network requirement, trackers, accounts or sensitive permissions.
- **NFR-07 Honest state:** no 'playing' claim until playable media exists; UI demo is labeled.

## Content policy for source assets
Seed with fictional tracks and original cover graphics; real music files must be user-provided or explicitly licensed. Famous titles appearing in the generated visual are illustrative only, not a grant to use recordings/artwork.

## Success
A tester can navigate all five destinations (four tabs plus player), understand the interface without instruction, favorite and search fictional albums, and identify all four poster screens in Android screenshots. Real audio is evaluated as a separate milestone.
