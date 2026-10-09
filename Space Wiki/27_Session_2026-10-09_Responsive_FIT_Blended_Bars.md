# Session 2026-10-09 — Responsive FIT + Blended Bars (Phones Portrait Only)

## Goal

Make resolution stay perfect on any phone model without rewriting layout: keep 540×960 logical canvas, switch scale mode back to `FIT`, blend letterbox bars with the game background.

## Decision

| Option | Result | Verdict |
|---|---|---|
| `EXACT_FIT` (current) | Fills 1080×2400 but ~12% vertical stretch | Rejected — distortion |
| `RESIZE` + ratio-ify all positions | True full-bleed, no bars, no stretch | Rejected — 8-file rewrite, see [[06_Responsive Scaling]] Phase 2 |
| **`FIT` + blended bars** | Perfect proportions, thin top/bottom bars tinted `#03001d` | **Chosen — phones portrait only** |

Scope: Android + iPhone portrait. Tablets / landscape / desktop resize out of scope (larger bars, still undistorted).

## Environment

| Item | Value |
|---|---|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` |
| Canvas | 540×960 portrait (`index.html:23`) |
| Current scale | `Phaser.ScaleManager.EXACT_FIT` (`src/Boot.js:14`) |
| Background | `#03001d` (`src/Boot.js:18`, `src/style.css:13`) |

## Changes To Make

### 1. Scale mode (`src/Boot.js:14-16`)

```javascript
// Before
this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

// After
this.scale.scaleMode = Phaser.ScaleManager.FIT;
this.scale.pageAlignHorizontally = true;
this.scale.pageAlignVertically = true;
```

Keep `this.input.maxPointers = 2`, `disableVisibilityChange = true`.

### 2. Bar blending (all must match `#03001d`)

- `src/Boot.js:18` — `this.stage.backgroundColor = '#03001d'` (keep)
- `src/style.css` — `body`, `#gameContainer`, `canvas` all `background: #03001d`
- `index.html:5` — viewport add `viewport-fit=cover`:
  `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover`
- `android/` — WebView / theme background `#03001d` (manifest already `portrait`-locked)

### 3. No gameplay changes needed

Logical world stays 540×960, so all existing values remain valid on every phone:

| Element | Value | Location |
|---|---|---|
| Invader grid | `20+j*100`, `80+i*55`, scale `0.7` | `src/Game.js:82,86` |
| Ship | `centerX, height-70`, scale `1.35` | `src/Game.js:140,146` |
| Bullets | player `-450`, invader `120`, cooldown 500/2000ms | `src/Game.js:231,259` |
| Invader tween | `width-100`, 3000ms, `flyDown +25` | `src/Game.js:101,216` |
| HUD / state text | 18px centered via `textWidth/2` | `src/Game.js:183-213` |
| Backgrounds | `width/height = world.width/height` | `src/Game.js:62-63`, `EndScene.js:6-8` |
| Fact cards | `width*0.9` proportional | `src/FactCards.js:8` |
| Title | contain `Math.min` scale 0.54× | `src/StartMenu.js:18` |

Touch `pointer1.x` (`src/Game.js:489-492`) maps to logical coords automatically under FIT.

## Why This Works

`FIT` preserves 9:16 aspect instead of stretching to 9:20. On 16:9 / 19.5:9 / 20:9 phones the game fills width, with ~0-120px total letterbox top+bottom at 1080p. Matching stage + CSS + native background color makes bars invisible.

## Verification

- `npm run dev` → Chrome F12 device toolbar: iPhone SE 375×667, iPhone 14 Pro 393×852, Android 360×640 / 360×800 — full-width, circles stay circular, HUD centered, no crop
- `npm run build; npx cap sync; cd android; .\gradlew assembleDebug; adb install -r app\build\outputs\apk\debug\app-debug.apk`
- `medium_phone` 1080×2400 emulator — dark bars only, `adb logcat | Select-String Uncaught` clean
- Landscape: side bars expected (portrait-only scope)

## Commands Reference

```powershell
npm run dev
npm run build; npx cap sync; cd android; .\gradlew assembleDebug; adb install -r app\build\outputs\apk\debug\app-debug.apk
adb logcat -c; adb shell am start -n org.wai.didymoinvaders/.MainActivity; adb logcat | Select-String "Uncaught"
```

## Git Status

Docs only — no code changed yet. Code change is `src/Boot.js:14` + CSS/viewport blend when implemented.

See also: [[06_Responsive Scaling]], [[08_Roadmap]] Phase 4, [[20_Session_2026-09-01_Fix_Background_Black_Space]]
