# Touch Controls

## Implementation

Touch controls are implemented via pointer tracking in the `update()` loop (`Game.js:354`):

```javascript
if (this.input.pointer1.isDown)
{
    this.ship.x = this.input.pointer1.x;
    this.fireBullet();
}
```

**How it works:**
- Ship's X position follows `pointer1.x` (finger X coordinate)
- Auto-fires every 500ms (same cooldown as spacebar)
- Keyboard controls still work alongside touch
- Works in all 3 game levels (inherited from Game.js)

## Control Scheme: Pointer Follow + Auto-Fire

This is the "Minimal" approach from the original design:

- Touch anywhere on screen → ship moves to that X position
- Hold touch → auto-fire at 500ms intervals
- Lift finger → ship stops, no firing

No D-pad or fire button overlay needed — the ship follows the finger directly.

## Configuration

- `this.input.maxPointers = 2` in Boot.js allows multi-touch
- CSS `touch-action: none` on `<body>` prevents browser scroll/zoom
- CSS `user-select: none` prevents text selection

## File Changes

| File | Change |
|---|---|
| `src/Game.js:354-358` | Pointer follow + auto-fire in `update()` |
| `src/Boot.js:11` | `this.input.maxPointers = 2` |
| `src/style.css:14-17` | `touch-action`, `user-select`, `-webkit-touch-callout` |

## Testing

- Desktop: keyboard arrows + spacebar still work
- Android emulator: touch works via mouse click (emulator maps clicks to touch)
- Real device: ship follows finger, auto-fires while held
- All 3 levels: Touch controls inherited through prototype chain
