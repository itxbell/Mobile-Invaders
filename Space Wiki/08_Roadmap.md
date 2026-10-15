# Roadmap

## Phase 1: Documentation & Foundation ✅

- [x] Set up Obsidian wiki
- [x] Document existing code architecture
- [x] Define mobile strategy (PWA → Capacitor)
- [x] Identify code bugs (`GameLevel2.js`, `GameLevel3.js` missing braces)

## Phase 2: PWA Setup ⏸️

Skipped — went directly to Capacitor native (Phase 6) since PWA is not needed.

- [ ] Create `manifest.json` with app name, icons, orientation
- [ ] Create `sw.js` service worker with cache strategy
- [ ] Generate PWA icons (192×192, 512×512)
- [ ] Update `index.html` to link manifest & register SW
- [ ] Test install prompt on Android Chrome
- [ ] Test "Add to Home Screen" on iOS Safari
- [ ] Verify offline play works

## Phase 3: Touch Controls ✅

- [x] Implement pointer-based ship movement (follows finger X)
- [x] Add auto-fire while touching (500ms cooldown)
- [x] Set `maxPointers = 2` in Boot.js
- [x] CSS: `touch-action: none`, `user-select: none`
- [x] Test on Android emulator
- [x] Keyboard controls still work on desktop

## Phase 4: Responsive Scaling ✅

- [x] Change game resolution to portrait (540×960)
- [x] Switch `SHOW_ALL` → `FIT` scaling mode
- [x] Portrait-specific invader grid (5 cols × 7 rows, 50% scale, 100px×55px spacing)
- [x] Adjust ship position (`world.height - 80`)
- [x] Scale all backgrounds to fill canvas
- [x] Scale fact cards to fit portrait width
- [x] Proper stateText centering (`textWidth / 2`)
- [x] Faster bullet velocity (`-450`) for taller playfield
- [x] Viewport meta tag for mobile
- [x] Lock orientation to portrait in AndroidManifest

## Phase 5: Bug Fixes & Polish ✅

- [x] Fix `GameLevel2.js` missing closing brace in `invadersCount()`
- [x] Fix `GameLevel3.js` same issue
- [x] Implement pause/resume button (all 3 levels) — see [[23_Pause_Resume_Guide]]
- [x] Fix EndScene text overflow (BitmapText wordWrap inert in Phaser 2)
- [x] Fix pause freeze: tweens + physics (`body.moves`) + flap (`currentAnim.paused`) — see [[26_Session_2026-09-30_Pause_Freeze_Fix]]
- [ ] Compress/optimize images for mobile
- [ ] Test audio on iOS (MP3 compat)
- [ ] Test all 3 levels + fact cards on mobile
- [ ] End screen share buttons should work on mobile (native share API?)

## Phase 6: Capacitor Native Wrapper ✅

See [[10_Capacitor_APK]] for the full step-by-step guide.

- [x] Install Capacitor CLI (`npm i @capacitor/core @capacitor/cli @capacitor/android`)
- [x] `npx cap init` — App: "Space Invaders Aquatic Pests", ID: "org.wai.didymoinvaders"
- [x] `npx cap add android`
- [x] Add `vite-plugin-static-copy` to copy src/ + assets/ into dist/
- [x] Build APK (`.\gradlew assembleDebug`)
- [x] Install & run on emulator
- [ ] Add iOS via GitHub Actions (requires macOS)

## Phase 7: Distribution

- [ ] Submit Android APK to Google Play
- [ ] Submit iOS IPA to App Store (requires Apple Developer account)

## Remaining TODOs

- [x] Choose screen fitting strategy for 1080×2400 displays → switched to EXACT_FIT
- [x] Switch `EXACT_FIT` → `FIT` + blend bars `#03001d` (phones portrait only) — see [[27_Session_2026-10-09_Responsive_FIT_Blended_Bars]], implemented [[28_Session_2026-10-12_FIT_Blended_Bars_Implementation]]
- [ ] Compress images for smaller APK size
- [ ] Add splash screen and adaptive icon (Capacitor SplashScreen + Icon plugins)
- [ ] Test on real Android phone
- [ ] Transition info screens (fact cards, start menu, end) to use relative positioning

## Future Ideas (Backlog)

- High score leaderboard (Firebase?)
- More levels with different enemy types
- Sound effects for each weapon (currently share one SFX)
- Haptic feedback on mobile (Capacitor Haptics plugin)
- i18n / Māori language support
- Progressive difficulty (faster invaders, more rows)
