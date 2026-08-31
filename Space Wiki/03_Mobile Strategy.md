# Mobile Strategy

## Approach: PWA First → Capacitor Later

Since there's **no macOS machine** for native iOS builds, we use a **two-phase approach**:

### Phase 1: Progressive Web App (PWA)

**What**: The web game becomes installable on phone home screens with offline support.

**Why PWA first**:
- ✅ Works on **both Android and iOS** today
- ✅ No Mac required
- ✅ No app store review process
- ✅ Installable via "Add to Home Screen" on both platforms
- ✅ Offline play via service worker caching
- ✅ Can be served from GitHub Pages for free

**PWA limitations**:
- ❌ No App Store / Play Store presence
- ❌ Limited iOS support (Safari restricts some PWA features)
- ❌ No native push notifications (not needed for a game)
- ❌ No in-app purchases (not needed)

### Phase 2: Capacitor Native Wrapper (Future)

**What**: Wrap the built web app in Capacitor to produce real Android APK and iOS IPA.

**Why Capacitor later**:
- ✅ Full native API access (haptics, filesystem, sensors)
- ✅ Distribute on Google Play and App Store
- ✅ Minimal code changes (same web codebase)
- ✅ Reuse all Phaser game logic

**Requires for iOS builds**: A Mac (physical or cloud CI like GitHub Actions with macOS runner)

---

## PWA Setup Checklist

- [x] Vite build pipeline (exists)
- [ ] `manifest.json` — app name, icons, theme color, orientation lock
- [ ] `sw.js` — service worker for offline cache
- [ ] PWA icons — 192×192, 512×512 PNGs
- [ ] Update `index.html` — link manifest, register service worker
- [ ] `vite.config.js` — ensure `base: './'` (done)
- [ ] Orientation lock to landscape in manifest
- [ ] Update `Boot.js` — adjust scaling for mobile viewports

## Touch Controls

See [[05_Touch Controls]] for the touch UI design.

## Responsive Scaling

See [[06_Responsive Scaling]] for adapting the 1000×1000 game to phone screens.

## Build & Deploy

```bash
# Development
npm run dev

# Production build (output goes to dist/)
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run build
# Push the dist/ folder to gh-pages branch
```

## Publishing Timeline

| Phase | What | When |
|---|---|---|
| 1 | PWA working on Android Chrome | Now |
| 1 | PWA working on iOS Safari | Now |
| 2 | Android APK via Capacitor | Future |
| 3 | iOS IPA via Capacitor + macOS CI | Future |
