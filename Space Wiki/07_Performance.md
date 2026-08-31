# Mobile Performance Optimization

## Current Performance Profile

The game is simple (35 invaders max, 20 player bullets, 20 enemy bullets), so performance on modern phones should be fine. Main concerns are:

1. **Asset sizes** — large PNG/JPG backgrounds and sprite sheets
2. **Audio decoding** — MP3 files need decoding on load
3. **Canvas rendering** — no WebGL fallback issues expected

## Asset Optimization Checklist

### Images
- [ ] Compress background images (`river_map.png`, `wanaka_map.png`, `shed_map.png`) — use TinyPNG or similar
- [ ] Compress fact cards (`FactCard1-3.png`) — these are likely large
- [ ] Optimize the invaders spritesheet — remove unused frames, reduce dimensions
- [ ] Use `.webp` format where possible with PNG fallback
- [ ] Ensure all images are no larger than 2048×2048 (hardware limit on some old devices)

### Audio
- [ ] Convert MP3 to **AAC/MP4** for iOS Safari compatibility (Safari has spotty MP3 support)
- [ ] Keep audio files under 1MB each where possible
- [ ] Consider using OGG + MP4 dual format with Phaser's audio decoding
- [ ] Shorten music loops — current tracks may be full-length songs

## Phaser Configuration Tuning

```javascript
// In index.html game creation:
var game = new Phaser.Game(w, h, Phaser.AUTO, 'gameContainer');

// Phaser.AUTO tries WebGL first, falls back to Canvas.
// For mobile, WebGL is generally faster.
// To force WebGL on devices that support it:
// var game = new Phaser.Game(w, h, Phaser.WEBGL, 'gameContainer');
```

### WebGL vs Canvas

| Renderer | Pros | Cons |
|---|---|---|
| WebGL | GPU-accelerated, faster for many sprites | Slightly more battery |
| Canvas | Universal compatibility | Slower with many objects |

For this game (35 enemies + ship + bullets), Canvas is fine. Phaser.AUTO picks the best option.

## Memory Management

- The game creates explosion groups with pre-allocated sprites (`totalInvaders * 2` = 70 explosion sprites). This is fine.
- No object pooling issues — the bullet pool of 20 is sufficient.
- `restartGame()` calls `.destroy(true)` on old groups, which prevents memory leaks.

## Frame Rate

- Target: 60 FPS on modern phones, 30 FPS acceptable on older devices
- Use `this.time.physicsElapsed` for delta-based movement if needed (currently not used)
- Invader movement uses tweens (GPU-friendly) rather than physics

## Testing on iPhone

1. Serve the game via `npm run dev` (Vite dev server)
2. Connect iPhone and computer to same WiFi
3. Open the Vite URL (printed in terminal, e.g., `http://192.168.x.x:5173`) in Safari
4. Use **Safari Web Inspector** on a Mac to profile performance

Since you don't have a Mac, test on iPhone using:
- **Safari** → open the URL directly
- **Chrome** on iOS (uses Safari WebKit, similar performance)
- Check for lag, frame drops, audio issues

## Additional Mobile Tips

- Set `this.game.stage.disableVisibilityChange = true` in Boot.js to prevent audio desync when switching apps
- Add `touch-action: none` CSS to prevent browser gesture interference
- Disable text selection and callout on mobile browsers
