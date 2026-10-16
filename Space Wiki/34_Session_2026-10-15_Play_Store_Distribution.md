# Session 2026-10-15 — Play Store Distribution (Why Sideload vs Play Listing)

## Goal

Answer: "why can't I just develop the app and have people download it from Google Play?" — clarify that there is no technical blocker for Android, only release packaging + store account steps.

## Environment

| Item | Value |
|---|---|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` (branch `main`) |
| App ID / name | `org.wai.didymoinvaders` / Space Invaders Aquatic Pests |
| Current artifact | `android/app/build/outputs/apk/debug/app-debug.apk` (~25.4 MB, `versionCode 1`, `versionName 1.0`, debug-signed) |
| Wrapper | Capacitor 8 (`webDir: dist`) |
| Web build in APK | 540x960 portrait, `SHOW_ALL`, refit listeners, `?v=6` |
| Live fallback | `https://itxbell.github.io/Mobile-Invaders/` |

## Changes Made

No game-code changes — docs only. Finding:

### 1. You CAN publish to Google Play — 3 gates only

| Gate | Current state | Needed for Play |
|---|---|---|
| Build type | `app-debug.apk` (debug key, sideload/test only — Play rejects it) | Signed release: `app-release.aab` via Android Studio **Build > Generate Signed Bundle / APK** (own keystore, 5 min one-time) |
| Developer account | None | Google Play Developer account — one-time $25 + ID verification |
| Store listing | None | Name, icon (ship icon exists), 2+ screenshots, description, content-rating questionnaire (all-ages educational), privacy-policy URL (required even with zero data collection — can host 1 page on GitHub Pages), modern target SDK (Capacitor 8 already compliant) |

No rewrite, no Mac (unlike iOS), same `SHOW_ALL` web build inside Capacitor.

### 2. Manual sideload (Option B) behavior — documented

- Drive link → "Can't preview this file" + **Download** button (one tap, not auto-download).
- Email/WhatsApp attachment → tap to download, tap again to install.
- Android never silent-installs: always requires Download + Install taps + `Install unknown apps` permission for that source app + Play Protect "Install anyway" acknowledgement (normal for sideloads).
- After install: app appears as Space Invaders Aquatic Pests, portrait-locked, offline-capable.

### 3. Correct status phrasing

> "The game is currently distributed as a direct APK sideload for testing. Play Store release is pending a signed release build and a Play Developer account."

## Issues Encountered

- Confusion "can't develop an app for Play" → root cause: conflating debug APK (what we have) with release AAB (what Play wants). Fix: docs distinction above, no code change.

## Verification

- Read-only check: `capacitor.config.json` (`appId`, `webDir: dist`), `vite.config.js` (`base: './'` + `viteStaticCopy`), `android/app/build/outputs/apk/debug/output-metadata.json` (debug variant confirmed) — shell already `portrait`-locked + `#03001d` launch bg (see [[33_Session_2026-10-15_Android_APK_Native_App]]).
- No build run in this session.

## Commands Reference

```powershell
# Release path (when ready for Play):
npm run build; npx cap sync android; cd android
# then in Android Studio: Build > Generate Signed Bundle / APK > Android App Bundle > new/existing keystore
# upload .aab to Play Console > Internal test track first

# Current debug sideload path (unchanged):
# android\app\build\outputs\apk\debug\app-debug.apk -> Drive/email -> phone Download -> Install anyway
```

## Git Status

Docs only: this log + `Welcome.md` index link + `08_Roadmap` Phase 7 breakdown.

See also: [[10_Capacitor_APK]] (full guide), [[33_Session_2026-10-15_Android_APK_Native_App]], [[08_Roadmap]] Phase 6/7, [[16_Running_in_Web_Browser]].
