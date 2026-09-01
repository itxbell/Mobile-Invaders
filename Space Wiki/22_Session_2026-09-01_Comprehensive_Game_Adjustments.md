# Session 2026-09-01 — Comprehensive Game Adjustments

## Goal

Multiple gameplay and visual adjustments: fix missing bullet texture, adjust ship/invader sizing and speed, improve screen scaling, remove dock sprite, document web browser workflow.

## Environment

| Item | Value |
|------|-------|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` |
| Original game | `C:\Users\ina25\OneDrive\Documents\GitHub\Space-Invaders-Aquatic-Pests` |
| Dev server | `npm run dev` → `http://localhost:5173` |

## Changes Made

### 1. Fix Missing Bullet Texture (`src/Preloader.js:18`)

**Problem:** Game tried to create bullets with texture `'bullet'` but it was never loaded — causing a runtime error that prevented the ship from rendering.

```javascript
// Added missing bullet load
this.load.image('bullet', 'assets/images/cleanBlaster.png');
```

### 2. Ship Position & Scale (`src/Game.js:132-140`)

| Setting | Before | After |
|---------|--------|-------|
| Y position | `height - 80` | `height - 70` |
| Scale | 1.8× | 1.35× |
| `bringToTop()` | not set | added |

The ship is now positioned at `world.height - 70` (Y=890) with scale 1.35× (~70×43 px).

### 3. Invader Scale (`src/Game.js:78`)

| Before | After |
|--------|-------|
| 0.5× | 0.7× |

Invaders are now ~45px wide, proportional to the ship.

### 4. Invader Speed (`src/Game.js:93`)

| Before | After |
|--------|-------|
| 2000ms per cycle | 3000ms per cycle |

Invaders move 33% slower horizontally.

### 5. Scale Mode (`src/Boot.js:14`)

| Before | After |
|--------|-------|
| `Phaser.ScaleManager.FIT` | `Phaser.ScaleManager.EXACT_FIT` |

Eliminates black bars on non-9:16 screens.

### 6. StartMenu Background (`src/StartMenu.js:10-11`)

| Before | After |
|--------|-------|
| `width * 0.9`, `height * 0.9` | `width`, `height` |

Title background now fills the entire canvas edge-to-edge.

### 7. Dock Sprite Removed (`src/Game.js:132`)

Removed `this.add.sprite(this.world.centerX - 60, this.world.height - 100, 'dock')` — the dark rectangle behind the ship.

### 8. Ship Asset Investigation

Compared repos — original game has corrupted ship (756 bytes), Mobile-Invaders has working ship (15,056 bytes, 52×32 white retro sprite).

### 9. Wiki Documentation

Created:
- `15_Session_2026-09-01_Replace_Ship_Assets.md`
- `16_Running_in_Web_Browser.md`
- `17_Session_2026-09-01_Ship_Asset_Investigation.md`

## Current Game Settings Summary

| Element | Setting | Location |
|---------|---------|----------|
| Ship position | `centerX, height - 70` | `Game.js:132` |
| Ship scale | 1.35× | `Game.js:138` |
| Invader scale | 0.7× | `Game.js:78` |
| Invader speed | 3000ms cycle | `Game.js:93` |
| Scale mode | EXACT_FIT | `Boot.js:14` |
| Bullet texture | cleanBlaster.png | `Preloader.js:18` |

## Commands Reference

```powershell
# Dev server
npm run dev

# Build for Android
npm run build; npx cap sync; cd android; .\gradlew assembleDebug; adb install -r app\build\outputs\apk\debug\app-debug.apk
```

## Git Status

Changes across: `src/Preloader.js`, `src/Game.js`, `src/Boot.js`, `src/StartMenu.js`
