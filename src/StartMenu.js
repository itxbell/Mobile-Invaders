SpaceInvaders.StartMenu = function (game) {
	this.startBG;
	this.startPrompt;
}

SpaceInvaders.StartMenu.prototype = {
	create: function () {
		startBG = this.add.image(this.world.centerX, this.world.centerY, 'titlescreen');
		startBG.anchor.setTo(0.5, 0.5);
		startBG.width = this.world.width;
		startBG.height = this.world.height;
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