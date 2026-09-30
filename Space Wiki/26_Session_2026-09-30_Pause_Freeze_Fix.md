# Session 2026-09-30 — Pause Freeze Fix (Tweens + Physics + Animations)

## Goal

Fix pause so all assets freeze pixel-identical while paused: invader slide/drop, player + invader bullets in flight, ship, and invader flap animation (24fps). Resume continues from the exact same positions/frames.

## Environment

| Item | Value |
|------|-------|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` |
| Dev server | `npm run dev` → `http://localhost:5173` |
| Engine | Phaser 2 (via `assets/libs/phaser.js`, `Phaser.Game(540, 960, Phaser.AUTO)`) |
| Canvas | 540×960 portrait, `EXACT_FIT` |

## Changes Made

### 1. Stored invader tween handle (`src/Game.js:26,34,101-103`)

Pause needs a handle to the invader-group tween. It was a local `var tween`, now an instance field.

```javascript
// Before (buildInvaders)
var tween = this.add.tween(this.invaders).to({ x: this.world.width - 100 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
tween.onLoop.add(this.flyDown, this);

// After
this.invadersTween = this.add.tween(this.invaders).to({ x: this.world.width - 100 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
this.invadersTween.onLoop.add(this.flyDown, this);
```

Also added `this.invadersTween = null;` to constructor (`Game.js:26`) and `init()` (`Game.js:34`), plus missing `this.isPaused = false;` reset in base `init()` (Level 2/3 already had it).

### 2. New `setFreeze(freeze)` helper (`src/Game.js:406-444`)

Single freeze/unfreeze point called by `showPauseOverlay()` / `hidePauseOverlay()`. Inherited by GameLevel2/3 — no level-file changes needed.

```javascript
setFreeze: function (freeze) {
    // 1. Tweens - invader group slide + flyDown loop
    if (this.game && this.game.tweens) {
        if (freeze) { this.game.tweens.pauseAll(); }
        else { this.game.tweens.resumeAll(); }
    }
    // 2. Physics - player bullets (-450), invader bullets (120), ship
    var groups = [this.bullets, this.invadersBullets];
    for (var gi = 0; gi < groups.length; gi++) {
        if (groups[gi]) {
            groups[gi].forEachAlive(function (b) {
                if (b.body) { b.body.moves = !freeze; }
            }, this);
        }
    }
    if (this.ship && this.ship.body) { this.ship.body.moves = !freeze; }
    // 3. Invader flap animation - true freeze-frame, resumes from same frame
    if (this.invaders) {
        this.invaders.forEachAlive(function (inv) {
            if (inv.animations && inv.animations.currentAnim) {
                inv.animations.currentAnim.paused = freeze;
            }
        }, this);
    }
},
```

### 3. Wired into overlay (`src/Game.js:352-354,398-399`)

```javascript
// showPauseOverlay() top:
this.setFreeze(true);
// hidePauseOverlay() after destroying overlay/text/button:
this.setFreeze(false);
```

Existing `restartGame()` cleanup (`if (this.isPaused) { ... hidePauseOverlay(); }`) now unfreezes automatically, so pause → restart / level transition can't start physics-frozen.

## Issues Encountered

- **Assets kept moving while paused → root cause:** `update()` early-return (`if (this.isPaused ...) return`) stops our code but not 3 independent Phaser subsystems: TweenManager (invader slide + `flyDown`), Arcade Physics bodies (bullets/ship velocities), AnimationManager (24fps flap). Fix = pause each subsystem explicitly (see above).
- **`Arcade.isPaused` doesn't exist → alternative:** grep of `assets/libs/phaser.js` found 0 hits for `isPaused`/`skipUpdate` on Arcade. `Body#update (:49871-49893)` skips all motion when `body.moves == false` while preserving `velocity` → used `body.moves` toggling instead. Invaders already have `body.moves=false` (`Game.js:82`) since they move via tween.
- **Animation pause API → verified:** `Animation#paused` setter (`phaser.js:40635-40659`) records `_pauseStartTime` and recalculates `_timeNextFrame` on resume (no frame jump). `AnimationManager#paused` proxies to `currentAnim` but crashes when null → guarded `currentAnim` access used.
- **`game.paused = true` rejected:** freezes the whole input manager in Phaser 2, RESUME becomes unclickable (see [[23_Pause_Resume_Guide]]).

## Verification

- `node --check src/Game.js` → SYNTAX OK
- `npm run build` → success (only pre-existing non-module `<script>` warnings, assets copied via `vite-plugin-static-copy`)
- Manual test: `npm run dev` → Level 1 → fire + wait for enemy bullet → tap `I I` → invader block, mid-air bullets, wings hold still 3s → RESUME → motion continues from same positions, music resumes. Repeat L2/L3.
- User confirmed: "it worked"

## Commands Reference

```powershell
node --check src/Game.js
npm run dev
npm run build
```

## Git Status

Modified: `src/Game.js` (+48/-5: constructor +1, init +2, tween handle +2, show/hide wiring +3, `setFreeze` +40).
Related wiki updates in same change: this log, `[[23_Pause_Resume_Guide]]` freeze section, `[[08_Roadmap]]` Phase 5 checkbox, `Welcome.md` index link.

See also: [[23_Pause_Resume_Guide]], [[25_Session_2026-09-21_Pause_Resume_EndScene_Fix]]
