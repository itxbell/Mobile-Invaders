# Pause & Resume — Implementation Guide

## Overview

Add a pause button (top-right corner) that freezes the game with a dimmed overlay, "PAUSED" text, and a tappable "RESUME" button. Music mutes while paused. Works on all 3 levels automatically.

## How It Works

**We do NOT use `this.game.paused`** — in this Phaser 2 version, setting `game.paused = true` freezes the entire input manager, making the RESUME button unclickable.

Instead, we use a custom `this.isPaused` flag:
- The `update()` loop returns early when `isPaused` is true (gameplay freezes)
- Phaser's input system keeps running (RESUME button stays clickable)
- Music is paused/resumed explicitly via `this.music.pause()` / `this.music.resume()`
- **Motion freeze is explicit via `setFreeze()`** (see §3b): `update()` guard alone does NOT stop tweens, physics bodies, or animations — see [[26_Session_2026-09-30_Pause_Freeze_Fix]]

## Files to Modify

| File | What changes |
|------|-------------|
| `src/Game.js` | Constructor, `buildUI()`, new methods, `update()` guard, `restartGame()` cleanup |
| `src/GameLevel2.js` | `init()` and `restartGame()` — add `isPaused` reset and pause cleanup |
| `src/GameLevel3.js` | `init()` and `restartGame()` — add `isPaused` reset and pause cleanup |

GameLevel2 and GameLevel3 **inherit** `buildUI()`, `update()`, and the new pause methods from Game.js via prototypal inheritance, so those work on all 3 levels automatically.

---

## Step-by-Step Changes

### Step 1 — Constructor (`src/Game.js` line 1)

Add these 5 variables after line 20 (`this.currentWeapon = 'check';`):

```javascript
this.isPaused = false;
this.pauseButton = null;
this.pauseOverlay = null;
this.pauseText = null;
this.resumeButton = null;
```

### Step 2 — `buildUI()` method (`src/Game.js` line 188)

After the `weaponText` block (after line 198), add the pause button:

```javascript
// Pause button - top right corner
this.pauseButton = this.add.bitmapText(0, 8, 'eightbitwonder', 'I I', 22);
this.pauseButton.position.x = this.world.width - 50;
this.pauseButton.inputEnabled = true;
this.pauseButton.events.onInputDown.add(this.togglePause, this);
```

**Why "I I"**: The `eightbitwonder` bitmap font only has a-z, A-Z, 0-9, and space. It does NOT have `|` pipe characters, so `||` renders invisible. "I I" (capital I + space + capital I) looks like a pause symbol and uses only characters the font supports.

**Why no `anchor.setTo()`**: `BitmapText` in this Phaser 2 version doesn't have `anchor.setTo()` — it throws `TypeError`. Position is set directly via `position.x`.

**Why no `bringToTop()`**: `BitmapText` doesn't have `bringToTop()` in this Phaser version — it throws `TypeError`.

### Step 3 — Three new methods (add after `updateWeaponUI` at line 325, before `restartGame`)

```javascript
togglePause: function () {
    if (this.gameover) return;
    if (this.isPaused) {
        this.hidePauseOverlay();
        this.isPaused = false;
    } else {
        this.isPaused = true;
        this.showPauseOverlay();
    }
},

showPauseOverlay: function () {
    // Dimmed background
    this.pauseOverlay = this.add.graphics();
    this.pauseOverlay.beginFill(0x000000, 0.6);
    this.pauseOverlay.drawRect(0, 0, this.world.width, this.world.height);
    this.pauseOverlay.endFill();

    // PAUSED text
    this.pauseText = this.add.bitmapText(0, 0, 'eightbitwonder', 'PAUSED', 28);
    this.pauseText.align = 'center';
    this.pauseText.updateTransform();
    this.pauseText.position.x = this.world.centerX - this.pauseText.textWidth / 2;
    this.pauseText.position.y = this.world.centerY - 50;

    // RESUME button
    this.resumeButton = this.add.bitmapText(0, 0, 'eightbitwonder', 'RESUME', 22);
    this.resumeButton.align = 'center';
    this.resumeButton.updateTransform();
    this.resumeButton.position.x = this.world.centerX - this.resumeButton.textWidth / 2;
    this.resumeButton.position.y = this.world.centerY + 10;
    this.resumeButton.inputEnabled = true;
    this.resumeButton.events.onInputDown.add(this.togglePause, this);

    // Pause music
    if (this.music && this.music.isPlaying) {
        this.music.pause();
    }
},

hidePauseOverlay: function () {
    if (this.pauseOverlay) {
        this.pauseOverlay.destroy();
        this.pauseOverlay = null;
    }
    if (this.pauseText) {
        this.pauseText.destroy();
        this.pauseText = null;
    }
    if (this.resumeButton) {
        this.resumeButton.destroy();
        this.resumeButton = null;
    }

    if (this.music) {
        this.music.resume();
    }
},
```

**Key details**:
- `graphics.drawRect()` draws a full-screen semi-transparent black rectangle
- `fixedToCamera = true` ensures the overlay stays on screen
- `this.music.pause()` / `this.music.resume()` handles audio explicitly
- All overlay elements are stored as instance variables so `hidePauseOverlay()` can destroy them

### Step 4 — Guard `update()` loop (`src/Game.js` line 426)

Change the first line of `update()` from:

```javascript
update: function () {
    //Ship handler
    this.ship.body.velocity.x = 0;
```

To:

