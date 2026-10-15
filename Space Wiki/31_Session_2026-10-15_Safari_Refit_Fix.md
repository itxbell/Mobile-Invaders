# Session 2026-10-15 — Safari Reopen Refit Fix (dvh + scale.refresh)

## Goal

Fix iPhone Safari losing the fit after closing/reopening the tab: first playtest fine, reopened tab cropped or stretched.

## Root Cause

Two stacked issues, both confirmed by fetching the live build:

1. **Live ran `EXACT_FIT`** (`src/Boot.js` at HEAD) while local had `FIT` unpushed — stretch amount depended on whatever container Safari gave at load.
2. **Safari toolbar changes the viewport after load.** `100vh` includes the area behind the toolbar, so the centered canvas is measured against the wrong height when the tab is restored with a different toolbar state. Phaser 2 only fits once at boot — nothing re-fits on toolbar show/hide.

## Changes Made

### 1. `src/Boot.js` — refit listeners + FIT (also ships the pending FIT switch)

```javascript
var scale = this.scale;
var refit = function () { scale.refresh(); };
window.addEventListener('resize', refit);
window.addEventListener('orientationchange', refit);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', refit);
}
```

`Phaser.ScaleManager#refresh()` (`assets/libs/phaser.js:18843`) re-calculates scale mode + screen size. `visualViewport.resize` is the event Safari fires specifically for toolbar show/hide.

### 2. `src/style.css` — dynamic viewport + locked body

- `#gameContainer`, `body`: `height: 100vh` fallback + `height: 100dvh` (tracks the toolbar).
- `html, body`: `height: 100%; overflow: hidden; overscroll-behavior: none`.
- `body`: `position: fixed; left/top 0; width 100%` — stops scroll/bounce shifting the canvas.

### 3. Behavior note

This push also moves live from `EXACT_FIT` → `FIT` + blended `#03001d` bars (the [[27_Session_2026-10-09_Responsive_FIT_Blended_Bars]] decision). No stretch anymore; thin bars on 9:20 screens.

## Verification

- `node --check src/Boot.js` OK; `npm run build` success; `dist/src/Boot.js` has listeners; `dist` CSS contains `100dvh` + `position:fixed`.
- Phone test pending: fresh load → background Safari → reopen → rotate → toolbar show/hide; canvas must stay fitted, ship visible.

## Follow-up: still broken → stale JS + bfcache (same day)

The refit fix was confirmed live (`Boot.js` fetched from Pages had it) yet iPhone still misfit on reopen. Deeper causes found:

1. **Stale game scripts.** `vite-plugin-static-copy` copies `src/*.js` verbatim — no content hash, unlike bundled assets. Safari kept running the old cached `Boot.js`. Fix: `?v=3` query on all `<script>`/`<link>` URLs in `index.html` (bump on future JS/CSS changes).
2. **bfcache restore runs no `resize`.** Reopened Safari tabs restore from memory; only `pageshow` fires. Fix: `window.addEventListener('pageshow', refit)` in `Boot.js`.

Retest protocol: push → green → force-quit Safari → fresh load (not tab restore) → background → reopen.

## Commands Reference

```powershell
node --check src/Boot.js
npm run build
git add src/Boot.js src/style.css "Space Wiki/31_Session_2026-10-15_Safari_Refit_Fix.md" "Space Wiki/Welcome.md"; git commit -m "fix: refit canvas on Safari viewport changes"; git push origin main
```

See also: [[06_Responsive Scaling]], [[28_Session_2026-10-12_FIT_Blended_Bars_Implementation]].
