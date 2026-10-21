# P13.1 Native Equalizer Hardening Report

Date: 2026-10-16 (Asia/Phnom_Penh)

**Status: source hardening and dependency/native-generation reproducibility verified; P13.1 native/device acceptance remains incomplete.** No repository publishing, EAS build, physical-phone operation, or P14 work was performed.

## ORIGINAL_INTEGRATION_RISKS

Git audit (`git status --short --ignored`, `git ls-files`, `git check-ignore -v`) found:

| Audited paths | Original Git state | Consequence |
| --- | --- | --- |
| `android/app/src/main/java/com/devqii/groove66/equalizer/GrooveEqualizerModule.kt`, `GrooveEqualizerPackage.kt` | Ignored by `/android` | Neither source survives a clone/EAS CNG generation |
| `android/app/src/main/java/com/devqii/groove66/MainApplication.kt` | Ignored | Manual ReactPackage registration disappears |
| All Android build configuration | Ignored | Local-only JDK paths/settings do not reach EAS |
| `node_modules/expo-audio/android/`, `src/`, `build/` | Ignored by `node_modules/` | Hand edits disappear after npm ci |
| `src/services/equalizer/{EqualizerService,EqualizerPresets,equalizerTypes,index}.ts` | Untracked | Equalizer service absent from a fresh clone |
| `src/context/EqualizerContext.tsx`, equalizer UI, `src/services/audio/` | Untracked | Runtime prerequisites absent from a fresh clone |
| `.gitignore`, `app.json`, `package.json`, `package-lock.json` | Tracked with working changes | Existing HEAD did not represent the completed P13 environment |

Pristine `expo-audio@57.0.5` was downloaded from npm and compared recursively. Original dependency-only edits were:

1. `android/src/main/java/expo/modules/audio/AudioModule.kt`: new player `audioSessionId` property.
2. `android/src/main/java/expo/modules/audio/AudioPlayer.kt`: session ID in status map.
3. `src/AudioModule.types.ts`: optional player session property.
4. `build/AudioModule.types.d.ts`: optional player session declaration.
5. `build/Audio.types.d.ts`: optional playback-status session declaration.

The source `src/Audio.types.ts` was missing the corresponding status declaration; the maintained patch now includes it, for six files total. No other original changes were found under the compared Expo Audio `android`, `src`, or `build` trees.

Non-build-output Android comparison against independently generated CNG output found only the equalizer source/registration differences, local IDE files, `local.properties`, generated `gradle/gradle-daemon-jvm.properties` (JDK 17 download URLs), host-specific `gradle.properties` settings (Java/Node absolute paths and tooling flags), and whitespace in `settings.gradle`. Manifest, app Gradle configuration, other native sources and resource files matched. Host-specific settings are intentionally not promoted to CNG customizations. Original generated native files and audio files were not deleted or regenerated.

Other confirmed defects: missing native module falsely set `isAttached=true`; overlapping asynchronous sessions could overwrite each other; native failure maps were ignored; actual frequency centers/ranges were not consumed; effects lacked invalidation cleanup; narrowing before clamping could overflow; reflection targeted an unsupported private/static player registry; removed player events could reattach old sessions; a pre-attachment enable change could overwrite saved custom frequency mappings.

## BUILD_STRATEGY

**Expo Continuous Native Generation only.** `android/` and `ios/` remain ignored. No native-project tracking strategy was introduced. Default EAS upload uses `.gitignore` (no `.easignore` exists), so generated Android is excluded and EAS must prebuild.

`app.json` registers `./plugins/withGrooveEqualizer.cjs`. The plugin copies maintained Kotlin sources and adds exactly one package registration to MainApplication. Unsupported package/template/language changes fail explicitly. It neither deletes native source nor relies on reflection. Existing local generated sources remain unchanged; a future native build must run the plugin via the reviewed CNG workflow.

## EXPO_AUDIO_PATCH_STRATEGY

`expo-audio` is pinned to **57.0.5** in package.json and package-lock.json. Root postinstall runs `node scripts/patch-expo-audio.cjs`.

- Patch: `patches/expo-audio+57.0.5.patch`.
- Before/after SHA-256 manifest: `patches/expo-audio+57.0.5.json`.
- Exact upstream version and all original hashes must match before applying.
- Fully patched files are verified idempotently.
- Partial modifications, unknown edits and version drift abort installation.
- Git must be available and npm install scripts must be enabled.
- Upgrades require deliberate pristine-package comparison and patch refresh.

The patch exposes ExoPlayer's actual session without changing playback algorithms. TypeScript source and published declarations agree. It does not provide DSP-output evidence.

## NATIVE_FILES_VERSION_CONTROLLED

Added to the main repository Git index (no commit or push):

- `native/equalizer/GrooveEqualizerModule.kt`
- `native/equalizer/GrooveEqualizerPackage.kt`
- `plugins/withGrooveEqualizer.cjs`
- `scripts/patch-expo-audio.cjs`
- `patches/expo-audio+57.0.5.patch`
- `patches/expo-audio+57.0.5.json`

