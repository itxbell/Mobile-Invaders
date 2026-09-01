SpaceInvaders.Game = function (game) {
	this.invaders;
	this.totalRow;
	this.totalInvadersRow;
	this.ship;
	this.bullets;
	this.invadersBullets;
	this.bulletTime = 0;
	this.invaderBulletTime = 0;
	this.stateText;
	this.scoreText;
	this.totalRow = 7;
	this.totalInvadersRow = 5;
	this.totalInvaders = this.totalRow * this.totalInvadersRow;
	this.score = 0;
	this.gameover = false;
	this.totalLives = 3;
	this.livingEnemies = [];
	this.music = null;
	this.currentWeapon = 'check';

};

SpaceInvaders.Game.prototype.init = function (score) {
	this.score = score || 0;
	this.currentWeapon = 'check';
	this.gameover = false;
	this.bulletTime = 0;
	this.invaderBulletTime = 0;
	this.livingEnemies = [];
	this.totalInvaders = this.totalRow * this.totalInvadersRow;
};

SpaceInvaders.Game.prototype = {

	create: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.buildWorld();
		this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);

		// Play background music for Level 1
		this.music = this.add.audio('level1Music');
		this.music.volume = 0.7;
		this.music.loop = true;   // keep looping
		this.music.play();

		this.shootSfx = this.add.audio('shootSfx');
		this.enemyDeathSfx = this.add.audio('enemyDeathSfx');
		this.shipDeathSfx = this.add.audio('shipDeathSfx');
	},


	buildWorld: function () {
		var bg = this.add.image(0, 0, 'levelBG');
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
	},

	buildInvaders: function () {
		this.invaders = this.add.group();
		this.invaders.enableBody = true;
		this.invaders.physicsBodyType = Phaser.Physics.ARCADE;
		for (var i = 0; i < this.totalRow; i++) {
			for (var j = 0; j < this.totalInvadersRow; j++) {

				var invader = this.invaders.create(20 + j * 100, 80 + i * 55, 'invaders', '_invader0000');
				invader.name = 'invader' + j;
				invader.anchor.setTo(0.5, 0.5);
				invader.body.moves = false;
				invader.scale.setTo(0.7, 0.7);

				if (i == 0) {
					invader.animations.add('invader01', this.game.math.numberArray(1, 48));
					invader.animations.play('invader01', 24, true);
				} else if (i == 1 || i == 2) {
					invader.animations.add('invader03', this.game.math.numberArray(96, 143));
					invader.animations.play('invader03', 24, true);
				} else {
					invader.animations.add('invader02', this.game.math.numberArray(49, 95));
					invader.animations.play('invader02', 24, true);
				}
			}
		}
		//All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
		var tween = this.add.tween(this.invaders).to({ x: this.world.width - 100 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		//When the tween loops it calls > flyDown
		tween.onLoop.add(this.flyDown, this);
	},


	buildInvadersExplosions: function () {
		this.invadersExplosions = this.add.group();
		this.invadersExplosions.enableBody = true;
		this.invadersExplosions.physicsBodyType = Phaser.Physics.ARCADE;
		for (var i = 0; i < this.totalInvaders * 2; i++) {
			console.log('roar');
			var e = this.invadersExplosions.create(0, 0, 'invaders', '_invader0000');
			e.name = 'invaderExplosion' + i;
			e.anchor.setTo(0.5, 0.5);
			e.exists = false;
			e.visible = false;
			e.animations.add('invaderExplosion', this.game.math.numberArray(144, 157));
			// e.animations.play('invaderExplosion', 24, false);
		}
	},

	buildShipExplosion: function () {
		this.shipExplosions = this.add.group();
		this.shipExplosions.enableBody = true;
		this.shipExplosions.physicsBodyType = Phaser.Physics.ARCADE;
		for (var i = 0; i < this.totalLives; i++) {
			var e = this.shipExplosions.create(0, 0, 'invaders', '_invader0000');
			e.name = 'shipExplosion' + i;
			e.anchor.setTo(0.5, 0.5);
			e.exists = false;
			e.visible = false;
			e.animations.add('shipExplosion', this.game.math.numberArray(158, 172));
		}
	},



	buildShip: function () {
		this.ship = this.add.sprite(this.world.centerX, this.world.height - 70, 'ship');
		this.ship.enableBody = true;
		this.ship.anchor.setTo(0.5, 0.5);
		this.ship.visible = true;
		this.ship.alpha = 1;
		this.physics.enable(this.ship, Phaser.Physics.ARCADE);
		this.ship.scale.setTo(1.35, 1.35);
		this.ship.body.collideWorldBounds = true;
		this.ship.bringToTop();
	},

	buildBullets: function () {
		this.bullets = this.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		for (var i = 0; i < 20; i++) {
			var b = this.bullets.create(0, 0, 'bullet');
			b.name = 'bullet' + i;
			b.exists = false;
			b.visible = true;
			b.alpha = 1;
			b.checkWorldBounds = true;
			b.events.onOutOfBounds.add(this.resetBullet, this);
		}
	},


	buildInvadersBullets: function () {
		this.invadersBullets = this.add.group();
		this.invadersBullets.enableBody = true;
		this.invadersBullets.physicsBodyType = Phaser.Physics.ARCADE;
		for (var i = 0; i < 20; i++) {
			var b = this.invadersBullets.create(0, 0, 'invaderBullet');
			b.name = 'invaderBullet' + i;
			b.exists = false;
			b.visible = false;
			b.checkWorldBounds = true;
			b.events.onOutOfBounds.add(this.resetBullet, this);
		}
	},



	buildStateText: function () {
		this.stateText = this.add.bitmapText(0, 0, 'eightbitwonder', "MyText", 18);
		this.stateText.align = 'center';
		this.centerStateText();
		this.stateText.visible = false;
	},

	centerStateText: function () {
		this.stateText.updateTransform();
		this.stateText.position.x = this.world.centerX - this.stateText.textWidth / 2;
		this.stateText.position.y = this.world.centerY - this.stateText.textHeight / 2;
	},

	buildUI: function () {
		this.scoreText = this.add.bitmapText(0, 8, 'eightbitwonder', 'Score : ' + this.score, 18);
		this.scoreText.align = 'center';
		this.scoreText.updateTransform();
		this.scoreText.position.x = this.world.centerX - this.scoreText.textWidth / 2;
		this.scoreText.visible = true;

		this.weaponText = this.add.bitmapText(0, 38, 'eightbitwonder', 'Weapon: ' + this.currentWeapon.toUpperCase(), 18);
		this.weaponText.align = 'center';
		this.weaponText.updateTransform();
		this.weaponText.position.x = this.world.centerX - this.weaponText.textWidth / 2;
	},

	flyDown: function () {
		this.invaders.y += 25;
	},


	fireBullet: function () {
		if (this.time.now > this.bulletTime && this.gameover == false) {
			let bulletKey;
			if (this.currentWeapon === 'check') bulletKey = 'checkRay';
			else if (this.currentWeapon === 'clean') bulletKey = 'cleanBlaster';
			else if (this.currentWeapon === 'dry') bulletKey = 'dryBeam';

			let bullet = this.bullets.getFirstExists(false);
			if (bullet) {
				bullet.loadTexture(bulletKey); // swap sprite
				bullet.reset(this.ship.x, this.ship.y - 25);
				bullet.body.velocity.y = -450;
				this.bulletTime = this.time.now + 500;

				this.shootSfx.play();
				this.shootSfx.volume = 0.5;
			}
		}
	},

	fireInvaderBullet: function (invader, bullet) {


		invaderBullet = this.invadersBullets.getFirstExists(false);
		livingEnemies = this.livingEnemies;
		livingEnemies.length = 0;


		this.invaders.forEachAlive(function (invader) {
			// put every living enemy in an array
			livingEnemies.push(invader);
		});

		if (invaderBullet && livingEnemies.length > 0) {
			var random = this.game.rnd.integerInRange(0, livingEnemies.length - 1);
			var shooter = livingEnemies[random];// randomly select one of them
			invaderBullet.reset(shooter.body.x + 32, shooter.body.y + 32);
			this.game.physics.arcade.moveToObject(invaderBullet, this.ship, 120);
			this.invaderBulletTime = this.game.time.now + 2000;
		}
	},

	explodeShip: function () {
		var explosion2 = this.shipExplosions.getFirstExists(false);
		explosion2.reset(this.ship.body.x + 26, this.ship.body.y + 16);
		explosion2.animations.play('shipExplosion', 48, false, true);

		this.shipDeathSfx.play();
		this.shipDeathSfx.volume = 0.5;
	},

	resetBullet: function (bullet) {
		// console.log('bullet destroyed! Motafuka');
		bullet.kill();
	},

	collisionBulletInvader: function (bullet, invader) {
		// console.log('aie, tu m\'as cogné du con !');
		bullet.kill();
		invader.kill();
		var explosion = this.invadersExplosions.getFirstExists(false);
		explosion.reset(invader.body.x + 32, invader.body.y + 32);
		explosion.animations.play('invaderExplosion', 24, false, true);
		this.enemyDeathSfx.play();
		this.enemyDeathSfx.volume = 0.5;
		this.score += 20;
		this.updateScore();
		this.invadersCount();
	},

	collisionInvadersBulletsShip: function (bullet, ship) {
		bullet.kill();
		ship.kill();
		this.explodeShip();
		if (this.music) { this.music.stop(); }
		this.stateText.text = " GAME OVER \n Click to restart";
		this.centerStateText();
		this.stateText.visible = true;
		this.gameover = true;
		this.game.input.onTap.addOnce(this.restartGame, this);
	},

	collisionShipInvader: function (ship, invader) {
		// console.log('GAME OVER !');
		invader.kill();
		ship.kill();
		this.explodeShip();
		this.stateText.text = " GAME OVER \n Click to restart";
		this.centerStateText();
		this.stateText.visible = true;
		this.gameover = true;
		this.game.input.onTap.addOnce(this.restartGame, this);
	},

	updateScore: function () {
		this.scoreText.text = 'Score : ' + this.score;
		this.scoreText.updateTransform();
		this.scoreText.position.x = this.world.centerX - this.scoreText.textWidth / 2;
	},

	invadersCount: function () {
		this.totalInvaders--;
		if (this.totalInvaders == 0) {
			this.stateText.text = " Level 1 Complete!\n Click to continue";
			this.centerStateText();
			this.stateText.visible = true;
			this.gameover = true;

			// After Level 1, go to FactCard1 instead of directly to Level 2
			this.game.input.onTap.addOnce(function () {
				if (this.music) { this.music.stop(); }   // stop Level 1 music
				this.state.start('FactCard1', true, false, this.score);
			}, this);
		}
	},
	updateWeaponUI: function () {
		this.weaponText.text = 'Weapon: ' + this.currentWeapon.toUpperCase();
		this.weaponText.updateTransform();
		this.weaponText.position.x = this.world.centerX - this.weaponText.textWidth / 2;
	},

	restartGame: function () {
		if (this.music) { this.music.stop(); }
		if (this.shipDeathSfx && this.shipDeathSfx.isPlaying) {
			this.shipDeathSfx.stop();
		}
		// Destroy old groups to avoid stale references
		if (this.invaders) this.invaders.destroy(true);
		if (this.bullets) this.bullets.destroy(true);
		if (this.invadersBullets) this.invadersBullets.destroy(true);
		if (this.invadersExplosions) this.invadersExplosions.destroy(true);
		if (this.shipExplosions) this.shipExplosions.destroy(true);

		// Reset core values
		this.totalInvaders = this.totalRow * this.totalInvadersRow;
		this.score = 0;
		this.gameover = false;
		this.livingEnemies.length = 0;
		this.bulletTime = 0;
		this.invaderBulletTime = 0;

		// Restart cleanly at StartMenu
		this.state.start('StartMenu', true, false, 0);
	},

	update: function () {
		//Ship handler
		this.ship.body.velocity.x = 0;
		this.ship.body.velocity.y = 0;


		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.ship.body.x > 0) {
			this.ship.body.velocity.x = -200;
		}
		else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.ship.body.x < this.world.width - this.ship.width / 2) {
			this.ship.body.velocity.x = 200;
		}

		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.fireBullet();
		}

		// Touch controls: move ship to pointer X, auto-fire while touching
		if (this.input.pointer1.isDown) {
			this.ship.x = this.input.pointer1.x;
			this.fireBullet();
		}

		if (this.game.time.now > this.invaderBulletTime && this.gameover == false) {
			this.fireInvaderBullet();
		}

		// collision
		if (this.gameover == false) {
			this.physics.arcade.overlap(this.ship, this.invaders, this.collisionShipInvader, null, this);
			this.physics.arcade.overlap(this.bullets, this.invaders, this.collisionBulletInvader, null, this);
			this.physics.arcade.overlap(this.invadersBullets, this.ship, this.collisionInvadersBulletsShip, null, this);
		}
	}




};