```javascript
update: function () {
    if (this.isPaused || this.gameover) return;

    //Ship handler
    this.ship.body.velocity.x = 0;
```

**Why `this.isPaused` not `this.game.paused`**: `game.paused = true` freezes the entire input manager in Phaser 2 — the RESUME button can never receive clicks. Using `this.isPaused` only freezes the gameplay logic while keeping input alive.

### Step 5 — Cleanup in `restartGame()` (`src/Game.js` line 327)

Add at the very top of `restartGame()`, before the `this.music.stop()` line:

```javascript
if (this.isPaused) {
    this.isPaused = false;
    this.hidePauseOverlay();
}
```

**Why**: If the player pauses the game and then the game over screen appears (or they tap to restart), we need to unpause and clean up the overlay before transitioning states.

### Step 6 — `GameLevel2.js` changes

**In `init()` (line 30)** — add `this.isPaused = false;` after `this.gameover = false;`:

```javascript
SpaceInvaders.GameLevel2.prototype.init = function(scoreFromLevel1){
    this.score = scoreFromLevel1 || 0;
    this.currentWeapon = 'clean';
    this.gameover = false;
    this.isPaused = false;    // <-- ADD THIS
    this.bulletTime = 0;
    this.invaderBulletTime = 0;
    this.livingEnemies = [];
    this.totalInvaders = this.totalRow * this.totalInvadersRow;
};
```

**In `restartGame()` (line 71)** — add at the very top, before `if(this.music)`:

```javascript
SpaceInvaders.GameLevel2.prototype.restartGame = function(){
    if(this.isPaused){                // <-- ADD THIS BLOCK
        this.isPaused = false;
        this.hidePauseOverlay();
    }
    if(this.music){ this.music.stop(); }
    // ... rest stays the same
};
```

### Step 7 — `GameLevel3.js` changes

Same two changes as GameLevel2:

**In `init()` (line 28)** — add `this.isPaused = false;` after `this.gameover = false;`:

```javascript
SpaceInvaders.GameLevel3.prototype.init = function(scoreFromLevel2){
    this.score = scoreFromLevel2 || 0;
    this.currentWeapon = 'dry'
    this.gameover = false;
    this.isPaused = false;    // <-- ADD THIS
    this.bulletTime = 0;
    this.invaderBulletTime = 0;
    this.livingEnemies = [];
    this.totalInvaders = this.totalRow * this.totalInvadersRow;
};
```

**In `restartGame()` (line 69)** — add at the very top, before `if(this.music)`:

```javascript
SpaceInvaders.GameLevel3.prototype.restartGame = function(){
    if(this.isPaused){                // <-- ADD THIS BLOCK
        this.isPaused = false;
        this.hidePauseOverlay();
    }
    if(this.music){ this.music.stop(); }
    // ... rest stays the same
};
```

---

## UI Layout (540x960 portrait)

```
Normal gameplay:
┌─────────────────────────┐
│ Score: 200       [ || ] │  <-- pause button top-right
│ Weapon: CHECK           │
│                         │
│     invaders            │
│                         │
│         ship            │
└─────────────────────────┘

When paused:
┌─────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  <-- semi-transparent overlay
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓ PAUSED ▓▓▓▓▓▓▓▓▓│  <-- centered text
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓ [RESUME] ▓▓▓▓▓▓▓▓│  <-- tappable button
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────────────┘
```

---

## Why GameLevel2/3 Don't Need Their Own Pause Methods

GameLevel2 and GameLevel3 use prototypal inheritance:

```javascript
SpaceInvaders.GameLevel2.prototype = Object.create(SpaceInvaders.Game.prototype);
```

This means they **inherit** these methods from Game.js:
- `buildUI()` (creates the pause button)
- `togglePause()`
- `showPauseOverlay()`
- `hidePauseOverlay()`
- `setFreeze()` (tweens + physics + flap freeze, 2026-09-30)
- The guarded `update()` loop

Only `init()` and `restartGame()` need changes because those are **overridden** in each level file.

---

## Testing Checklist

- [x] Pause button appears top-right on Level 1
- [x] Pause button appears top-right on Level 2
- [x] Pause button appears top-right on Level 3
- [x] Tapping pause freezes ship, invaders, bullets, and collisions
- [x] Music mutes when paused
- [x] Music resumes when unpaused
- [x] "PAUSED" text displays centered on screen
- [x] "RESUME" button dismisses overlay and resumes game
- [x] Ship doesn't move via touch while paused
- [x] Invader slide/drop tween freezes (`tweens.pauseAll/resumeAll`) — see [[26_Session_2026-09-30_Pause_Freeze_Fix]]
- [x] Mid-air bullets + ship freeze (`body.moves=false/true`, velocities preserved — `Arcade.isPaused` doesn't exist in this build)
- [x] Invader flap animation freeze-frames (`currentAnim.paused`, guarded `currentAnim` access)
- [ ] Pausing during game over does nothing (button ignored)
- [ ] Level transitions work correctly after unpausing
- [ ] Game over after pausing works correctly (cleanup runs)

---

## Optional Enhancements

- **Keyboard shortcut**: Add `if (this.input.keyboard.addKey(Phaser.Keyboard.P).justPressed())` in `update()` to toggle pause with P key
- **Escape key**: Same pattern with `Phaser.Keyboard.ESC`
- **Restart button**: Add a second button in the pause overlay alongside RESUME
- **Quit button**: Add a third button that calls `this.state.start('StartMenu')` to return to menu
