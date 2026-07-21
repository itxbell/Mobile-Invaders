# Touch Controls

## Current State

The game currently has **no touch controls**. Only keyboard input exists (`Game.js:338-350`):

```javascript
if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT))  { /* move left */ }
if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) { /* move right */ }
if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { /* fire */ }
```

The only touch interaction is `this.input.onTap` for advancing between screens (start, restart, proceed to next level).

## Design Goals

1. Players should be able to play entirely with thumbs (both hands, landscape)
2. Controls should be **visible** — not gesture-based
3. Must coexist with keyboard controls (for desktop testing)
4. Should not obscure the game area significantly

## Proposed Layout (Landscape)

```
┌────────────────────────────────────────────┐
│                                            │
│              GAME AREA                      │
│        (invaders, bullets, ship)            │
│                                            │
│                                            │
│  ┌──────────┐              ┌────────────┐  │
│  │  ◄  ►    │              │    FIRE    │  │
│  │   D-PAD  │              │   (TAP)    │  │
│  └──────────┘              └────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

- **Left side**: Virtual D-pad or left/right buttons for movement
- **Right side**: Fire button (big, easy to tap)
- Semi-transparent so game is visible behind them

## Alternative: Tap-to-Move + Auto-Fire

Simpler approach that works well on small screens:

- Tap left half of screen → move left
- Tap right half of screen → move right
- Auto-fire continuously (no fire button needed)
- Or: tap anywhere to fire at that position

This is easier to implement and test first.

## Implementation Plan

### Minimal (Phase 1)
1. Detect touch input via `this.input.onDown` / `this.input.pointer1`
2. Map pointer X position to ship movement
3. Add auto-fire while touching

### Full (Phase 2)  
1. Create Phaser graphics objects for virtual buttons (D-pad + fire)
2. Make them semi-transparent overlay
3. Handle pointer events for each button
4. Toggle visibility based on device (show on touch, hide on desktop)

## Code Sketch (Minimal Touch)

```javascript
// In Game.js update():
// If touch is active, move ship to pointer X
if (this.input.pointer1.isDown) {
    this.ship.x = this.input.pointer1.x;
    this.fireBullet(); // auto-fire while touching
}
```

## Implementation Files to Modify

- `Game.js` — add touch input to `update()`
- `GameLevel2.js` — inherits from Game, should inherit touch
- `GameLevel3.js` — same
- `Boot.js` — maybe set `this.input.maxPointers = 2` for multi-touch
