SpaceInvaders.EndScene = function(game) {};

SpaceInvaders.EndScene.prototype = {
    create: function() {
        // Background
        var bg = this.add.image(0, 0, 'End');
        bg.width = this.world.width;
        bg.height = this.world.height;

        // End message — split into separate lines (BitmapText wordWrap is inert in Phaser 2)
        var line1 = this.add.bitmapText(0, this.world.centerY - 120, 'eightbitwonder', "Thanks for playing", 24);
        line1.align = 'center';
        line1.updateTransform();
        line1.position.x = this.world.centerX - line1.textWidth / 2;

        var line2 = this.add.bitmapText(0, this.world.centerY - 85, 'eightbitwonder', "Space Invaders x Aquatic Pests", 18);
        line2.align = 'center';
        line2.updateTransform();
        line2.position.x = this.world.centerX - line2.textWidth / 2;

        var line3 = this.add.bitmapText(0, this.world.centerY - 50, 'eightbitwonder', "You're a freshwater hero!", 22);
        line3.align = 'center';
        line3.updateTransform();
        line3.position.x = this.world.centerX - line3.textWidth / 2;

        // Sharing message — split into separate lines
        var shareLine1 = this.add.bitmapText(0, this.world.centerY + 10, 'eightbitwonder', "We would be grateful if you could", 16);
        shareLine1.align = 'center';
        shareLine1.updateTransform();
        shareLine1.position.x = this.world.centerX - shareLine1.textWidth / 2;

        var shareLine2 = this.add.bitmapText(0, this.world.centerY + 35, 'eightbitwonder', "share this with your friends", 16);
        shareLine2.align = 'center';
        shareLine2.updateTransform();
        shareLine2.position.x = this.world.centerX - shareLine2.textWidth / 2;

        var shareLine3 = this.add.bitmapText(0, this.world.centerY + 60, 'eightbitwonder', "and whanau.", 16);
        shareLine3.align = 'center';
        shareLine3.updateTransform();
        shareLine3.position.x = this.world.centerX - shareLine3.textWidth / 2;

        // Social/email share buttons (simple clickable text)
        var shareFacebook = this.add.text(this.world.centerX, this.world.centerY + 110, "Share on Facebook", { font: "26px Arial", fill: "#00aced" });
        shareFacebook.anchor.setTo(0.5);
        shareFacebook.inputEnabled = true;
        shareFacebook.events.onInputDown.add(function(){
            window.open("https://www.facebook.com/sharer/sharer.php?u=https://gostikhan.github.io/Space-Invaders-Aquatic-Pests/", "_blank");
        }, this);

        var shareTwitter = this.add.text(this.world.centerX, this.world.centerY + 150, "Share on Twitter", { font: "26px Arial", fill: "#1da1f2" });
        shareTwitter.anchor.setTo(0.5);
        shareTwitter.inputEnabled = true;
        shareTwitter.events.onInputDown.add(function(){
            window.open("https://twitter.com/intent/tweet?text=I%20just%20played%20Space%20Invaders%20x%20Aquatic%20Pests!%20Join%20me%20at%20https://gostikhan.github.io/Space-Invaders-Aquatic-Pests/", "_blank");
        }, this);

        var shareEmail = this.add.text(this.world.centerX, this.world.centerY + 190, "Share via Email", { font: "26px Arial", fill: "#ff6600" });
        shareEmail.anchor.setTo(0.5);
        shareEmail.inputEnabled = true;
        shareEmail.events.onInputDown.add(function(){
            window.location.href = "mailto:?subject=Play Space Invaders x Aquatic Pests&body=I just played this awesome game! Check it out: https://gostikhan.github.io/Space-Invaders-Aquatic-Pests/";
        }, this);

    }
};