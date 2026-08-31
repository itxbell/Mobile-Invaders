# Capacitor APK Build Guide

## Overview

This guide walks through wrapping the **Space-Invaders-Aquatic-Pests** web game as a native Android APK using **Capacitor** — the official native runtime from the Ionic team.

Capacitor imports the Vite production build into a standard Android Studio project, then you build the APK from there.

**Prerequisite phases from [[08_Roadmap]]:**
- [ ] Phase 3: Touch Controls → [[05_Touch Controls]]
- [ ] Phase 4: Responsive Scaling → [[06_Responsive Scaling]]
- [ ] Phase 5: Bug Fixes & Polish

The game must be playable with touch input and properly scaled before wrapping.

---

## 1. Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 18+ | `node -v` |
| JDK | 17+ | `java -version` |
| Android Studio | Latest (2024+) | – |
| Gradle | Bundled with Android Studio | – |

### Android Studio Setup

> **Our verified working configuration:**
> - Android Studio 2024+ with bundled JBR (`C:\Program Files\Android\Android Studio\jbr`)
> - ANDROID_HOME = `%LOCALAPPDATA%\Android\Sdk`
> - API 36 (Android 16) for AVD, API 34 minimum for build target
> - Gradle wrapper bundled with Capacitor's `android/` project

1. Install Android Studio from [developer.android.com/studio](https://developer.android.com/studio)
2. During installation, ensure **Android SDK**, **Android SDK Platform 34**, and **Android Virtual Device** are selected
3. After install, open **SDK Manager** → SDK Platforms → install **Android 14 (API 34)**
4. Open **SDK Manager** → SDK Tools → install **Android SDK Build-Tools 34.0.0**
5. Set environment variable:

```powershell
# Add to your PowerShell profile or run once per session
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
# Add to PATH
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\cmdline-tools\latest\bin"
```

To make permanent, add via: System Properties → Environment Variables → New User Variable `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`

### Enable Developer Mode on Phone

1. Settings → About phone → Tap "Build number" 7 times
2. Settings → Developer options → Enable **USB debugging**
3. Connect phone via USB — accept the RSA key prompt

---

## 2. Install Capacitor

From the game project root:

```powershell
cd C:\Users\ina25\OneDrive\Desktop\Clone\Space-Invaders-Aquatic-Pests
npm install @capacitor/core @capacitor/cli @capacitor/android
```

Verify:

```powershell
npx cap --version
```

---

## 3. Configure the Web Build

### Important: Non-Module Scripts

This game uses Phaser 2 loaded via `<script>` tags (not ES modules). Vite does not bundle these — you must copy them to `dist/` as-is.

Install `vite-plugin-static-copy`:

```powershell
npm install -D vite-plugin-static-copy
```

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src', dest: '.' },
        { src: 'assets', dest: '.' },
      ]
    })
  ],
})
```

This copies the `src/` and `assets/` directories into `dist/` so the `<script>` tags resolve correctly.

Ensure Vite outputs to a `dist/` folder with relative paths:

```javascript
// vite.config.js — already done
export default defineConfig({
  base: './',
})
```

Build the game:

```powershell
npm run build
```

This creates `dist/` with all assets, scripts, and `index.html`.

---

## 4. Initialize Capacitor

```powershell
npx cap init
```

You'll be prompted for:
- **App name**: `Space Invaders Aquatic Pests`
- **App ID**: `org.wai.didymoinvaders` (or your preferred reverse-domain)

This creates a `capacitor.config.ts` (or `capacitor.config.json`):

```json
{
  "appId": "org.wai.didymoinvaders",
  "appName": "Space Invaders Aquatic Pests",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}
```

The `webDir` must point to `dist` — this is where Capacitor reads the built web files.

---

## 5. Add the Android Platform

```powershell
npx cap add android
```

This creates an `android/` folder — a full Android Studio project with a WebView that loads your game.

---

## 6. Sync Web Build to Android

Every time you rebuild the game (`npm run build`), sync the new files:

```powershell
npx cap copy
```

Or do both in one step:

```powershell
npx cap sync
```

`cap sync` runs `copy` + `update` (updates native dependencies).

---

## 7. Open in Android Studio

```powershell
npx cap open android
```

This launches Android Studio with the project loaded.

---

## 8. Build the APK

### Option A: From Android Studio (easier)

1. In Android Studio, wait for Gradle sync to finish
2. Menu → **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for the build to complete
4. A notification appears: *"APK(s) generated successfully"* → click **locate** or find at:

```
android\app\build\outputs\apk\debug\app-debug.apk
```

### Option B: Command Line

```powershell
cd android
.\gradlew assembleDebug
```

The APK is at `android\app\build\outputs\apk\debug\app-debug.apk`

### Release APK (for Play Store)

For a signed release build:

1. In Android Studio: **Build** → **Generate Signed Bundle / APK**
2. Create a keystore (or use existing)
3. Fill in key alias, passwords
4. Select `release` build variant
5. Output: `android\app\build\outputs\apk\release\app-release.apk`

---

## 9. Install APK on Phone

### Via ADB (recommended)

With phone connected via USB and USB debugging enabled:

```powershell
# Verify device is detected
adb devices

