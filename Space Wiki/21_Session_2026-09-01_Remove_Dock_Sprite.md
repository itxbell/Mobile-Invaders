# Session 2026-09-01 — Remove Dock Sprite

## Goal

Remove the dark rectangular dock sprite (`dock.png`) at the bottom of the screen to give a clean unobstructed view of the river/lake background behind the ship.

## Changes Made

### 1. Removed Dock Sprite (`src/Game.js:132`)

Removed `this.add.sprite(this.world.centerX - 60, this.world.height - 100, 'dock');` from `buildShip()`:

```javascript
// Before
buildShip: function () {
    this.add.sprite(this.world.centerX - 60, this.world.height - 100, 'dock');
    this.ship = this.add.sprite(this.world.centerX, this.world.height - 70, 'ship');
    ...
}

// After
buildShip: function () {
    this.ship = this.add.sprite(this.world.centerX, this.world.height - 70, 'ship');
    ...
}
```

- Level 2 and Level 3 automatically inherit this clean setup without the dark square dock.

## Verification

- Web build passed: `npm run build`
- Synced native Android assets: `npx cap sync`

## Commands Reference

```powershell
npm run build
npx cap sync
```
