# Responsive Scaling

## Current Implementation

**Resolution:** 540 × 960 (portrait, 9:16 aspect ratio)

```javascript
var game = new Phaser.Game(540, 960, Phaser.AUTO, 'gameContainer');
```

**Scale Mode:** `Phaser.ScaleManager.EXACT_FIT` in Boot.js

```javascript
this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
this.scale.pageAlignHorizontally = true;
this.scale.pageAlignVertically = true;
```

EXACT_FIT scales the game to fill the entire viewport, eliminating black bars on tall 9:20+ screens. On 9:16 screens there is no stretch; on 9:20 screens there is ~12% vertical stretch which is imperceptible for pixel art.

## Portrait Layout Details

### Invader Grid (Game.js)

```
5 columns × 7 rows
Scale: 0.7 (64×64 source → ~45×45 visual)

    Col 0  Col 1  Col 2  Col 3  Col 4
    X=20   X=120  X=220  X=320  X=420
Row 0  Y=80
Row 1  Y=135
Row 2  Y=190
Row 3  Y=245
Row 4  Y=300
Row 5  Y=355
Row 6  Y=410
```

Grid fills top ~40% of the 540×960 canvas.

### Ship Position

- Y = 890 (`world.height - 70`)
- Centers horizontally via `world.centerX`
- Ship scale: 1.35

### Bullet Speed

- Player bullet velocity: `-450` (upward)
- Invader bullet velocity: `120` (toward player)
- Bullet cooldown: 500ms (player), 2000ms (invader)

### Invader Movement

- Horizontal tween: slides `world.width - 100 = 440px` right, then back (yoyo)
- Vertical drop per loop: `+25px`

### Keyboard Speed

- Ship movement: 200px/s left/right

## Known Issues (Current)

| Issue | Detail |
|---|---|
| **Aspect ratio distortion** | EXACT_FIT stretches the game on non-9:16 screens |
| **No resize handling** | Orientation changes don't trigger recalculation |
| **All positions hardcoded** | Nothing adapts when the canvas scales |
| **No letterboxing** | Fills viewport even when stretching |

## Responsive Scaling Plan

### Phase 1: Fix Aspect Ratio (Quick Win)

**Change:** `EXACT_FIT` → `FIT`

**File:** `src/Boot.js:11`

```js
// Before:
this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

// After:
this.scale.scaleMode = Phaser.ScaleManager.FIT;
```

**What this does:**
- Preserves the 9:16 aspect ratio on all screens
- Adds black bars (letterboxing) on screens that don't match
- Stops stretching/distortion completely
- No other code changes needed

**Test on:** iPhone SE (16:9), iPhone 14 Pro (19.5:9), Android 16:9, Android 20:9

---

### Phase 2: Proportional Positions (Core Work)

Convert every hardcoded pixel value to a ratio of `this.world.width` or `this.world.height`.

#### Scaling Helper

Add to `Game.js` prototype (and inherited by GameLevel2/3):

```js
getScale: function () {
    return {
        w: this.world.width,      // logical width (540)
        h: this.world.height,     // logical height (960)
        cx: this.world.centerX,   // 270
        cy: this.world.centerY,   // 480
    };
}
```

#### Conversion Table — Game.js

| Element | Current (px) | Proportional Formula | Notes |
|---|---|---|---|
| **Invader grid** | | | |
| Grid X offset | `20` | `s.w * 0.037` | Left padding |
| Column spacing | `100` | `s.w * 0.185` | 5 columns across |
| Grid Y offset | `80` | `s.h * 0.083` | Top padding |
| Row spacing | `55` | `s.h * 0.057` | 7 rows down |
| Invader scale | `0.7` | `0.7 * (s.w / 540)` | Scale with width |
| **Ship** | | | |
| Ship Y offset | `70` | `s.h * 0.073` | From bottom |
| Ship scale | `1.35` | `1.35 * (s.w / 540)` | Scale with width |
| **Movement** | | | |
| Invader tween target | `world.width - 100` | `s.w - (s.w * 0.185)` | Horizontal bounds |
| Invader flyDown step | `25` | `s.h * 0.026` | Vertical drop per loop |
| **Speeds** | | | |
| Player bullet velocity | `-450` | `-450 * (s.h / 960)` | Scale with height |
| Invader bullet speed | `120` | `120 * (s.h / 960)` | Scale with height |
| Ship keyboard speed | `200` | `200 * (s.w / 540)` | Scale with width |
| **UI** | | | |
| Score text Y | `8` | `s.h * 0.008` | Top margin |
| Weapon text Y | `38` | `s.h * 0.04` | Below score |
| Font size | `18` | `Math.round(s.w / 30)` | Scales with width |
| **Explosions** | | | |
| Invader explosion offset | `+32` | Half invader size | Relative to sprite |
| Ship explosion offset | `+26, +16` | Half ship size | Relative to sprite |

#### Conversion Table — Other Files

| File | Element | Current | Proportional |
|---|---|---|---|
| **StartMenu.js** | Background | `world.width`, `world.height` | Already fills canvas |
| **GameLevel2.js** | Background | `world.width`, `world.height` | Already fills canvas |
| **GameLevel3.js** | Background | `world.width`, `world.height` | Already fills canvas |
| **FactCards.js** | Card width | `world.width * 0.9` | Already proportional |
| **EndScene.js** | wordWrapWidth | `500` | `s.w * 0.926` |
| **EndScene.js** | maxWidth | `540` | `s.w` |

---

### Phase 3: Resize Event Handling

Add a resize callback in `Boot.js` so the game recalculates on orientation change or window resize:

```js
// In Boot.js create():
this.scale.setResizeCallback(function (scale, game) {
    // Optionally rebuild world or just let
    // the fixed 540x960 canvas handle it via FIT mode
    // Positions stay correct because they use world.* which
    // remains 540x960 regardless of screen size
}, this);
```

**Note:** With `FIT` mode + proportional positions, resize handling may not be strictly necessary since the logical world stays 540×960 and Phaser handles the canvas scaling. But it's useful if you want to adjust gameplay on orientation changes (e.g., disable landscape).

---

## Files to Modify

| File | Phase | Changes |
|---|---|---|
| `src/Boot.js` | 1 + 3 | Scale mode change, resize callback |
| `src/Game.js` | 2 | `getScale()`, all proportional positions |
| `src/GameLevel2.js` | 2 | Inherits from Game — may need overrides |
| `src/GameLevel3.js` | 2 | Inherits from Game — may need overrides |
| `src/StartMenu.js` | 2 | Background (already OK), any text |
| `src/FactCards.js` | 2 | Already proportional |
| `src/EndScene.js` | 2 | wordWrapWidth, maxWidth |
| `src/style.css` | — | Already OK (flexbox + 100vh) |

## Testing Checklist

- [ ] iPhone SE (375×667, 16:9)
- [ ] iPhone 14 Pro (393×852, 19.5:9)
- [ ] iPhone 14 Pro Max (430×932, 19.5:9)
- [ ] Android 16:9 (360×640)
- [ ] Android 20:9 (360×800)
- [ ] Android 21:9 (360×840)
- [ ] iPad (768×1024, 4:3) — landscape letterbox
- [ ] Desktop browser resize
- [ ] Orientation change (portrait ↔ landscape)
- [ ] Touch controls still work (pointer X maps correctly)
- [ ] Invader grid not clipped on any screen
- [ ] UI text not cut off on short screens
