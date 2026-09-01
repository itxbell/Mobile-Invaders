# Session 2026-09-01 — Fix Background Black Space & Screen Scaling

## Goal

Diagnose and resolve the black space appearing at the bottom and borders of the game background.

## Root Causes Identified

1. **Scale Mode in `src/Boot.js:14` was set to `FIT`:**
   - With `Phaser.ScaleManager.FIT`, Phaser preserves the strict 9:16 aspect ratio (540×960). On modern tall phone screens (e.g., 9:20 / 1080×2400) or browser windows, the height does not fill the screen container, producing black bars/letterboxing at the top/bottom.
2. **StartMenu Background Scaling in `src/StartMenu.js:10-11`:**
   - `startBG.width` and `startBG.height` were set to `0.9` (90% width/height), creating a 5% black gap around the perimeter of the title screen.

## Changes Made

### 1. Switched Scale Mode to `EXACT_FIT` (`src/Boot.js:14`)

```javascript
// Before
this.scale.scaleMode = Phaser.ScaleManager.FIT;

// After
this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
```

- Forces the canvas to fill the full viewport (100vw × 100vh) seamlessly without black bars on any aspect ratio.

### 2. Full Background Scaling on Title Screen (`src/StartMenu.js:10-11`)

```javascript
// Before
startBG.width = this.world.width * 0.9;
startBG.height = this.world.height * 0.9;

// After
startBG.width = this.world.width;
startBG.height = this.world.height;
```

- Title background now fills the entire canvas edge-to-edge.

## Verification

- Web build passed: `npm run build`
- Synced native Android assets: `npx cap sync`

## Commands Reference

```powershell
npm run build
npx cap sync
```
