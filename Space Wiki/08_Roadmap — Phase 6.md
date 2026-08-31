# Phase 6: Capacitor Native Wrapper — Complete ✅

## Checklist

- [x] Install Capacitor CLI
  - `npm install @capacitor/core @capacitor/cli @capacitor/android`
- [x] `npx cap init` in project
  - App name: "Space Invaders Aquatic Pests"
  - App ID: "org.wai.didymoinvaders"
- [x] `npx cap add android`
- [x] Add `vite-plugin-static-copy` to handle non-module scripts
- [x] Copy web build to native project (`npx cap sync`)
- [x] Build Android APK (`.\gradlew assembleDebug`)
- [x] Test on emulator (AVD medium_phone, API 36, 1080×2400)

## Notes

- Android Studio bundled JBR (`C:\Program Files\Android\Android Studio\jbr`) used as JAVA_HOME
- Scripts are loaded via `<script>` tags (not ES modules), so `vite-plugin-static-copy` copies them to dist as-is
- Orientation locked to `portrait` in `AndroidManifest.xml`
- See [[10_Capacitor_APK]] for full build guide
