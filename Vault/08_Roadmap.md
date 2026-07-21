# Roadmap

## Phase 1: Documentation & Foundation ✅

- [x] Set up Obsidian wiki
- [x] Document existing code architecture
- [x] Define mobile strategy (PWA → Capacitor)
- [x] Identify code bugs (`GameLevel2.js`, `GameLevel3.js` missing braces)

## Phase 2: PWA Setup

- [ ] Create `manifest.json` with app name, icons, orientation
- [ ] Create `sw.js` service worker with cache strategy
- [ ] Generate PWA icons (192×192, 512×512)
- [ ] Update `index.html` to link manifest & register SW
- [ ] Test install prompt on Android Chrome
- [ ] Test "Add to Home Screen" on iOS Safari
- [ ] Verify offline play works

## Phase 3: Touch Controls

- [ ] Design touch control layout
- [ ] Implement pointer-based ship movement
- [ ] Add fire button (or auto-fire)
- [ ] Test on iPhone
- [ ] Test on Android phone
- [ ] Ensure keyboard controls still work on desktop

## Phase 4: Responsive Scaling

- [ ] Change game resolution to landscape-friendly dimensions
- [ ] Switch `SHOW_ALL` → `FIT` scaling mode
- [ ] Convert hardcoded pixel positions to relative values
- [ ] Test on multiple device sizes (phone, tablet, desktop)
- [ ] Lock orientation to landscape in manifest

## Phase 5: Bug Fixes & Polish

- [ ] Fix `GameLevel2.js` missing closing brace in `invadersCount()`
- [ ] Fix `GameLevel3.js` same issue
- [ ] Compress/optimize images for mobile
- [ ] Test audio on iOS (MP3 compat)
- [ ] Test all 3 levels + fact cards on mobile
- [ ] End screen share buttons should work on mobile (native share API?)

## Phase 6: Capacitor Native Wrapper

- [ ] Install Capacitor CLI
- [ ] `npx cap init` in project
- [ ] `npx cap add android`
- [ ] `npx cap add ios` (requires macOS)
- [ ] Copy web build to native project
- [ ] Build Android APK (test on device)
- [ ] Set up iOS build via GitHub Actions (macOS runner)

## Phase 7: Distribution

- [ ] Deploy PWA on GitHub Pages
- [ ] Submit Android APK to Google Play
- [ ] Submit iOS IPA to App Store (requires Apple Developer account)

## Future Ideas (Backlog)

- High score leaderboard (Firebase?)
- More levels with different enemy types
- Sound effects for each weapon (currently share one SFX)
- Haptic feedback on mobile (Capacitor Haptics plugin)
- i18n / Māori language support
- Progressive difficulty (faster invaders, more rows)
