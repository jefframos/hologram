/*jshint undef:false */
var GameView = Class.extend({

	init: function () {
        this.container = new PIXI.DisplayObjectContainer();
        
    },
    build: function(color){

		maskTopPos = {
            x: windowWidth / 2 - windowHeight / 2,// - this.container.position.x,
            y:0,//- this.container.position.y
        };
        maskTop = new PIXI.Graphics();
        maskTop.beginFill(0xff00ff);

        maskTop.moveTo(0,0);
        maskTop.lineTo(-windowHeight/2,-windowHeight/2);
        maskTop.lineTo(windowHeight/2, -windowHeight/2);
        maskTop.lineTo(0,0);


        maskTop.endFill();
        this.container.addChild(maskTop);
        this.container.mask = maskTop;

        this.player = new PIXI.Graphics();
        this.player.beginFill(color);
        this.player.drawCircle(0,0, 50);
        this.player.position.y = -100;
        this.container.addChild(this.player);

        this.velocity = {x:0,y:0}
        this.gravity = 0.8;
        this.gravityInverse = -2;

        this.readyToStart = false;
        this.base = {x:0,y:-150}
    },
    initTeam:function(){
    	console.log(this);
    	this.updateable = true;
    },
    jump:function(){
    	this.velocity.y = -10;
    },
    update:function(){
    	if(!this.updateable){
    		return;
    	}

    	this.player.position.x += this.velocity.x;
    	this.player.position.y += this.velocity.y;
		if(this.player.position.y < this.base.y){
			this.velocity.y += this.gravity;
		}else{
			this.velocity.y = 0;
			this.player.position.y = this.base.y;
		}
    	
		console.log(this.velocity.y);
    	if(!this.readyToStart){
	    	if(this.player.position.y > this.base.y){
	    		this.velocity.y += this.gravityInverse;
	    	}else{
	    		this.velocity.y = 0;
	    		this.readyToStart = true;
	    		console.log(this.readyToStart);
	    	}
	    }
    	
    }
})