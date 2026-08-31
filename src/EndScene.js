SpaceInvaders.EndScene = function(game) {};

SpaceInvaders.EndScene.prototype = {
    create: function() {
        // Background
        var bg = this.add.image(0, 0, 'End');
        bg.width = this.world.width;
        bg.height = this.world.height;

        // End message
        var endText = this.add.bitmapText(
            this.world.centerX, 
            this.world.centerY - 100, 
            'eightbitwonder', 
            "Thanks for playing\nSpace Invaders x Aquatic Pests\n\nYou're a freshwater hero!", 
            28
        );
        endText.align = 'center';
        endText.wordWrap = true;
        endText.wordWrapWidth = 500;
        endText.maxWidth = 540;
        endText.updateTransform();
        endText.position.x = this.world.centerX - endText.textWidth / 2;

        // Sharing message
        var shareText = this.add.bitmapText(
            this.world.centerX, 
            this.world.centerY + 50, 
            'eightbitwonder', 
            "We would be grateful if you could\nshare this with your friends and whanau.", 
            20
        );
        shareText.align = 'center';
        shareText.wordWrap = true;
        shareText.wordWrapWidth = 500;
        shareText.maxWidth = 540;
        shareText.updateTransform();
        shareText.position.x = this.world.centerX - shareText.textWidth / 2;

        // Social/email share buttons (simple clickable text)
        var shareFacebook = this.add.text(this.world.centerX, this.world.centerY + 120, "Share on Facebook", { font: "26px Arial", fill: "#00aced" });
        shareFacebook.anchor.setTo(0.5);
        shareFacebook.inputEnabled = true;
        shareFacebook.events.onInputDown.add(function(){
            window.open("https://www.facebook.com/sharer/sharer.php?u=https://gostikhan.github.io/Space-Invaders-Aquatic-Pests/", "_blank");
        }, this);

        var shareTwitter = this.add.text(this.world.centerX, this.world.centerY + 160, "Share on Twitter", { font: "26px Arial", fill: "#1da1f2" });
        shareTwitter.anchor.setTo(0.5);
        shareTwitter.inputEnabled = true;
        shareTwitter.events.onInputDown.add(function(){
            window.open("https://twitter.com/intent/tweet?text=I%20just%20played%20Space%20Invaders%20x%20Aquatic%20Pests!%20Join%20me%20at%20https://gostikhan.github.io/Space-Invaders-Aquatic-Pests/", "_blank");
        }, this);

        var shareEmail = this.add.text(this.world.centerX, this.world.centerY + 200, "Share via Email", { font: "26px Arial", fill: "#ff6600" });
        shareEmail.anchor.setTo(0.5);
        shareEmail.inputEnabled = true;
        shareEmail.events.onInputDown.add(function(){
            window.location.href = "mailto:?subject=Play Space Invaders x Aquatic Pests&body=I just played this awesome game! Check it out: https://gostikhan.github.io/Space-Invaders-Aquatic-Pests/";
        }, this);

    }
};