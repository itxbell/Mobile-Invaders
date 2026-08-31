# Session 2026-08-13 — Emulator Launch & APK Verification

## Goal

Run the Space-Invaders-Aquatic-Pests APK on the Android emulator, verify the installed APK is up to date with the latest source, and fix the "game not visible" symptom after launch.

## Environment

| Item | Value |
|---|---|
| Game source | `C:\Users\ina25\OneDrive\Desktop\Clone\Space-Invaders-Aquatic-Pests` |
| APK | `android\app\build\outputs\apk\debug\app-debug.apk` (26,317,753 bytes) |
| Package / activity | `org.wai.didymoinvaders` / `.MainActivity` (from `android\app\build.gradle`) |
| ANDROID_HOME | `C:\Users\ina25\AppData\Local\Android\Sdk` |
| adb (NOT on PATH) | `%ANDROID_HOME%\platform-tools\adb.exe` |
| emulator (NOT on PATH) | `%ANDROID_HOME%\emulator\emulator.exe` |
| AVD | `medium_phone` (Android 36, API 36, 1080×2400, x86_64) |

## Changes Made

### 1. Verified APK Is Up To Date

Compared timestamps: the APK was built **2026-08-06**, while the newest game source files date from **2026-07-28**. Since the APK is newer than every source file, no rebuild was required — it already contains the latest code.

### 2. Started the Emulator

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd medium_phone
```

Waited for boot with:

```powershell
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
& $adb shell getprop sys.boot_completed   # expect "1"
& $adb devices                            # expect "emulator-5554  device"
```

### 3. Installed & Launched the Game

```powershell
& $adb install -r "C:\Users\ina25\OneDrive\Desktop\Clone\Space-Invaders-Aquatic-Pests\android\app\build\outputs\apk\debug\app-debug.apk"
# -> Success

& $adb shell am start -n org.wai.didymoinvaders/.MainActivity
& $adb shell pidof org.wai.didymoinvaders   # -> process alive
```

### 4. Bug: Game Not Visible — Only Home Screen

The process was alive (`PID 5586`) and was even the focused app, but no window had focus:

```
mCurrentFocus=null
mFocusedApp=ActivityRecord{... org.wai.didymoinvaders/.MainActivity ...}
```

Diagnosis from `dumpsys power`:

```
mWakefulness=Asleep
```

**Root cause:** the emulator display had gone to sleep (screen off), so the activity's window could not be shown even though the process was running.

### 5. Fix: Wake Up + Dismiss Keyguard + Relaunch

```powershell
& $adb shell input keyevent KEYCODE_WAKEUP
& $adb shell wm dismiss-keyguard
& $adb shell am start -n org.wai.didymoinvaders/.MainActivity
```

Verification — window now has focus:

```
mCurrentFocus=Window{... org.wai.didymoinvaders/org.wai.didymoinvaders.MainActivity}
mWakefulness=Awake
```

Game renders on the emulator screen.

## Takeaways

- `adb` and `emulator` are **not** on `PATH` — always use the full SDK paths above.
- A running game process is not proof the game is visible: always check `dumpsys window` for `mCurrentFocus` and `dumpsys power` for `mWakefulness` when the screen looks blank.
- The exact same install/launch commands work for any future APK deploy (see Commands Reference).

## Commands Reference

```powershell
# One-shot: launch game in emulator
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$emu = "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe"

& $emu -avd medium_phone
# wait for: & $adb shell getprop sys.boot_completed -> "1"

& $adb install -r <path>\app-debug.apk
& $adb shell am start -n org.wai.didymoinvaders/.MainActivity

# If only home screen shows:
& $adb shell input keyevent KEYCODE_WAKEUP
& $adb shell wm dismiss-keyguard
& $adb shell am start -n org.wai.didymoinvaders/.MainActivity
```

## Git Status

- Game repo (`Desktop\Clone\Space-Invaders-Aquatic-Pests`): 14 source files modified, `android/` untracked — unchanged from the previous session; no new code changes today.
- Wiki repo (`OneDrive\Documents\GitHub\Mobile-Invaders`): base docs modified, session/capacitor docs untracked; this session doc is added alongside them.
