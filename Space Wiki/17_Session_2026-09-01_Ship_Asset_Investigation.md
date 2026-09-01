# Session 2026-09-01 — Ship Asset Investigation & Restore

## Goal

Investigate ship asset differences between the original game repo and the Mobile-Invaders port, restore the working ship.

## Environment

| Item | Value |
|------|-------|
| Original game repo | `C:\Users\ina25\OneDrive\Documents\GitHub\Space-Invaders-Aquatic-Pests` |
| Mobile port repo | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` |
| Ship asset path | `assets/images/ship.png` |

## Changes Made

### 1. Ship Asset Comparison

| Repo | File Size | Dimensions | Notes |
|------|-----------|------------|-------|
| Original game | 756 bytes | 52×32 | Corrupted PNG (invalid dimensions in header) |
| Mobile-Invaders | 15,056 bytes | 52×32 | Valid PNG, working |

The original game's ship.png is corrupted (756 bytes, nonsensical dimensions). Mobile-Invaders has a working copy (15,056 bytes).

### 2. Ship Settings Comparison

| Setting | Original Game (`Game.js:131`) | Mobile-Invaders (`Game.js:136`) |
|---------|------------------------------|--------------------------------|
| Position | `height - 100` | `height - 150` |
| Scale | 1× (default) | 3.5× |
| `enableBody` | true | true |
| `anchor` | (0.5, 0.5) | (0.5, 0.5) |
| `collideWorldBounds` | not set | true |
| `visible` / `alpha` | not set | true / 1 |

Mobile-Invaders scaled the ship up 3.5× for mobile visibility.

### 3. Ship Sprite Details

- **Format**: PNG (52×32, RGBA 32bpp)
- **Appearance**: Classic white Space Invaders ship on transparent background
- **Pixel data**: Center pixel is white (255,255,255), background is transparent (0,0,0,0)

### 4. Custom Ship Note

The colorful orange/yellow ship with blue center shown by the user is **not present** in either repo. The current ship is the classic white retro sprite. To use a custom ship, the user must provide the PNG file.

## Verification

- Mobile-Invaders ship restored from git: `git checkout HEAD -- assets/images/ship.png`
- File confirmed valid: 15,056 bytes, 52×32 dimensions
- Game loads with ship visible at bottom of screen

## Git Status

No new commits — investigation only. Ship asset unchanged from original repo state.
