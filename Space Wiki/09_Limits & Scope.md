# Limits & Scope

## Project Constraints

### Technical

| Constraint | Reason |
|---|---|
| **No macOS** | iOS native builds require Xcode. We use PWA for iOS and can only build Android APK locally. iOS IPA requires cloud CI (GitHub Actions) or borrowing a Mac. |
| **No native mobile dev experience** | Learning curve for Capacitor, Android Studio, and Xcode workflows |
| **No Apple Developer Account** | Needed to publish on App Store ($99/year). Not needed for PWA or sideloading. |
| **Existing Phaser state manager** | Game uses the older State Manager pattern, not Phaser Scenes. This works but is less modern. |
| **Legacy JS patterns** | Mix of ES5 (prototypes) and ES6 (`let`, arrow functions). Works but inconsistent. |

### Game Design

| Limit | Decision |
|---|---|
| **Same enemies every level** | All levels use the same invader spritesheet with different animations. No unique enemy types per level. |
| **No increasing difficulty** | All 3 levels have the same 7×5 = 35 invaders grid with same speed. Only backgrounds, music, and weapon name change. |
| **No boss fights** | The game has no final boss or special enemy. |
| **No power-ups** | No collectible power-ups, shield, or special abilities. |
| **No high score save** | Scores are not persisted between sessions (no localStorage yet). |
| **No multiplayer** | Single-player only. |
| **No procedural generation** | Everything is hand-placed / scripted. |
| **3 levels only** | No plans for additional levels beyond the 3. |

### Scope Considerations

### What This Project IS

- A **simple educational arcade game** to promote Check, Clean, Dry awareness
- A **mobile-friendly web game** (PWA installed on home screen)
- A learning project for game development with Phaser
- A campaign tool for Water Awareness Initiative (WAI)

### What This Project IS NOT

- A commercial game release
- A complex mobile app with backend services
- A competitive or skill-based game
- A replacement for the official Check Clean Dry campaign website

### Mobile Platform Limitations

| Feature | Android PWA | iOS PWA |
|---|---|---|
| Install to Home Screen | ✅ Chrome prompt | ✅ Safari share sheet |
| Offline play | ✅ Full support | ✅ Support (recent iOS) |
| Orientation lock | ✅ Manifest `orientation` | ⚠️ Partial support |
| Push notifications | ✅ | ❌ |
| Background audio | ⚠️ Limited | ❌ |
| Native share API | ✅ | ✅ (recent iOS) |
| Haptics | ❌ (requires Capacitor) | ❌ (requires Capacitor) |

### When to Switch from PWA to Capacitor

- You want to publish on **Google Play** or **App Store**
- You need **native APIs** (haptics, file system, sensors)
- You get access to a **Mac** (or use cloud CI) for iOS builds
- You're willing to pay the **$99/year Apple Developer fee** for App Store distribution

Until then, the **PWA version is fully functional for both Android and iOS** and can be tested on your iPhone today.
