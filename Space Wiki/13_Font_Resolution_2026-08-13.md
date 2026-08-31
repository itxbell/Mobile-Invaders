# 13. Font Resolution — Mobile Screen Fit (2026-08-13)

## Goal

Fix font sizes so all game text is readable and fully fits inside the mobile screen after the portrait (540×960) + `EXACT_FIT` conversion.

## Screen Model

| Item | Value |
|---|---|
| Game canvas (logical) | 540 × 960 portrait |
| Scale mode | `Phaser.ScaleManager.EXACT_FIT` (`src/Boot.js`) |
| Emulator screen (medium_phone AVD) | 1080 × 2400 → canvas rendered 2× |
| Font used | `eightbitwonder` bitmap font (`assets/fonts/eightbitwonder.png/.fnt`, native size 32px, lineHeight 32) |
| Fallback font | Arial (EndScene share buttons only) |

> Bitmap text `size` in Phaser 2 = rendered pixel height on the 540-wide canvas
> (glyph scale = size ÷ 32 native). On the 1080×2400 emulator the canvas is scaled 2×,
> so every value below appears at double size on screen.

## Exact Font Resolutions Applied

### 1. HUD — `src/Game.js` (`buildUI`)

| Text | Before | After | Canvas pos |
|---|---|---|---|
| `Score : N` | 16px | **20px** | (10, 10) |
| `Weapon: X` | 16px | **20px** | (10, 34) — moved down 4px to avoid overlap with larger score line |

### 2. State messages — `src/Game.js` (`buildStateText`)

| Setting | Before | After |
|---|---|---|
| Size | 24px | **30px** |
| `align` | `center` | `center` |
| `wordWrap` | off | **true** |
| `wordWrapWidth` | — | **500** |
| `maxWidth` | — | **540** |

Also removed the manual `position.x = centerX - textWidth/2` centering — word wrap +
`align: center` now centers every line automatically. Applies to all level-complete
and game-over messages (used by `Game.js`, `GameLevel2.js`, `GameLevel3.js`).

### 3. End scene — `src/EndScene.js`

**Thanks message (bitmap text):**

| Setting | Before | After |
|---|---|---|
| Size | 24px | **28px** |
| `wordWrap` / `wordWrapWidth` | off | **true / 500** |
| `maxWidth` | — | **540** |

**Share message (bitmap text):**

| Setting | Before | After |
|---|---|---|
| Size | 16px | **20px** |
| `wordWrap` / `wordWrapWidth` | off | **true / 500** |
| `maxWidth` | — | **540** |

**Share buttons (Arial, anchor 0.5, Y = centerY + offset):**

| Button | Before | After |
|---|---|---|
| Share on Facebook | 20px | **26px** |
| Share on Twitter | 20px | **26px** |
| Share via Email | 20px | **26px** |

## Why These Values

- **540px-wide canvas, 500px wrap width** → ~20px safe margins on both sides; longest
  message lines ("Space Invaders x Aquatic Pests") previously overflowed the canvas
  and got clipped at 24px — at 28px with word wrap they now break cleanly and center.
- **HUD 16px → 20px**: 16px glyphs at 2× upscale read as ~16dp on a 420dpi phone —
  small; 20px gives comfortable readability with zero width overflow.
- **State text 24px → 30px**: biggest in-game messages (level complete / game over);
  30px is the largest size that still fits ~500px-wide wrapped lines on 540 canvas.
- Kept default linear texture smoothing — bitmap glyphs remain soft-edged; the game's
  photo backgrounds (JPG) stay smooth instead of becoming blocky with NEAREST scaling.

## Verification

- `npm run build` → `npx cap sync android` → `gradlew assembleDebug` → `adb install -r`
- Installed and relaunched on `medium_phone` emulator — no `Uncaught` JS errors in logcat.

## Build Note (Java fix)

Rebuilding failed first with *"Dependency requires at least JVM runtime version 11.
This build uses a Java 8 JVM"* — the machine's default `java` is 1.8.0_51 while AGP
8.13.0 requires JVM 11+.

**Fix applied (2026-08-13):** `setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"`
(Android Studio's bundled JetBrains Runtime, OpenJDK **21.0.10**). User-level only —
system `java` remains 1.8. Verified: Gradle 8.14.3 now launches on JVM 21.0.10.
New terminals pick this up automatically; `gradlew` prefers `JAVA_HOME` over PATH.
