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
Scale: 0.5 (64×64 source → ~32×32 visual)

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

- Y = 880 (`world.height - 80`)
- Centers horizontally via `world.centerX`
- Leaves ~470px of vertical play space between invaders and ship

### Bullet Speed

- Player bullet velocity: `-450` (upward, faster than original `-300`)
- Invader bullet velocity: unchanged (`+300`)

### Invader Movement

- Horizontal tween: slides `world.width - 100 = 440px` right, then back (yoyo)
- Vertical drop per loop: `+25px` (was `+30` in original, slightly slower for portrait)

## Background Images

All background images are scaled to fill the canvas:

```javascript
var bg = this.add.image(0, 0, 'imageKey');
bg.width = this.world.width;
bg.height = this.world.height;
```

Applies to: titlescreen, levelBG, levelBG2, levelBG3, End

## Fact Cards

Cards scale to 90% of canvas width while maintaining aspect ratio:

```javascript
card.width = this.world.width * 0.9;
card.scale.y = card.scale.x;
```

## Text

State text (win/lose messages) is centered using bitmap text alignment:

```javascript
this.stateText = this.add.bitmapText(0, this.world.centerY, 'eightbitwonder', "MyText", 24);
this.stateText.align = 'center';
this.stateText.updateTransform();
this.stateText.position.x = this.world.centerX - this.stateText.textWidth / 2;
```

## Viewport Meta

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

Prevents mobile browsers from scaling the canvas.

## CSS

```css
#gameContainer {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

body {
  margin: 0; padding: 0;
  background-color: #000;
  touch-action: none;
  user-select: none;
}
```

## Files Modified

| File | Change |
|---|---|
| `index.html` | `Phaser.Game(540, 960, ...)` + viewport meta |
| `Boot.js` | `Phaser.ScaleManager.FIT` → `EXACT_FIT` |
| `Game.js` | Invader grid, ship, bullet, text, background |
| `GameLevel2.js` | Background scaling |
| `GameLevel3.js` | Background scaling |
| `StartMenu.js` | Background scaling |
| `FactCards.js` | Card width scaling |
| `EndScene.js` | Background scaling |
| `style.css` | Flexbox centering, touch prevention |