Previously untracked equalizer/player sources, their existing runtime dependencies under src, required icon assets, and scratch tests were also added to the index without unrelated code edits. Tracked package/config/application changes remain reviewable working-tree changes. A literal clone of the old HEAD still predates this work: the complete reviewed working-tree changes must be committed together before a fresh repository clone can carry them. No commit was created on the user's behalf.

## CLEAN_BUILD_REPRODUCIBILITY

**PASS at dependency installation and native-generation layers; compile/APK layers NOT_RUN.**

A disposable source snapshot at `/tmp/groove66-p13-1-repro` excluded existing native directories, node_modules and private music. It included pending application prerequisites, so this is a clean working-tree snapshot test, not a clone of the old HEAD.

1. `npm ci --prefix /tmp/groove66-p13-1-repro --cache /tmp/groove66-npm-cache --no-audit --no-fund`: PASS; 527 packages installed, postinstall applied/verified patch.
2. `npm run typecheck` in the isolated installed snapshot: PASS.
3. `npx expo prebuild --platform android --no-install` in the disposable copy: PASS, run twice; generated native tree recreated in the disposable copy only.
4. Generated Kotlin files match maintained sources byte-for-byte; MainApplication contains one registration.
5. `node scripts/patch-expo-audio.cjs` in the copy: PASS, already patched and verified.
6. Automated pristine/reverse-patch test: PASS; apply, repeat, and reject deliberate unknown edits.

Generated source SHA-256:

- Module: `7251260798e061dfd705033cf91ba40dc462d966a833b4e8e092e8e65c2fc1f7`
- Package: `2e40e253a606e6cfbff24690647f07c6cb7fb6beee71e758fa557a6ce6dc9e48`

Initial sandbox attempts encountered DNS/ADB/subprocess restrictions; reruns with access succeeded. Those initial failures are not native compiler evidence.

## AUDIO_SESSION_VERIFICATION

Source tracing confirms `ref.audioSessionId` from Expo Audio's actual ExoPlayer reaches the equalizer. Production TypeScript tests mock only platform boundaries; their results are not Android runtime measurements.

| Scenario | Automated/source result | Live Android result |
| --- | --- | --- |
| Initial player and session availability | Production player status forwarding PASS | NOT_RUN |
| Initial settings hydration | Attachment waits for restored state PASS | NOT_RUN |
| Playback initialization | Production player creation/event flow PASS | NOT_RUN |
| Track changes/player recreation | Detach and new-session flow PASS | NOT_RUN |
| Queue advance/repeat/shuffle | Existing model tests PASS; invokes same player load path | NOT_RUN |
| Late events from disposed players | Guard regression PASS | NOT_RUN |
| Pause | Retains active effect session PASS | NOT_RUN |
| Interruption/session loss | Zero-session detach PASS; real focus interruption untested | NOT_RUN |
| Enable/disable and native failures | Serialized commands/error handling PASS | NOT_RUN |
| Pending attach followed by release | Revision/cancellation regression PASS | NOT_RUN |
| Native invalidation cleanup | Implemented/source-inspected; uncompiled | NOT_RUN |
| App restart/custom state | Restored frequency-keyed settings PASS | NOT_RUN |

Native resources release on replacement, attach failure, explicit release, and React Native invalidation. Numeric gain clamping occurs before Short conversion. Unsupported native behavior resolves/rejects within the equalizer service and does not propagate into ordinary playback control. Native exceptions and real focus-loss behavior remain device acceptance items.

## DSP_OUTPUT_VERIFICATION

Evidence levels remain separate:

1. **Native initialization:** construction path preserved/generated; new Kotlin not compiled or run.
2. **Actual session attachment:** source data path and mocked lifecycle verified; live attachment NOT_RUN.
3. **Band parameters:** native getters query real centers/range/levels; JS uses these capabilities and checks mutation failure responses. Real parameter readback NOT_RUN.
4. **Processed audio output:** NOT_MEASURED. No connected emulator/output capture was available. No acoustic change, latency, glitch-free transition, or hardware acceleration claim is made.

For follow-up measurement, use an owned/generated low-level multi-tone or swept sine, compare bypass/flat/boost on the same route, and capture at a verified post-effect point or external loopback. Compare spectral gain with identical capture levels and inspect clipping. Pre-effect samples, slider positions, API success and screenshots do not substitute for processed-output measurement.

Reference five-band preset points remain a design curve, not a device capability assumption. Native bands/ranges drive the UI; presets interpolate by log frequency. Matching custom frequencies restore across sessions; unmatched custom frequencies on different hardware fall back to flat.

## ANDROID_BUILD

- TypeScript: PASS (working project and clean-install snapshot).
- Android CNG generation: PASS, twice in disposable copy.
- Kotlin compilation: NOT_RUN.
- APK generation: NOT_RUN.
- EAS Android build: NOT_RUN.

