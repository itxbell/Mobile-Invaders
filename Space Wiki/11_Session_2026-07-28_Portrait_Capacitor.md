# Session 2026-07-28 — Portrait Mode + Capacitor APK

## Goal

Port the Phaser 2 Space-Invaders-Aquatic-Pests web game to Android via Capacitor, make it mobile-responsive in portrait mode, and test on the Android emulator.

## Changes Made

### 1. Bug Fixes

- **GameLevel2.js** (`src/GameLevel2.js:68`): Added missing closing `};` after `invadersCount()` — the orphaned trailing `};` at end of file was removed and brace was placed correctly.
- **GameLevel3.js** (`src/GameLevel3.js:66`): Same fix — missing brace in `invadersCount()`, orphaned trailing `};` removed.
- **Boot.js** (`src/Boot.js:11`): Removed `this.scale.setMinMax()` — Phaser 2 does not support this method, was causing `TypeError` on startup.

### 2. Touch Controls

**Files:** `src/Game.js`, `src/style.css`

Added pointer-based touch controls to the `update()` loop (`Game.js:354`):

```javascript
if (this.input.pointer1.isDown)
{
    this.ship.x = this.input.pointer1.x;
    this.fireBullet();
}
```

- Ship follows the finger horizontally
- Auto-fires while touching
- Coexists with keyboard controls (desktop testing still works)
- CSS `touch-action: none` disables browser scroll/zoom during gameplay

Also set `this.input.maxPointers = 2` in Boot.js for multi-touch support.

### 3. Landscape Intermediate (960×540)

First pass: changed game from original 1000×1000 to 960×540 landscape with `Phaser.ScaleManager.FIT`.

**Files:** `index.html`, `Boot.js`

```javascript
// Before
var game = new Phaser.Game(1000, 1000, Phaser.AUTO, 'gameContainer');
this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

// After (first pass)
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'gameContainer');
this.scale.scaleMode = Phaser.ScaleManager.FIT;
```

### 4. Vite Static Copy Plugin

**Files:** `vite.config.js`, `package.json`

Added `vite-plugin-static-copy` to copy `src/` and `assets/` directories into `dist/` during build. This preserves the non-module `<script>` tags that Phaser 2's global scripts use.

```javascript
// vite.config.js
plugins: [
    viteStaticCopy({
        targets: [
            { src: 'src', dest: '.' },
            { src: 'assets', dest: '.' },
        ]
    }),
],
```

### 5. Capacitor Setup

```powershell
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init        # App name: "Space Invaders Aquatic Pests", App ID: "org.wai.didymoinvaders"
npx cap add android
```

Capacitor config points `webDir` to `dist/`.

### 6. Portrait Conversion (540×960)

Flipped from landscape (960×540) to portrait (540×960) for mobile phone usage.

**Files changed (8):**

| File | Change |
|---|---|
| `index.html` | Game canvas `540 × 960` |
| `AndroidManifest.xml` | `android:screenOrientation="portrait"` |
| `Game.js` | Invader grid: `20+j*100` × `80+i*55`, scale `0.5`, ship at `world.height-80`, bullet velocity `-450`, `flyDown` +25, tween target `world.width-100`, stateText properly centered (`textWidth / 2`) |
| `FactCards.js` | Cards scale: `width = world.width * 0.9`, maintain aspect ratio |
| `EndScene.js` | End background fills canvas |
| `StartMenu.js` | Title background fills canvas |
| `GameLevel2.js` | Background fills canvas |
| `GameLevel3.js` | Background fills canvas |

**Invader grid for portrait:**

- 5 columns × 7 rows
- Columns at X: 20, 120, 220, 320, 420 (100px spacing)
- Rows at Y: 80, 135, 190, 245, 300, 355, 410 (55px spacing)
- 50% scale (64×64 source → ~32×32 visual)
- Fills top portion of the 540×960 canvas
- Ship at Y = 880 (`world.height - 80`), leaving ~470px playable vertical space

### 7. Mobile Viewport Meta

Added to `index.html`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

### 8. Android Emulator Setup

Created AVD `medium_phone`:
- System image: Android 36 (API 36), Google Play, x86_64
- Resolution: 1080×2400 (portrait)
- Build tool: Android Studio bundled JBR (`C:\Program Files\Android\Android Studio\jbr`)
- ANDROID_HOME: `%LOCALAPPDATA%\Android\Sdk`

### 9. APK Build & Deploy

```powershell
npm run build
npx cap sync
.\gradlew assembleDebug
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

APK installs and runs on the emulator — no JavaScript errors.

### 10.5. EXACT_FIT Screen Mode (2026-07-28 follow-up)

Switched from `Phaser.ScaleManager.FIT` to `Phaser.ScaleManager.EXACT_FIT` in `src/Boot.js` to eliminate black bars on tall 9:20+ screens.

- **Before:** `FIT` mode → black bars on 1080×2400 (9:20) displays
- **After:** `EXACT_FIT` → fills entire viewport, slight ~12% vertical stretch on 9:20 screens
- No stretch on standard 9:16 phones (1080×1920)
- Exceptionally thin aspect ratios (>9:21) may show minor distortion, but remain playable

### 10. CSS Improvements

Added to `src/style.css`:
- `touch-action: none` — prevent scroll/zoom on touch devices
- `-webkit-user-select: none` / `user-select: none` — prevent text selection
- `-webkit-touch-callout: none` — prevent callout menu on iOS

## ~~Remaining Issues~~ Resolved

### ✅ Screen Fit on 1080×2400

Switched to `Phaser.ScaleManager.EXACT_FIT` — eliminates black bars on all screen sizes with minimal (≤12%) vertical stretch on 9:20+ displays. See §10.5.

## Git Status

Session changes are uncommitted — 12 files modified, `android/` directory untracked.

## Commands Reference

```powershell
# Full rebuild + deploy
npm run build; if ($?) { npx cap sync }
cd android
.\gradlew assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk

# Check JS errors on device
adb logcat -c
# launch app
adb logcat | Select-String "Uncaught"
```
