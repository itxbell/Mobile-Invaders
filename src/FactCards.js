var SpaceInvaders = SpaceInvaders || {};

SpaceInvaders.FactCard1 = function(game) {};
SpaceInvaders.FactCard1.prototype = {
    create: function() {
        var card = this.add.image(this.world.centerX, this.world.centerY, 'factCard1');
        card.anchor.setTo(0.5, 0.5);
        card.width = this.world.width * 0.9;
        card.scale.y = card.scale.x;

        // Click/tap to continue to Level 2
        this.input.onTap.addOnce(function(){
            this.state.start('GameLevel2', true, false, this.score);
        }, this);
    },
    init: function(scoreFromLevel1){
        this.score = scoreFromLevel1 || 0;
    }
};

SpaceInvaders.FactCard2 = function(game) {};
SpaceInvaders.FactCard2.prototype = {
    create: function() {
        var card = this.add.image(this.world.centerX, this.world.centerY, 'factCard2');
        card.anchor.setTo(0.5, 0.5);
        card.width = this.world.width * 0.9;
        card.scale.y = card.scale.x;

        // Click/tap to continue to Level 3
        this.input.onTap.addOnce(function(){
            this.state.start('GameLevel3', true, false, this.score);
        }, this);
    },
    init: function(scoreFromLevel2){
        this.score = scoreFromLevel2 || 0;
    }
};

SpaceInvaders.FactCard3 = function(game) {};
SpaceInvaders.FactCard3.prototype = {
    create: function() {
        var card = this.add.image(this.world.centerX, this.world.centerY, 'factCard3');
        card.anchor.setTo(0.5, 0.5);
        card.width = this.world.width * 0.9;
        card.scale.y = card.scale.x;

        // Click/tap to return to StartMenu after final fact
        this.input.onTap.addOnce(function(){
            if(this.music){ this.music.stop(); }
            this.state.start('EndScene', true, false, this.score);
        }, this);

    },
    init: function(scoreFromLevel3){
        this.score = scoreFromLevel3 || 0;
    }
};