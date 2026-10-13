# Screen-by-screen visual blueprint

The **master image** is `../reference/groove66-ui-master.png`. Four crops are in that folder. Interpret its in-phone areas only. The 1960s promotional headline, outer stripes, vinyl in the corners, captions under the phones, and stacked records outside the phones are **marketing-poster decoration, not part of the app**.

## Global chrome (light screens)
- Warm cream full-screen backdrop; Android status bar icons dark.
- Header content appears below safe top inset. Padding ~20 dp.
- Four-item fixed bottom bar: **Discover | Records | Favorites | Search** with outlined retro icons and tiny readable labels.
- Use selected icon/darker label to indicate tab. Preserve destination scroll position when switching where practical.
- No mandatory mini-player in the reference's initial state; display slim mini-player **only after a track has been selected**, inserted above tabs, never covering them.

## 1. Discover — crop `01-discover-reference.png`
**Visual reading order**
1. Top left *Groove '66* wordmark; small settings gear at right.
2. Large warm headline **Good to see you**, short body **Same songs. A brighter tomorrow.**, orange sunburst at upper-right of this greeting zone.
3. A large bordered rounded **jukebox feature hero**, roughly 2/3 visual artwork and 1/3 dark moss panel, reading **Music Brings Us Closer** and a short supporting sentence. A circular cream CTA arrow sits lower-right. The jukebox is metallic chrome/orange/gold with glowing detail; must be original illustration, not an emoji placeholder.
4. **Featured Playlists** heading at left, smaller `See all` at right. A row of **three equally-sized square-ish cards**: Summer of '66, Classic Soul, Road Trip Radio; stylized illustrated backgrounds and white type at bottom. The row should resemble the reference without relying on any third-party photograph.
5. **Genres** heading plus `See all`. Two-row, 3-column image-tile grid; examples: Soul, Motown, Surf Rock / Jazz, Psychedelic Rock, British Invasion. Tiles have vivid but muted rust/mustard/teal/dark chocolate blocks, not plain colored rounded buttons.
6. Persistent four-tab navigation.

**Interaction:** hero arrow opens curated playlist; playlist opens filtered list; genre tiles navigate to Records with genre filter; settings opens a simple themed sheet. `See all` performs a valid navigation, not a no-op.

**Layout notes:** On 360 dp screens, make content vertically scroll, not shrink to microscopic text. The horizontal playlist row may be scrollable if all three cards cannot remain legible; the *first viewport* should still visually resemble the three-card reference.

## 2. Records — crop `02-records-reference.png`
**Visual reading order**
1. Heading **Records**, top-right crate/library utility glyph (not a commerce/cart action without purpose).
2. Pale rounded search bar with search icon and hint **Search artists, albums, or songs...**.
3. Five small pill filters: **All** (rust selected), Soul, Motown, Rock, Jazz. Filter row can horizontally scroll.
4. **Vertical stack** of album rows, NOT a 2-column grid. Each row is about 92–110 dp tall at 393 dp width. Left side contains sleeve artwork about 76–84 dp and black vinyl peeking out *to the right* behind it. Right side contains artist (bold), album (regular), year and genre (small), optional ellipsis at upper-right.
5. Approx 5–6 rows visible by scrolling. Use a `FlatList` with sensible separators and clipping disabled where protruding records would otherwise be truncated.
6. Four-tab bottom bar.

**Interaction:** typing and pills combine filters, clearing search restores items, selecting row opens Now Playing, ellipsis opens explicit album actions. Preserve list scrolling when returning from player.

**Design-critical:** album sleeve + protruding black record composition; if this effect is missing, the Records screen is not complete.

## 3. Favorites — crop `03-favorites-reference.png`
**Visual reading order**
1. Heading **Favorites**, small filter/sort icon at right.
2. Segmented capsule with **Songs | Albums | Playlists**. Default = Songs, selected rust.
3. Song list: left mini square cover (~44–50 dp), center title and artist/duration, red filled heart to right, optional ellipsis. Hairline row separators.
4. Below list, heading **Favorite Albums** and `See all`, then horizontal row of square album covers with two-line captions.
5. Four-tab bottom bar.

**Content rule:** use seeded fictional tracks with believable cover imagery; the famous titles/art in the concept screenshot are appearance references only.

**Interactions:** filled heart toggles favorites immediately; Songs tab shows saved songs; Albums tab shows favorited albums; Playlists tab shows saved playlists; empty states keep the same palette and typography. Remove a favorite from Songs and the item disappears or animates out; do not remove it silently from unrelated albums unless data model requires it.

## 4. Now Playing — crop `04-now-playing-reference.png`
**This is its own full-screen immersive route, not a bottom tab.**
1. Back/down control top-left with screen-reader name; centered `Groove '66` mark at top; top-right overflow/control icon.
2. Rich wood-brown surface with darker edges, gentle grain, carefully simulated with original repeating texture or native gradients/shapes (no full-screen screenshot).
3. Upper turntable includes small metallic silver knob on upper-left, tiny `STEREO` label upper-right.
4. **Large record** ~260–305 dp diameter at 393 dp screen width, black with concentric highlights/grooves. Center has a mustard/teal custom album label and spindle hole. Vinyl occupies **the visual majority** of the upper 2/3 area, closely resembling reference.
5. Long silver/gray **tonearm** positioned from right edge toward the LP lower-right; it may be static initially but must be visibly present and not cover title text.
6. Song title in large ivory serif, artist in smaller light-cream sans; filled rust heart right-aligned.
7. Thin mustard progress line with a small pale circular thumb; elapsed on left, total on right.
8. Controls horizontally centered: shuffle, previous, **large rust-orange circle play/pause**, next, repeat. Responsive tap areas.
9. Thin divider and utilities row: **Lyrics | Queue | Devices** with small icons, labels. Initially show sensible disabled/help states where actual external integration isn't available.

**Behavior:** Play/pause and disc motion agree; progress must not claim real audio unless `expo-audio` is connected. Next/previous update cover/title/artist. Seek disabled in non-audio demo or explicitly labeled. The back button returns to whichever tab launched player.

**Viewport:** At 360 dp width/800 dp height, record may scale down while keeping all transport controls and utilities reachable. Do not hide music metadata or turntable arm to force fit. The user can scroll only if needed; controls must remain easily accessible.

## 5. Search (not pictured; derive style, don't invent redesign)
- Light cream screen with **Search** vintage serif header, same pale rounded search bar as Records.
- Sections: recent searches / browse genres / results. Results use the **same record-row component** as Records.
- No neon, photo tiles or standalone new visual language.
- Search by title, artist, album; clear button resets state; keyboard must not cover rows or bottom UI.

## Settings / playlist detail (secondary screens)
These are optional after the primary four reference screens pass screenshot QA. Reuse the exact paper, typography and row components. No new navigation pattern until justified.
