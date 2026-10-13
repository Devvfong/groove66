# Visual QA and acceptance criteria (design lock)

## Principle
A coding-agent response saying 'looks similar' is not proof. Compare a **real app screenshot** with the corresponding `docs/reference/*-reference.png` side-by-side and check the elements below. Reference crops include a rendered phone frame and distortions; **compare the screen region and compositional intent**, not the outer device border.

## QA environment
- Android portrait at **360×800**, **393×852**, **412×915** logical dp (or nearest emulator configs).
- Test status/navigation bars both gesture and button navigation if accessible.
- Take one screenshot per target route at 393 dp. Repeat overflow checks at 360 and 412 dp.
- Use default text size then test 1.15–1.3x font scale; no essential content missing or overlapping.
- Mock media only: disable mini-player if no track selected, to compare with poster's initial-state screens.

## Scoring rubric (100 points)
| Criterion | Points | Fail condition |
|---|---:|---|
| Information hierarchy / section order | 25 | Missing or rearranged major blocks |
| Visual composition and spacing | 25 | Hero/list/player proportions clearly unlike mockup |
| Original illustrated assets matching artistic role | 20 | Missing jukebox/record/wood/album artwork |
| Palette, type and small details | 15 | Material-looking redesign, incorrect dark/light separation |
| Interaction, safe areas, responsive fit | 15 | Clipped CTA/nav or dead essential controls |

**Gate:** target >= 90/100 with **no critical fail**. This is a human/agent review rubric, not an automated metric pretending the reference is exact pixel data. No score is assigned until a screenshot is actually compared.

## Discover visual checks
- [ ] `Groove '66` logo dark+rust and settings gear appear at top.
- [ ] Greeting says `Good to see you`, with rust sunburst at right.
- [ ] **Illustrated orange jukebox hero** fills first dominant card; dark right-side panel and round arrow.
- [ ] Three illustrative featured playlist covers align as a row.
- [ ] Two rows of three retro illustrated genre tiles, clear labels.
- [ ] Cream four-tab bar visible without covering last content.

## Records visual checks
- [ ] Big serif `Records` heading and right-side utility glyph.
- [ ] Rounded search and **All / Soul / Motown / Rock / Jazz** pill row.
- [ ] **Single column** album list, not a two-column grid.
- [ ] Each sleeve has a **partially exposed black disc** at right; disc layers behind card art.
- [ ] Album metadata fits at 360 dp, no ellipsis over artwork.
- [ ] Four-tab bar active Records.

## Favorites visual checks
- [ ] Serif `Favorites` heading and top-right filter/sort affordance.
- [ ] Three-way segmented control; Songs selected rust by default.
- [ ] Album thumbnails, title/artist, heart, row separators.
- [ ] `Favorite Albums` section and horizontal row of sleeve images.
- [ ] Four-tab bar active Favorites.

## Now Playing visual checks
- [ ] Dark walnut background occupies entire app canvas; no cream toolbar.
- [ ] Brand near top center, silver knob upper-left and small `STEREO` badge upper-right.
- [ ] **Large grooved black vinyl** is visible with an original colored label.
- [ ] **Metal tonearm** extends from right near disc (not omitted).
- [ ] Ivory song title and artist; heart aligned to right.
- [ ] Gold progress line; current and total times readable.
- [ ] Main orange play/pause circle larger than adjacent controls; previous/next/shuffle/repeat visible.
- [ ] Bottom utilities are **Lyrics, Queue, Devices**, not main tabs.

## Search derived style checks
- [ ] Search shares cream/bg, type and record rows; no style drift.
- [ ] Keyboard doesn't hide active search input or results.
- [ ] Empty results and clear filters actions are accessible.

## Functional smoke matrix
| Test | Expected |
|---|---|
| Tap each bottom tab | Correct screen, active styling |
| Tap genre on Discover | Records filtered to matching style |
| Search and clear query | Correct list filtering / restore |
| Favorite/unfavorite a track | Same state reflected on Records, Favorites, Player |
| Tap album | Player displays selected metadata and art |
| Back from Player | Origin tab restored |
| Play/pause in UI demo | Visible demo state; **no claim actual sound** |
| Reduced motion | Continuous LP rotation disabled |
| Rotate device | No crash; portrait can be primary target |

## Validation commands

```bash
npm install
npx expo install --check
npm run typecheck
npx expo start
```

If using Expo Router or audio modules, run their specific installation/launch validations too. Do not claim `PASS` unless actually run. A green typecheck does not prove visual fidelity; a screenshot review is mandatory.

## Feedback format
For every reference-matching screen provide: current screenshot path, corresponding reference crop, mismatches ordered by severity, changes made, remaining blockers, and explicit `MATCH_PENDING` or `MATCH_ACCEPTED` (human approval where possible). Never mark all visual work complete from code inspection alone.
