# Session 2026-09-01 — Scale Down Ship Asset

## Goal

Scale down the ship sprite in `src/Game.js` to a compact 0.75× scale (39×24 px) to match the proportions of the ~45px invader sprites and portrait layout.

## Environment

| Item | Value |
|---|---|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` |
| Ship sprite dimensions | 52×32 px (RGBA PNG) |
| Invader scale | 0.7× (~45px visual width) |

## Changes Made

### 1. Ship Scaling (`src/Game.js:140`)

Scaled down `this.ship.scale` from `(3.5, 3.5)` to `(0.75, 0.75)`:

```javascript
// Before
this.ship.scale.setTo(3.5, 3.5); // 182 × 112 px (33% canvas width)

// After
this.ship.scale.setTo(0.75, 0.75); // 39 × 24 px
```

### 2. Ship & Dock Vertical Position & Visibility (`src/Game.js:132-143`)

Positioned the ship safely above the bottom screen margin/navigation bar with guaranteed top rendering:

```javascript
// Before
this.add.sprite(this.world.centerX - 60, this.world.height - 110, 'dock');
this.ship = this.add.sprite(this.world.centerX, this.world.height - 150, 'ship');

// After
this.add.sprite(this.world.centerX - 60, this.world.height - 100, 'dock');
this.ship = this.add.sprite(this.world.centerX, this.world.height - 70, 'ship');
this.ship.scale.setTo(1.0, 1.0);
this.ship.bringToTop();
```

- Positioned at `world.height - 70` (Y = 890), clearly above mobile navigation bars/gesture indicators.
- Set to crisp 1.0× scale (52×32 px) and called `this.ship.bringToTop()` to guarantee unobstructed visibility above the dock and background.
- Level 2 and Level 3 automatically inherit this position and scale from `SpaceInvaders.Game.prototype`.

## Verification

- Built web bundle: `npm run build` (success)
- Synchronized Capacitor: `npx cap sync` (web assets copied to `android/app/src/main/assets/public`)

## Commands Reference

```powershell
npm run build
npx cap sync
```
