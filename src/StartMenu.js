SpaceInvaders.StartMenu = function (game) {
	this.startBG;
	this.startPrompt;
}

SpaceInvaders.StartMenu.prototype = {
	create: function () {
		// Blue bar behind the bottom of the title image
		var bottomBar = this.add.graphics();
		bottomBar.beginFill(0x1e61c6);
		var imgScale = Math.min(this.world.width / 1000, this.world.height / 1000);
		var imgBottom = this.world.centerY + (1000 * imgScale) / 2;
		bottomBar.drawRect(0, imgBottom, this.world.width, this.world.height - imgBottom);
		bottomBar.endFill();

		startBG = this.add.image(this.world.centerX, this.world.centerY, 'titlescreen');
		startBG.anchor.setTo(0.5, 0.5);
		var scale = Math.min(this.world.width / startBG.width, this.world.height / startBG.height);
		startBG.scale.setTo(scale, scale);
		startBG.inputEnabled = true;
		startBG.events.onInputDown.addOnce(this.startGame, this);

		// Play title music
		this.titleMusic = this.add.audio('titleMusic');
		this.titleMusic.volume = 0.7;
		this.titleMusic.loop = true;   // keep looping while on title screen
		this.titleMusic.play();


		this.input.onTap.addOnce(this.startGame, this);

	},
	startGame: function (pointer) {
		if (this.titleMusic) {
			this.titleMusic.stop();  // stop before switching state
		}
		this.state.start('Game', true, false, 0);
	}
};