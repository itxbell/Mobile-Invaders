var SpaceInvaders = {};

SpaceInvaders.Boot = function(game) {};

SpaceInvaders.Boot.prototype = {
    preload: function() {
        this.load.image('preloaderBar', 'assets/images/loader_bar.png');
    },
    
    create: function() {
        this.input.maxPointers = 2;
        this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.stage.backgroundColor = '#03001d';

        // Re-fit the canvas when Safari's toolbar shows/hides (e.g. reopening
        // the tab) — otherwise the canvas keeps the old size and looks cropped.
        var scale = this.scale;
        var refit = function () { scale.refresh(); };
        window.addEventListener('resize', refit);
        window.addEventListener('orientationchange', refit);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', refit);
        }

        this.state.start('Preloader');
    }
};