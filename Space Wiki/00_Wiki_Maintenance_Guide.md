# Wiki Maintenance Guide

## Purpose
This document defines the standards and procedures for maintaining the **Space Invaders × Aquatic Pests** development wiki. Every code change, architectural decision, and session outcome must be documented here.

---

## Wiki Structure

| File | Purpose | When to Update |
|------|---------|----------------|
| `Welcome.md` | Index with links to all docs | When adding new documents |
| `01_Project Overview.md` | Game concept, audience, tech stack | Major scope changes |
| `02_Architecture.md` | File structure, state flow, data flow | Code restructure, new states |
| `03_Mobile Strategy.md` | PWA → Capacitor approach | Platform decisions |
| `04_Game Design.md` | Levels, weapons, scoring, controls | Gameplay changes |
| `05_Touch Controls.md` | Touch implementation details | Touch control modifications |
| `06_Responsive Scaling.md` | Portrait scaling, grid, text fit | Layout/resolution changes |
| `07_Performance.md` | Asset optimization, profiling | Performance work |
| `08_Roadmap.md` | Phase checklists, milestones | Phase completion, new tasks |
| `09_Limits & Scope.md` | Constraints, out-of-scope items | Scope discussions |
| `10_Capacitor_APK.md` | Full build guide | Build process changes |
| `11_Session_*.md` | Session logs | **After every work session** |
| `12_Session_*.md` | Session logs | **After every work session** |
| `13_*.md` | Technical deep-dives | When investigating issues |
| `14_Session_*.md` | Session logs | **After every work session** |

---

## Session Documentation Protocol

### Required: Create Session Log After Every Work Session

**Naming:** `NN_Session_YYYY-MM-DD_Short_Description.md`

**Template:**
```markdown
# Session YYYY-MM-DD — Short Description

## Goal
What you set out to accomplish.

## Environment
| Item | Value |
|------|-------|
| Game source | Path |
| Key tools | Versions |

## Changes Made
### 1. Category (File:line)
Description of change with file paths and line numbers.

### 2. Category (File:line)
...

## Issues Encountered
- Problem → Root cause → Fix

## Verification
- Commands run
- Test results

## Commands Reference
```powershell
# Reproducible commands
```

## Git Status
Uncommitted files, untracked dirs
```

---

## Documentation Standards

### File References
- Use `[[Wiki_Link]]` format for cross-references
- Reference code as `file_path:line_number`
- Include before/after code blocks for changes

### Code Changes
- **Always** document: file, function, line numbers, what changed, why
- Include the exact diff (old → new) for non-trivial changes
- Note inheritance impacts (e.g., "Level 2/3 inherit from Game.prototype")

### Bug Fixes
- Document the bug, root cause, and fix
- Reference the original issue if tracked
- Note any regression risk

### Mobile-Specific
- Test device/emulator used
- Screen resolution tested
- Orientation behavior
- Touch vs keyboard behavior

---

## Update Triggers

| Trigger | Action |
|---------|--------|
| New feature implemented | Update relevant design doc + session log |
| Bug fixed | Update Architecture/Issues + session log |
| Build process changed | Update Capacitor_APK + session log |
| Scaling/layout modified | Update Responsive Scaling + session log |
| Touch controls changed | Update Touch Controls + session log |
| Performance work done | Update Performance + session log |
| Roadmap milestone hit | Update Roadmap checkboxes |
| Scope decision made | Update Limits & Scope |

---

## Version Control

- Wiki lives in `Space Wiki/` folder
- Commit wiki changes with code changes in same commit
- Commit message format: `docs: <area> - <description>`
  - Example: `docs: touch controls - added swipe gesture support`

---

## Obsidian-Specific

- `.obsidian/` folder contains vault config (do not edit manually)
- Use `[[Wiki Links]]` for internal navigation
- Tags: `#phase-1`, `#bug`, `#mobile`, `#performance` for filtering
- Graph view shows document relationships

---

## Quality Checklist (Before Committing)

- [ ] Session log created with template
- [ ] All cross-references use `[[Link]]` format
- [ ] Code references include `file:line`
- [ ] Before/after code shown for changes
- [ ] Verification commands included
- [ ] Git status noted
- [ ] Related design docs updated
- [ ] Roadmap checkboxes updated if milestone hit

---

## Quick Reference: Common Commands

```powershell
# Build & deploy
npm run build; npx cap sync; cd android; .\gradlew assembleDebug; adb install -r app\build\outputs\apk\debug\app-debug.apk

# Check JS errors
adb logcat -c; adb shell am start -n org.wai.didymoinvaders/.MainActivity; adb logcat | Select-String "Uncaught"

# Wake emulator if screen off
adb shell input keyevent KEYCODE_WAKEUP; adb shell wm dismiss-keyguard

# Java fix for Gradle
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

---

## Contact / Ownership

- Maintainer: Development team
- Wiki location: `Mobile-Invaders/Space Wiki/`
- Game repo: `https://github.com/gostikhan/Space-Invaders-Aquatic-Pests`