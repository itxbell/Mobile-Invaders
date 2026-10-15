var SpaceInvaders = {};

SpaceInvaders.Boot = function(game) {};

SpaceInvaders.Boot.prototype = {
    preload: function() {
        this.load.image('preloaderBar', 'assets/images/loader_bar.png');
    },
    
    create: function() {
        this.input.maxPointers = 2;
        this.stage.disableVisibilityChange = true;

        // NOTE: this Phaser build has no ScaleManager.FIT (undefined) — SHOW_ALL
        // is the fit-inside-preserve-aspect mode. FIT silently broke scaling.
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.stage.backgroundColor = '#03001d';

        // Re-fit the canvas when Safari's toolbar shows/hides (e.g. reopening
        // the tab) — otherwise the canvas keeps the old size and looks cropped.
        var scale = this.scale;
        var refit = function () { scale.refresh(); };
        window.addEventListener('resize', refit);
        window.addEventListener('orientationchange', refit);
        // bfcache restore (Safari reopen) runs no resize — refit explicitly.
        window.addEventListener('pageshow', refit);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', refit);
        }

        // iOS ignores user-scalable=no — block pinch/double-tap zoom or the
        // canvas ends up zoomed (= looks stretched/cropped, ship unreachable).
        // { passive: false } is required for preventDefault to work.
        document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, { passive: false });
        document.addEventListener('gesturechange', function (e) { e.preventDefault(); }, { passive: false });
        document.addEventListener('dblclick', function (e) { e.preventDefault(); }, { passive: false });

        this.state.start('Preloader');
    }
};