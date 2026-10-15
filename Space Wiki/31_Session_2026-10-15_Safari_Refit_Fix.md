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

## Follow-up 2: zoom guards + ?v=4 (same day)

Live already had FIT + refit + `?v=3`, yet iPhone showed slight stretch + cropped ship. Prime suspect: iOS ignores `user-scalable=no`, so a pinch/double-tap zoomed the page (Safari per-site zoom persists) — zoomed layout + `visualViewport.resize` refit = stretched, cropped canvas with the ship behind the toolbar. Fix in `Boot.js`: `gesturestart` / `gesturechange` / `dblclick` `preventDefault` (non-passive). Bumped script URLs `?v=3` → `?v=4` so the new `Boot.js` can't be served from cache. Decisive test: Safari **Private tab** (clean cache + default 100% zoom).

## Follow-up 3 (ROOT CAUSE): `ScaleManager.FIT` does not exist — use `SHOW_ALL`

Private-tab test still stretched/cropped top+bottom → genuine bug, not cache. Engine source proves it (`assets/libs/phaser.js`):

- Only constants are `EXACT_FIT = 0`, `NO_SCALE = 1`, `SHOW_ALL = 2` (`phaser.js:18571-18583`). **No `FIT`.**
- `setScreenSize` (`phaser.js:18912-18919`) branches only on `EXACT_FIT` / `SHOW_ALL` (+ fullscreen). `scaleMode = undefined` matches nothing → canvas CSS size never set → raw 540×960 backing store squeezed into the container = stretched + cropped, ship cut off.
- Timeline fits: first playtest ran `EXACT_FIT` (full-bleed, looked okay); breakage started when the `FIT` push went live.
- iPhone 13 (390×844) math with `SHOW_ALL`: mult = min(844/960, 390/540) = 0.722 → canvas 390×693, marginTop ≈ 75px. Ship (canvas-bottom − 70) visible. Flex container + Phaser margins compose correctly (auto margins absorb free space first — verified by spec, no double-centering).
- Fix: `src/Boot.js` → `Phaser.ScaleManager.SHOW_ALL` (+ comment). Script URLs `?v=4` → `?v=5`. `06_Responsive Scaling.md` living-doc blocks corrected; old session logs left as history.

## Follow-up 4: ?debug overlay (same day)

User confirmed via fresh home-screen icon: icon art fine, game canvas cropped top+bottom. Server fully verified (run #7 green, SHOW_ALL + ?v=5 + dvh CSS all live), so remote numbers needed: `index.html` has a `?debug`-gated DOM overlay (invisible in normal play) reporting `innerWidth/innerHeight`, `visualViewport`, DPR, canvas CSS size + margins + backing-store size, container rect, UA every 500ms. Open `https://itxbell.github.io/Mobile-Invaders/?debug` and read the lines back. (Note: overlay was unpushed at first, so no numbers could show — push before testing.)

## Follow-up 5: persistent per-site zoom (same day)

User: Safari worked at first, cropped top+bottom "after a few more tries". That progression = state accumulating between visits. Prime suspect: an accidental pinch during touch play set Safari per-site Page Zoom above 100% (iOS ignores `user-scalable=no`; the zoom persists per site across reloads). A zoomed layout plus the refit logic = magnified canvas with edges cropped. Zoom guards prevent future pinches but can't reset existing zoom — fix on device: aA → Page Zoom → 100%. Debug overlay extended with `visualViewport.scale` + `outerWidth/innerWidth` zoom estimate to confirm remotely.

## Follow-up 6 (RESOLVED): stale home-screen icon (same day)

User: Safari tab renders correctly; home-screen icon still cropped. Conclusion: the icon was created before the `SHOW_ALL` push and its standalone storage runs the old broken scaler — Safari fixes (pushes, cache clears, Private tabs) never reach it. Fix is device-side only: delete icon → re-add from the working Safari page → launch. Rule going forward: **re-create the home-screen icon after every game-code push**, or you're playtesting the past.

## Commands Reference

```powershell
node --check src/Boot.js
npm run build
git add src/Boot.js src/style.css "Space Wiki/31_Session_2026-10-15_Safari_Refit_Fix.md" "Space Wiki/Welcome.md"; git commit -m "fix: refit canvas on Safari viewport changes"; git push origin main
```

See also: [[06_Responsive Scaling]], [[28_Session_2026-10-12_FIT_Blended_Bars_Implementation]].