# Install the APK
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

### Manual sideload

1. Copy the `.apk` file to your phone (Google Drive, email, USB transfer)
2. On phone, open the file — you'll see a "Play Protect" warning
3. Tap **Install anyway** (or **Install**)
4. Enable **Install from unknown apps** if prompted

---

## 9.5. Install & Run on Emulator

### Create AVD (Android Virtual Device)

```powershell
# List available system images
$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager --list

# Install a system image (e.g., API 36 with Google Play)
$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager "system-images;android-36;google_apis_playstore;x86_64"

# Create the AVD
$env:ANDROID_HOME\cmdline-tools\latest\bin\avdmanager create avd -n medium_phone -k "system-images;android-36;google_apis_playstore;x86_64" -d "medium_phone"
```

### Launch Emulator

```powershell
# List available AVDs
$env:ANDROID_HOME\emulator\emulator -list-avds

# Start the emulator (keep this window open)
$env:ANDROID_HOME\emulator\emulator -avd medium_phone
```

### Install APK

```powershell
# Build the APK first (see §8), then:
adb install -r android\app\build\outputs\apk\debug\app-debug.apk

# Launch the app
adb shell am start -n "org.wai.didymoinvaders/org.wai.didymoinvaders.MainActivity"
```

### Debug with ADB Logcat

```powershell
# Clear old logs
adb logcat -c

# Launch app, then check for JS errors
adb logcat | Select-String "Uncaught"

# Or just see recent errors
adb logcat -d | Select-String "Uncaught"
```

### Using Android Studio's Bundled JDK

If `gradlew assembleDebug` fails with a JDK error, use the JDK bundled with Android Studio:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew assembleDebug
```

---

## 10. Run the App

- The app appears on your home screen / app drawer as **Space Invaders Aquatic Pests**
- Open it — the game runs fullscreen in a WebView
- Orientation should lock to landscape if configured in the manifest

---

## 11. Common Issues & Fixes

### White Screen on Launch

**Cause**: Files not loaded correctly (wrong `webDir` or `base` path)

**Fix**:
- Verify `vite.config.js` has `base: './'`
- Run `npx cap copy` again
- Open Chrome DevTools on the app via `chrome://inspect` → check console for 404s

### Game Doesn't Fill the Screen

**Cause**: WebView not configured for fullscreen

**Fix**: In `android/app/src/main/res/values/styles.xml`, ensure:

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowFullscreen">true</item>
    <item name="android:windowNoTitle">true</item>
</style>
```

### Touch Input Not Working

**Cause**: Touch controls not yet implemented in the game (see [[05_Touch Controls]])

**Fix**: Implement touch controls first — Capacitor wraps whatever the web build provides.

### Audio Not Playing

**Cause**: WebView requires user gesture before playing audio

**Fix**: Ensure audio playback starts from a user tap (start button), not on page load.

### Orientation Not Locking

**Fix**: In `android/app/src/main/AndroidManifest.xml`, add to the `<activity>` tag:

```xml
android:screenOrientation="portrait"
```

(Use `"portrait"` for portrait games, `"landscape"` for landscape games.)

### 1080×2400 Display Letterboxing

With `Phaser.ScaleManager.FIT` and a 540×960 (9:16) game on a 1080×2400 (9:20) screen:
- Game fills the width perfectly
- ~240px black bars appear at top and bottom

**Fixes:**
1. `Phaser.ScaleManager.EXACT_FIT` — fills all space, slight stretch
2. Change game resolution to match 9:20 aspect (e.g., 540×1200)
3. CSS override: `canvas { width: 100vw !important; height: 100vh !important; }`
4. Use `RESIZE` scale mode with fully dynamic layout (most flexible)

---

## 12. Rebuilding Workflow

Every time you change game code:

```powershell
npm run build          # Rebuild the web distribution
npx cap copy           # Copy to Android project
npx cap open android   # Optional: open Android Studio
# Build APK via Android Studio or ./gradlew assembleDebug
```

---

## 13. Removing Capacitor (if needed)

```powershell
npx cap remove android
Remove-Item -Recurse -Force android
npm uninstall @capacitor/core @capacitor/cli @capacitor/android
```

---

## References

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Capacitor Configuration](https://capacitorjs.com/docs/config)
- [[03_Mobile Strategy]] — overall mobile approach
- [[08_Roadmap — Phase 6]] — roadmap checklist
- [[11_Session_2026-07-28_Portrait_Capacitor]] — session log with all changes
