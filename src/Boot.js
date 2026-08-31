var SpaceInvaders = {};

SpaceInvaders.Boot = function(game) {};

SpaceInvaders.Boot.prototype = {
    preload: function() {
        this.load.image('preloaderBar', 'assets/images/loader_bar.png');
    },
    
    create: function() {
        this.input.maxPointers = 2;
        this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.stage.backgroundColor = '#171642';
        
        this.state.start('Preloader');
    }
};