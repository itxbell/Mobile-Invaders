# Session 2026-10-15 — Android APK Native App

## Goal

Ship the fixed game as a real Android application (installable, fullscreen, offline) via the existing Capacitor shell — plus a cable-free install route.

## Environment

| Item | Value |
|---|---|
| App ID / name | `org.wai.didymoinvaders` / Space Invaders Aquatic Pests |
| Wrapper | Capacitor 8 (`webDir: dist`, 53 tracked files under `android/`) |
| Tooling | Android Studio JBR (`JAVA_HOME`), `ANDROID_HOME = %LOCALAPPDATA%\Android\Sdk`, Gradle wrapper |
| Web build in APK | Current fixed game: `SHOW_ALL`, toolbar/bfcache refit, zoom guards, `dvh` CSS, `?v=6` |
| APK | `android/app/build/outputs/apk/debug/app-debug.apk` — 25.4 MB, `BUILD SUCCESSFUL in 21s` |

## Changes Made

No game-code changes — this session packages the web build. Verified shell config (no edits needed):

- `AndroidManifest.xml:18` — `android:screenOrientation="portrait"` (already locked)
- `styles.xml:21` — `android:windowBackground #03001d` (blended launch background)

```powershell
npm run build            # dist/ rebuilt (42 static-copied items)
npx cap sync android     # dist/ → android/app/src/main/assets/public (0.1s)
cd android; .\gradlew assembleDebug   # BUILD SUCCESSFUL, 34 executed / 59 up-to-date
```

Note: `npx cap sync` output under `android/app/src/main/assets/` is git-ignored — no repo diff from syncing.

## Install Routes (phone)

| Route | Steps |
|---|---|
| **USB** | Phone: tap Build number 7× → USB debugging → connect, accept RSA → `& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk` (adb not on PATH — use full SDK path) |
| **Manual sideload** | Copy APK to phone (Drive/email/USB) → tap → Install anyway → allow unknown apps |
| **GitHub Release (cable-free, recommended)** | Repo → Releases → Draft (`v1.0-android`) → attach APK → Publish; phone opens `/releases`, downloads APK, installs (Play Protect warning is normal for sideloads) |

APK is a snapshot: every game change needs rebuild → sync → `assembleDebug` → reinstall. Web link stays the zero-install fallback (needs internet).

## Verification

- `assembleDebug` green; APK timestamped today, 25.4 MB.
- On-device playtest pending (same checklist as web: fit, ship, touch, pause, audio after first tap).

## Commands Reference

```powershell
npm run build; npx cap sync android; cd android; .\gradlew assembleDebug
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r "android\app\build\outputs\apk\debug\app-debug.apk"
```

See also: [[10_Capacitor_APK]] (full guide), [[08_Roadmap]] Phase 6/7, [[32_Session_2026-10-15_Tablet_Phone_Desktop]].
