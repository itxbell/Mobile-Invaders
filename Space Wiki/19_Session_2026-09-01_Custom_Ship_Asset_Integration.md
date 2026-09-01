# Session 2026-09-01 — Custom Ship Asset Integration

## Goal

Replace the retro white ship sprite with the custom colored guardian ship asset (yellow/orange wings, blue cockpit/body, orange thruster flames) provided by the user.

## Environment

| Item | Value |
|---|---|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` |
| Ship asset path | `assets/images/ship.png` |
| Dimensions | 52 × 32 px |
| Format | RGBA PNG (transparent background) |

## Changes Made

### 1. Replaced `assets/images/ship.png`

Replaced the classic white retro ship sprite with the custom pixel-art guardian ship:
- **Design:** Golden/yellow upper hull, blue core, and twin orange thruster trails.
- **Dimensions:** 52 × 32 px (identical resolution to previous ship, maintaining 1:1 collision boundaries and scale).
- **Background:** Clean transparent alpha channel.

### 2. Gameplay & Position Alignment

- Ship loaded in `src/Preloader.js:17`.
- Rendered in `src/Game.js:134` at `(world.centerX, world.height - 70)` with scale `(1.35, 1.35)` (~70 × 43 px).
- Bullet origin and explosions remain centered.
- Level 2 & 3 inherit the custom ship sprite automatically.

## Verification

- Built web bundle: `npm run build` (success)
- Synchronized Capacitor: `npx cap sync` (updated `assets/images/ship.png` copied to `android/app/src/main/assets/public/assets/images/ship.png`)

## Commands Reference

```powershell
npm run build
npx cap sync
```
