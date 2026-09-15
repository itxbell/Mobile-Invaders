# Session 2026-09-15 — Title Screen Background Fixes

## Goal

Fix the title screen background: remove stretching, match background color to image, add blue bar below image.

## Environment

| Item | Value |
|------|-------|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` |
| Dev server | `npm run dev` → `http://localhost:5173` |
| Title image | `assets/images/TitleBG1.jpg` (1000×1000, square) |
| Canvas | 540×960 (portrait 9:16) |

## Changes Made

### 1. Title Image Scaling (`src/StartMenu.js:10-11`)

The image was forced to fill the canvas with `width = world.width; height = world.height`, stretching the 1000×1000 square to 540×960.

Changed to proportional scaling with `Math.min` (contain mode):

```javascript
// Before
startBG.width = this.world.width;
startBG.height = this.world.height;

// After
var scale = Math.min(this.world.width / startBG.width, this.world.height / startBG.height);
startBG.scale.setTo(scale, scale);
```

Result: Image scales to 0.54 (540×540), centered in 540×960 canvas. No stretching, no cropping. Top/bottom show background color.

### 2. Background Color (`src/style.css:13`, `src/Boot.js:18`)

Changed from black to dark navy to match the image's space background:

```css
/* style.css — Before */
background-color: #000;

/* style.css — After */
background-color: #0d0d2b;
```

```javascript
// Boot.js — Before
this.stage.backgroundColor = '#171642';

// Boot.js — After
this.stage.backgroundColor = '#03001d';
```

Final color: `#03001d` (very dark navy).

### 3. Bottom Blue Bar (`src/StartMenu.js:8-14`)

Added a blue rectangle behind the title image to fill the empty space below:

```javascript
var bottomBar = this.add.graphics();
bottomBar.beginFill(0x1e61c6);
var imgScale = Math.min(this.world.width / 1000, this.world.height / 1000);
var imgBottom = this.world.centerY + (1000 * imgScale) / 2;
bottomBar.drawRect(0, imgBottom, this.world.width, this.world.height - imgBottom);
bottomBar.endFill();
```

Color: `#1e61c6` (medium blue). Starts exactly where the image ends (y=750), fills to bottom (y=960).

## Verification

- `npm run dev` — title screen renders with no stretching, dark navy top, blue bottom
- No JS errors in browser console

## Current Title Screen Settings

| Element | Value | Location |
|---------|-------|----------|
| Image scale | 0.54× (Math.min contain) | `StartMenu.js:18` |
| Image position | Centered (centerX, centerY) | `StartMenu.js:16` |
| Body background | #03001d | `style.css:13` |
| Stage background | #03001d | `Boot.js:18` |
| Bottom bar color | #1e61c6 | `StartMenu.js:10` |

## Commands Reference

```powershell
# Dev server
npm run dev
```
