SpaceInvaders.Preloader = function(game) {
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

SpaceInvaders.Preloader.prototype = {
	
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
       	this.load.image('titlescreen', 'assets/images/TitleBG1.jpg');
		this.load.audio('titleMusic', 'assets/audio/TitleMusic.mp3');
        this.load.image('ship', 'assets/images/ship.png');
        this.load.image('bullet', 'assets/images/cleanBlaster.png');
        this.load.image('invaderBullet', 'assets/images/invaderblaster.png');
        this.load.bitmapFont('eightbitwonder', 'assets/fonts/eightbitwonder.png', 'assets/fonts/eightbitwonder.fnt');       
        this.load.atlasJSONArray('invaders', 'assets/images/spritesheets/invaders.png', 'assets/images/spritesheets/invaders.json');
		this.load.image('levelBG', 'assets/images/river_map.png');
		this.load.image('levelBG2', 'assets/images/wanaka_map.png');
		this.load.image('levelBG3', 'assets/images/shed_map.png');
		this.load.image('factCard1', 'assets/images/FactCard1.png');
		this.load.image('factCard2', 'assets/images/FactCard2.png');
		this.load.image('factCard3', 'assets/images/FactCard3.png');
		this.load.image('End', 'assets/images/End.jpg');
		this.load.audio('level1Music', 'assets/audio/Level1Music.mp3');
		this.load.audio('level2Music', 'assets/audio/Level2Music.mp3');
		this.load.audio('level3Music', 'assets/audio/Level3Music.mp3');
		this.load.image('checkRay', 'assets/images/checkRay.jpg');
		this.load.image('cleanBlaster', 'assets/images/cleanBlaster.png');
		this.load.image('dryBeam', 'assets/images/dryBeam.png');
		this.load.image('dock', 'assets/images/dock.png');
		
		this.load.audio('shootSfx', 'assets/audio/shootSfx.mp3');
		this.load.audio('enemyDeathSfx', 'assets/audio/enemyDeathSfx.mp3');
		this.load.audio('shipDeathSfx', 'assets/audio/shipDeathSfx.mp3');
	},	

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
	   	this.ready = true;
        this.state.start('StartMenu');
	}
};