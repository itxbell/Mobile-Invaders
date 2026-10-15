# Session 2026-10-15 — iOS Home-Screen Icon

## Goal

Let iPhones add the game to the home screen with a proper ship icon + fullscreen launch, without going full PWA.

## Environment

| Item | Value |
|---|---|
| Live link | `https://itxbell.github.io/Mobile-Invaders/` |
| Icon source | `assets/images/ship.png` (52×32 custom guardian ship, 8-bit RGBA) |
| Icon output | `assets/icons/apple-touch-icon.png` (180×180, ship on `#03001d`) |

## Changes Made

### 1. Icon generation (one-off script, not committed)

Pure-Node script (no deps): decoded `ship.png` (inflate + unfilter), trimmed transparent border, nearest-neighbor upscale to fill ~168px box on `#03001d`, re-encoded PNG. Iterations: 2× (too small) → 3× → trimmed + fit (final, 1236 bytes).

### 2. `index.html` head additions

```html
<meta name="theme-color" content="#03001d">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Didymo Invaders">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
```

Vite rewrites the href to a hashed asset (`./assets/apple-touch-icon-<hash>.png`) — verified in `dist/index.html`. No manifest/SW; page still needs internet.

### 3. iPhone usage

Safari → link → Share → Add to Home Screen. Launches fullscreen (no Safari chrome), titled "Didymo Invaders".

## Issues Encountered

- **Icon not showing (×3) → root causes, in order:** (1) icon file pushed but `index.html` link edit still local; (2) `index.html` committed (`bec71a2`) but not pushed — remote stayed on `cf98d21`, no deploy ran (`git status: ahead 1`); (3) pushed + deployed green but iPhone showed stale bookmark — iOS caches touch icons hard. Fix sequence: delete icon → Clear History and Website Data → force-quit Safari → restart iPhone → fresh load → re-add. Worked.
- Verified server-side each time via Actions API + fetching live HTML + loading the icon URL directly (ship rendered).

## Verification

- `npm run build` → icon + tags in `dist/`, relative paths.
- Deploy run #3 (`bec71a2`) green; live HTML contains link; live icon URL returns the ship PNG.
- User confirmed ship icon on iPhone home screen.

## Commands Reference

```powershell
npm run build
git add index.html assets/icons; git commit -m "feat: iOS home-screen icon and fullscreen tags"; git push origin main
```

See also: [[29_Session_2026-10-15_GitHub_Pages_Plain_Link]], [[16_Running_in_Web_Browser]].
