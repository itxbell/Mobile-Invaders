# Session 2026-10-15 — Tablet / Phone / Desktop Responsiveness Pass

## Goal

Prove the game is responsive on phone, tablet, and desktop with screenshots (not claims), and harden the remaining gaps.

## Verification (Playwright, local `preview` build = live code)

| Viewport | Result |
|---|---|
| Phone 390×844 (iPhone 13) title + gameplay | Full-width, HUD/pause/grid/ship visible, blended top/bottom bars, undistorted |
| Tablet 820×1180 gameplay | 664px canvas centered, side bars blended, all elements visible |
| Desktop 1280×800 gameplay | 450×800 canvas centered, side bars blended; full-canvas shot shows ship |
| Phone landscape 844×390 | 219×390 canvas centered — correct but small (portrait game) |
| Console | 0 errors after favicon fix (was: `favicon.ico` 404) |

`SHOW_ALL` math holds on all four: uniform scale, no stretch possible; only bar thickness varies.

## Changes Made

### 1. `index.html`
- Viewport: added `interactive-widget=resizes-content` (layout viewport tracks overlay toolbars on iOS 26 + Android Chrome; resize events fire so the Boot refit runs).
- Inline SVG favicon (ship colors on `#03001d`) — kills the 404, gives desktop tabs an icon.
- `#rotateHint` banner div (hidden default, `pointer-events:none`).
- Script URLs `?v=5` → `?v=6` (Boot/index changed).

### 2. `src/Boot.js` — `refit()` also toggles the hint + runs once at boot
- Shows "Rotate your device for the full portrait view" only when landscape AND height < 500px; hidden otherwise (verified both states in screenshots).

## Scope Note

Portrait 540×960 design is kept — desktop/tablet get a centered full-height game with blended side bars, not a redesigned landscape layout (that would be the `06_Responsive Scaling` Phase 2 rewrite: proportional positions for every element). Landscape phones stay playable with the rotate hint.

## Commands Reference

```powershell
npm run build
# local proof: npm run preview -- --port 4173 --host 127.0.0.1  (then Playwright screenshots)
git add index.html src/Boot.js "Space Wiki/32_Session_2026-10-15_Tablet_Phone_Desktop.md" "Space Wiki/Welcome.md"; git commit -m "feat: responsive hardening for tablet/desktop, rotate hint, favicon"; git push origin main
```

See also: [[06_Responsive Scaling]], [[31_Session_2026-10-15_Safari_Refit_Fix]].
