# Responsive Scaling

## The Problem

The game is hardcoded to **1000 × 1000 pixels** (square):

```javascript
var game = new Phaser.Game(1000, 1000, Phaser.AUTO, 'gameContainer');
```

Current scaling in `Boot.js`:

```javascript
this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
this.scale.pageAlignHorizontally = true;
this.scale.pageAlignVertically = true;
```

**`SHOW_ALL`** fits the game inside the viewport while maintaining aspect ratio. On a phone (e.g., 390×844 iPhone), this means:
- Game scales down to fit the **shorter dimension** (width)
- Large black bars appear above and below (letterboxing)
- The game is very small on the screen

## Mobile Screen Examples

| Device | Resolution (px) | Aspect Ratio | Game Visible Area |
|---|---|---|---|
| iPhone 14 Pro | 393 × 852 | ~9:19.5 | 393 × 393 (46% of screen) |
| Pixel 7 | 412 × 915 | ~9:20 | 412 × 412 (45% of screen) |
| iPad Air | 820 × 1180 | ~7:10 | 820 × 820 (69% of screen) |
| Galaxy Tab | 800 × 1280 | ~5:8 | 800 × 800 (63% of screen) |

## Strategy: Switch to Flexible Canvas Size

Instead of a fixed 1000×1000 game, use a **dynamic canvas** that adapts to the device:

### Option A: Maintain 1:1 Square with Shorter Edge

```javascript
var size = Math.min(window.innerWidth, window.innerHeight);
var game = new Phaser.Game(size, size, Phaser.AUTO, 'gameContainer');
```

- Game is always square, always fills the shorter dimension
- Works but wastes vertical space on phones

### Option B: Taller Playable Area (Recommended)

Use a wider aspect ratio like 9:16 (portrait) or 3:4:

```javascript
var width = window.innerWidth;
var height = window.innerHeight;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'gameContainer');
```

**Impact**: All positioning code uses `this.world.centerX` and `this.world.height`, which already adapt. But:
- Invader grid positions are hardcoded (`25 + j*70`, `80 + 50*i`)
- Ship position is relative (`this.world.height - 100`)
- These need to be converted to percentage-based positioning

### Option C: Define a Virtual Design Resolution + Scale

Pick a design resolution (e.g., 800×600 landscape) and use `Phaser.ScaleManager.FIT`:

```javascript
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');
// In Boot.js:
this.scale.scaleMode = Phaser.ScaleManager.FIT;
```

Phaser scales everything to fit the screen. **Simplest approach** that preserves aspect ratio.

## Recommendation

Start with **Option C: Fixed design resolution + FIT scaling**:

1. Change game size to a landscape-friendly ratio (e.g., 800×500 or 960×540)
2. Use `Phaser.ScaleManager.FIT` instead of `SHOW_ALL`
3. Adjust hardcoded positions to use relative values (percentages of `world.width` / `world.height`)

This requires **no physics engine changes** and is the quickest path to mobile-friendly display.

## What Needs to Change

| File | Change |
|---|---|
| `index.html` | Update `new Phaser.Game(w, h, ...)` dimensions |
| `Boot.js` | Change `SHOW_ALL` → `FIT`, set `pageAlignHorizontally/Vertically` |
| `Game.js` | Convert hardcoded pixel values to relative positioning |
| `GameLevel2.js` | Inherits changes from Game |
| `GameLevel3.js` | Inherits changes from Game |
| `StartMenu.js` | Verify title screen scales |
| All states | Verify text positioning |

## Orientation

For PWA, lock to **landscape** in the manifest:

```json
"orientation": "landscape-primary"
```

This forces the browser to request landscape mode when the app is installed.
