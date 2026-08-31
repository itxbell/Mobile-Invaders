# Game Design

## Theme

A biosecurity-themed Space Invaders clone. The player is a freshwater guardian defending NZ waterways from invasive aquatic pests.

## Weapons (Check, Clean, Dry)

Each level introduces a new weapon representing one of the three biosecurity steps:

| Level | Weapon | Sprite | Description |
|---|---|---|---|
| 1 | **Check Ray** | `checkRay.jpg` | Green beam — inspect your gear |
| 2 | **Clean Blaster** | `cleanBlaster.png` | Blue blast — clean equipment |
| 3 | **Dry Beam** | `dryBeam.png` | Orange ray — dry completely |

Each weapon is purely cosmetic (same damage, same fire rate).

## Levels

| Level | Background | Music | Starting Weapon | Enemy Type |
|---|---|---|---|---|
| 1 | River map | `level1Music.mp3` | Check Ray | Generic invaders |
| 2 | Lake Wanaka map | `level2Music.mp3` | Clean Blaster | Generic invaders (same spritesheet) |
| 3 | Shed/gear map | `level3Music.mp3` | Dry Beam | Generic invaders (same spritesheet) |

All levels use the same invader spritesheet. Difficulty increases only by number of waves (identical setup per level).

## Fact Cards

Between each level, an educational fact card displays:

| Card | After Level | Transitions To |
|---|---|---|
| FactCard1 | Level 1 | Level 2 |
| FactCard2 | Level 2 | Level 3 |
| FactCard3 | Level 3 | EndScene |

Cards use static images (`FactCard1.png`, `FactCard2.png`, `FactCard3.png`).

## Scoring

- +20 points per invader killed
- Score persists across levels
- No high score tracking (yet)
- No time bonus

## Lives

- 3 lives total
- Losing all lives triggers "Game Over" with restart option
- Click/tap to restart from StartMenu

## End Screen

After Level 3 + FactCard3:
- "Thanks for playing" message
- Share buttons: Facebook, Twitter, Email
- `End.jpg` background

## Controls (Current)

- **Keyboard**: Left/Right arrows to move, Spacebar to fire
- **Touch**: Not yet implemented (see [[05_Touch Controls]])
- **Mouse**: Click to start/restart, tap on fact cards to proceed
