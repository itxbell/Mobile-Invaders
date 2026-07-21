# Architecture

## File Structure

```
Space-Invaders-Aquatic-Pests/
├── index.html                  ← Entry point (loads Phaser + all JS scripts)
├── package.json                ← Vite + Phaser 3.90.0
├── vite.config.js              ← Vite config (base: './')
├── manifest.json               ← PWA manifest (to add)
├── sw.js                       ← Service worker (to add)
├── assets/
│   ├── audio/                  ← MP3 music & SFX
│   ├── fonts/                  ← eightbitwonder bitmap font
│   ├── images/                 ← Sprites, backgrounds, UI
│   │   └── spritesheets/       ← Invader spritesheet + JSON
│   └── libs/                   ← phaser.js (bundled), phaser.min.js
└── src/
    ├── main                    ← Unused alternate Scene-based version
    ├── style.css               ← Styling for game container
    ├── Boot.js                 ← Scale setup, starts Preloader
    ├── Preloader.js            ← Loads all assets
    ├── StartMenu.js            ← Title screen
    ├── Game.js                 ← Level 1 (base class for all levels)
    ├── GameLevel2.js           ← Level 2 (inherits from Game)
    ├── GameLevel3.js           ← Level 3 (inherits from Game)
    ├── FactCards.js            ← 3 fact card states
    └── EndScene.js             ← End screen with share buttons
```

## State Manager Pattern

The game uses Phaser 3's **State Manager** (the classic pattern), not the newer Scene system.

```javascript
var game = new Phaser.Game(1000, 1000, Phaser.AUTO, 'gameContainer');
game.state.add('Game', SpaceInvaders.Game);
game.state.start('Boot');
```

Each state is a constructor function with a `.prototype` containing `init()`, `create()`, `update()` lifecycle methods.

## State Flow

```
Boot → Preloader → StartMenu → Game (Level 1)
                  ↑                 ↓
                  │           FactCard1
                  │                 ↓
                  │           GameLevel2 ─── (inherits Game.prototype)
                  │                 ↓
                  │           FactCard2
                  │                 ↓
                  │           GameLevel3 ─── (inherits Game.prototype)
                  │                 ↓
                  │           FactCard3
                  │                 ↓
                  └─────── EndScene
```

## Level Inheritance

`GameLevel2` and `GameLevel3` use prototypal inheritance from `Game`:

```javascript
SpaceInvaders.GameLevel2.prototype = Object.create(SpaceInvaders.Game.prototype);
```

They override:
- `create()` — different music
- `init(score)` — different starting weapon
- `buildWorld()` — different background
- `invadersCount()` — different next state

## Data Flow

- Score is passed between states via `this.state.start('NextState', true, false, score)`
- The receiving state reads it in `init(scoreFromPrevious)`
- Current weapon changes per level (Check → Clean → Dry)
- No persistent storage currently (no high scores saved)

## Known Issues

- `GameLevel2.js:68` — `invadersCount()` is missing its closing `}` brace, causing `restartGame` to be improperly scoped
- `GameLevel3.js:65` — same issue as Level 2
- The game uses `Phaser.Game(1000, 1000)` — square resolution that won't fit mobile screens
- `this.game.math.numberArray()` is deprecated in modern Phaser 3 but works in 3.90.0
