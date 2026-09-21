var SpaceInvaders = SpaceInvaders || {};

// Define GameLevel2 as a new state that extends Game
SpaceInvaders.GameLevel3 = function(game) {
    // Call the base Game constructor
    SpaceInvaders.Game.call(this, game);
};

// Inherit from Game
SpaceInvaders.GameLevel3.prototype = Object.create(SpaceInvaders.Game.prototype);
SpaceInvaders.GameLevel3.prototype.constructor = SpaceInvaders.GameLevel3;

SpaceInvaders.GameLevel3.prototype.create = function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.buildWorld();
    this.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
    if (this.music) { this.music.stop(); } // stop previous music
    this.music = this.add.audio('level3Music');
    this.music.volume = 0.7;
    this.music.loop = true;
    this.music.play();
    this.shootSfx = this.add.audio('shootSfx');
	this.enemyDeathSfx = this.add.audio('enemyDeathSfx');
	this.shipDeathSfx = this.add.audio('shipDeathSfx');
};

// Optional: initialize with score carried over from Level 1
SpaceInvaders.GameLevel3.prototype.init = function(scoreFromLevel2){
    this.score = scoreFromLevel2 || 0;
    this.currentWeapon = 'dry' // continue score
    this.gameover = false;
    this.isPaused = false;
    this.bulletTime = 0;
    this.invaderBulletTime = 0;
    this.livingEnemies = [];
    this.totalInvaders = this.totalRow * this.totalInvadersRow;
};

// Override buildWorld to change background or tweak level setup
SpaceInvaders.GameLevel3.prototype.buildWorld = function(){
    var bg = this.add.image(0, 0, 'levelBG3');
    bg.width = this.world.width;
    bg.height = this.world.height;
      
    this.buildInvaders();
    this.buildShip();
    this.buildBullets();
    this.buildInvadersBullets();
    this.buildStateText();
    this.buildUI();
    this.buildInvadersExplosions();
    this.buildShipExplosion();
};

SpaceInvaders.GameLevel3.prototype.invadersCount = function(){
    this.totalInvaders--;
    if(this.totalInvaders == 0){
        this.stateText.text = " Final Level Complete!\n Click to continue";
        this.centerStateText();
        this.stateText.visible = true;
        this.gameover = true;

        this.game.input.onTap.addOnce(function(){
            if(this.music){ this.music.stop(); }
            this.state.start('FactCard3', true, false, this.score);
        }, this);
    }
};

SpaceInvaders.GameLevel3.prototype.restartGame = function(){
    if(this.game.paused){
        this.game.paused = false;
        this.hidePauseOverlay();
    }
    if(this.music){ this.music.stop(); } // stop Level 3 music
    if(this.shipDeathSfx && this.shipDeathSfx.isPlaying){ 
        this.shipDeathSfx.stop();          // 🔊 stop death sound effect
    }
    this.totalInvaders = this.totalRow * this.totalInvadersRow;
    this.gameover = false;
    this.livingEnemies.length = 0;  
    this.state.start('GameLevel3', true, false);
};

