# Session 2026-10-15 — GitHub Pages Plain-Link Deploy (No PWA)

## Goal

Make the game playable on an actual Android phone via a plain website link — no PWA (no manifest, no service worker). Fix the "localhost can't be reached" phone issue and ship a shareable URL.

## Environment

| Item | Value |
|---|---|
| Game source | `C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders` (branch `main`) |
| Remote | `https://github.com/itxbell/Mobile-Invaders.git` (public) |
| Node / npm | v24.18.0 / 11.16.0 (CI uses Node 20) |
| Live link | `https://itxbell.github.io/Mobile-Invaders/` |
| PC LAN IP | `192.168.1.115` |
| Commit | `679a697` Create deploy.yml |

## Changes Made

### 1. New deploy workflow (`.github/workflows/deploy.yml`)

Standard Vite Pages pipeline — no game code changed:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build: # checkout, setup-node 20, npm ci, npm run build, upload-pages-artifact (path: dist)
  deploy: # actions/deploy-pages@v4, environment github-pages
```

Why this works untouched: `vite.config.js` already has `base: './'` and `dist/index.html` uses relative paths (`assets/libs/phaser.js`, `src/*.js`, `./assets/*.css`), so the project-subpath URL resolves. `dist/` is gitignored, so Source must be **GitHub Actions** (not branch). No manifest/SW — plain link has no offline support by design.

### 2. Repo setting (manual, browser)

Settings → Pages → Source → **GitHub Actions** (`https://github.com/itxbell/Mobile-Invaders/settings/pages`).

### 3. Wiki updates (this change)

- This log, `Welcome.md` index link, `16_Running_in_Web_Browser.md` live-link + phone-LAN sections.

## Issues Encountered

- **`localhost:5173` unreachable on phone → root cause:** `localhost` on the phone is the phone itself, and `vite` without `--host` listens on `::1` only (verified `Get-NetTCPConnection`: `::1:5173 Listen`). Fix: `npm run dev -- --host` / `npm run preview -- --host --port 4173`, phone opens `http://192.168.1.115:5173` (same Wi-Fi).
- **Deploy job 404 `Failed to create deployment ... Ensure GitHub Pages has been enabled` → root cause:** first run fired while Pages Source was still unset. Build job was fully green (checkout → `npm ci` → `npm run build` → upload artifact). Fix: set Source to GitHub Actions, then Actions → Re-run failed jobs. Re-run went green.
- **"Can't see Build and deployment" → root cause:** wrong account or wrong settings page. Fix: log in as `itxbell`, use the direct `/settings/pages` URL. Repo is public, so no plan limitation.

## Verification

- `npm run build` → success (only pre-existing non-module `<script>` warnings; `vite-plugin-static-copy` copied 41 items), `dist/` = 50 files, all relative refs.
- Actions run #1 re-run → build green + deploy green.
- `GET https://itxbell.github.io/Mobile-Invaders/` → serves page, title "Space Invaders x Aquatic Pests".
- Phone test pending: open link in Android Chrome on Wi-Fi, wait through ~24 MB first load (see [[07_Performance]] asset sizes).

## Commands Reference

```powershell
npm run build
npm run preview -- --host --port 4173
# phone (same Wi-Fi): http://192.168.1.115:4173
git add .github/workflows/deploy.yml; git commit -m "ci: deploy to GitHub Pages"; git push
```

## Git Status

Committed + pushed: `.github/workflows/deploy.yml` (`679a697`, HEAD == origin/main).
Unrelated modified (pre-existing): `Space Wiki/*`, `android/.../styles.xml`, `index.html`, `src/Boot.js`, `src/style.css`.

See also: [[16_Running_in_Web_Browser]], [[10_Capacitor_APK]] (APK path unchanged), [[08_Roadmap]] Phase 7.
