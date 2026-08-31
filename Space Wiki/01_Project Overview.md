# Project Overview

## Concept

**Space Invaders × Aquatic Pests** is a retro arcade game designed to promote **Check, Clean, Dry** awareness — a campaign to prevent the spread of invasive freshwater pests in New Zealand waterways.

Players defend a river from invading aquatic pests by switching between three weapons that represent the **Check, Clean, Dry** biosecurity steps.

## Target Audience

- General public (all ages)
- Education settings (schools, community groups)
- Water sports enthusiasts (kayakers, fishers, boaters)

## Core Loop

1. Player controls a boat (ship) at the bottom of the screen
2. Invading aquatic pests descend from the top (like Space Invaders)
3. Player shoots them with themed weapons
4. Between levels, fact cards teach about real aquatic pests
5. 3 levels → fact cards → end screen with share buttons

## Game Flow

```
Boot → Preloader → StartMenu → Game (Level 1)
                                    ↓
                              FactCard 1
                                    ↓
                              GameLevel 2
                                    ↓
                              FactCard 2
                                    ↓
                              GameLevel 3
                                    ↓
                              FactCard 3
                                    ↓
                              EndScene (share)
```

## Educational Goals

- Teach what "Check, Clean, Dry" means
- Raise awareness of didymo and other aquatic pests
- Encourage sharing the campaign with friends/whānau

## Technology

| Component      | Choice                                         |
| -------------- | ---------------------------------------------- |
| Game engine    | Phaser 3.90.0                                  |
| Build tool     | Vite 7                                         |
| Language       | JavaScript (ES5/ES6 hybrid)                    |
| Mobile wrapper | PWA (Progressive Web App) → Capacitor (future) |