Machine protection prevented heavy builds: host snapshots showed roughly 3.4–3.8 GiB available RAM with swap increasing to 3.5/4 GiB used. `/tmp` is tmpfs, so the isolated dependency test also consumes memory. No Gradle, emulator, Android Studio, Metro or EAS process was started. No Gradle stop was needed because no Gradle build ran. A final snapshot showed swap essentially full; the disposable install's node_modules and this audit's npm cache (about 537 MiB combined) were removed to relieve tmpfs pressure. Source/config/generated-native evidence and logs remain; the original project dependencies were preserved.

`npx expo install --check`: FAIL on recommended patch-version mismatches.
`npx expo-doctor`: **20/21**, same dependency-version check failure:

| Package | Installed | Expected |
| --- | --- | --- |
| @expo/metro-runtime | 57.0.16 | ~57.0.17 |
| expo | 57.0.28 | ~57.0.30 |
| expo-asset | 57.0.19 | ~57.0.20 |
| expo-constants | 57.0.21 | ~57.0.22 |

These were reported rather than suppressed or broadened into an SDK upgrade. Prebuild additionally warned that expo-system-ui is absent for native userInterfaceStyle handling. npm reported an upstream uuid@7 deprecation. Neither warning proves a playback failure.

## EMULATOR_TEST

`adb devices -l`: no devices attached, including after access was restored. `emulator-5554` was unavailable. No emulator was started; no OPPO device command was issued. Installation/module exposure, startup, meminfo, logcat, screenshots and all live regression flows are NOT_RUN.

## REGRESSION_TESTS

All **12** `scratch/test_*.js` scripts pass in the final working-tree run:

- test_audio_engine.js — 11 model scenarios, including import, transport, seek, queue, shuffle/repeat and restore.
- test_audio_equalizer_session.js — executes production player with mocked Expo boundary.
- test_equalizer.js — 59 legacy math/source/model assertions; does not prove native DSP.
- test_equalizer_lifecycle.js — executes production service with mocked native/storage boundaries.
- test_native_reproducibility.js — real Git patch application and template registration checks.
- test_id3_parser.js, test_music_library.js — metadata/Khmer/library test coverage.
- test_performance.js, test_search.js, test_search_storage.js, test_state_integration.js, test_theme.js.

The original audio-engine test failed restart persistence because its mock used Date.now alone for imported IDs; two imports within one millisecond collided and removal erased the first fixture. Production importer already includes index/random components. The test fixture now uses deterministic unique IDs; its misleading unconditional “100% PASS” summary and zero exit on assertion failure were corrected. Initial failure is recorded, not treated as a product persistence failure or hidden.

The seven imported songs, audible MP3 playback, Mini Player, Now Playing, presets/sliders, app restart and Record Shop/Night Drive themes still require live acceptance on the rebuilt binary. No new visual reference comparison was run. Test logs/results were retained at `/tmp/groove66-p13-1-tests.log` and `/tmp/groove66-p13-1-test-results.json`.

## FILES_CHANGED

P13.1 implementation/documentation:

- `.gitignore`, `app.json`, `package.json`, `package-lock.json`
- `native/equalizer/GrooveEqualizerModule.kt`, `GrooveEqualizerPackage.kt`
- `plugins/withGrooveEqualizer.cjs`, `scripts/patch-expo-audio.cjs`
- `patches/expo-audio+57.0.5.patch`, `patches/expo-audio+57.0.5.json`
- `src/services/equalizer/EqualizerService.ts`, `equalizerTypes.ts`
- `src/services/audio/AudioPlayer.ts`, `src/services/audioEngine.ts`
- `src/components/equalizer/VintageSliderBand.tsx`, `VintageEqualizerModal.tsx`
- `scratch/test_audio_engine.js`, `test_audio_equalizer_session.js`, `test_equalizer_lifecycle.js`, `test_native_reproducibility.js`
- `CURRENT_STATE.md`, `IMPLEMENTATION_PLAN.md`, `docs/engineering/ARCHITECTURE.md`
- `docs/superpowers/plans/2026-10-16-p13-1.md`, this report

Existing untracked runtime prerequisites and icon assets were staged unchanged to make the pending application snapshot reviewable. Existing user edits elsewhere were preserved. Expo Audio installed files are derived from the maintained patch; generated working Android files were untouched.

## REMAINING_RISKS

- P13.1 is not complete until Kotlin/APK and rebuilt-device acceptance pass.
- Old HEAD does not include pending application changes; commit the complete reviewed snapshot before expecting a fresh Git clone to reproduce it.
- Installed app/ignored local native source may still represent original P13; generation and rebuilding are required before claiming the hardened module is installed.
- Expo Audio patch is intentionally version-specific; scripts/Git availability are installation prerequisites.
- Native band counts/layout and preset interpolation need visual/listening checks on devices.
- Persistence debounce is 300 ms; abrupt termination inside that window can lose the latest edit.
- Real interruptions, effect control contention, OEM effect support and native failure isolation remain unmeasured.
- Recommended dependency patch updates and expo-system-ui warning remain open.
- Actual processed output and hardware acceleration remain unverified.
- Next work is P13.1 native/device acceptance, not P14 or publication.
