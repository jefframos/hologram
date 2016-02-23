/*jshint undef:false */
var GameView = Class.extend({

	init: function () {
        this.container = new PIXI.DisplayObjectContainer();
        this.container.interactive = true;
        var self = this;
        this.container.touchstart = this.container.mousedown = function(mouseData){
            self.shoot();
        };
    },
    build: function(id){
        this.color = APP.colorList[id];
        this.id = id;

        this.interactiveBackground = new InteractiveBackground();
        this.interactiveBackground.build(windowHeight/2, windowHeight/2);
        this.container.addChild(this.interactiveBackground.container);
        this.interactiveBackground.container.position.x = -this.interactiveBackground.width / 2;
        this.interactiveBackground.container.position.y = -this.interactiveBackground.height;
        
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


        // this.player = new PIXI.Graphics();
        // this.player.beginFill(this.color);
        // this.player.drawCircle(0,0, 50);
        // this.player.position.y = -100;


        this.velocity = {x:0,y:0}
        this.gravity = 0.8;
        this.gravityInverse = -2;

        this.readyToStart = false;
        this.started = false;
        this.base = {x:0,y:-150}

        this.layerManager = new LayerManager();
        this.bulletLayer = new Layer("Bullet");
        this.entityLayer = new Layer("Entity");
        this.layerManager.addLayer(this.bulletLayer);
        this.layerManager.addLayer(this.entityLayer);

        this.container.addChild(this.layerManager.getContent());
        
        this.playerImg = new SimpleSprite("img/plane"+(this.id+1)+".png");
        this.playerImg.getContent().anchor = {x:0.5, y:0.5}
        this.playerImg.getContent().scale = {x:0.75, y:0.75}
        this.player = new PIXI.DisplayObjectContainer();
        this.player.addChild(this.playerImg.getContent());
        this.player.position.y = -80;
        this.container.addChild(this.player);

        this.enemyList = [];

        // tempEnemy = new Enemy({x:-2,y:0}, 30, this.color, this.bulletLayer, 1)
        // tempEnemy.build();
        // tempEnemy.setPosition(this.player.position.x, -windowHeight/2 + 30);
        // this.bulletLayer.addChild(tempEnemy);

        this.minCounter = 50;
        this.maxCounter = 150;

        this.enemyAcc = 30;
        APP.enemyCounter = 0;

        APP.velEnemy = 1.5;
    },
    shoot:function(){
        console.log(this.started);
        if(!this.started){
            this.initTeam();
        }else{
            tempBullet = new Bullet({x:0,y:-5}, 5, this.color, this.bulletLayer, this.id)

            tempBullet.build();
            tempBullet.setPosition(this.player.position.x,this.player.position.y);
            this.bulletLayer.addChild(tempBullet);
        }
    },
    initTeam:function(){
    	
        var self = this;
        TweenLite.to(this.player.position, 0.4, {y:this.base.y, ease:"easeOutBack",onComplete:function(){
            self.started = true;
            self.updateable = true;
        }});
    },
    jump:function(){
        this.shoot();
    	//this.velocity.y = -10;
    },
    resetGame:function(){
        var self = this;
        self.updateable = false;
        APP.enemyCounter = 0;
        TweenLite.to(this.player.position, 0.4, {y:-80, ease:"easeOutBack",onComplete:function(){
            self.started = false;
        }});
        for (var i = this.bulletLayer.childs.length - 1; i >= 0; i--) {
            this.bulletLayer.childs[i].kill = true;
            this.bulletLayer.childs[i].getContent().alpha = 0;
        };
        APP.socket.updateObj({
            timeStamp:Firebase.ServerValue.TIMESTAMP,
            action:
            {
                message: {team:self.id},
                type:"RESET",
            }
        });
    },
    update:function(){
    	if(!this.updateable){
    		return;
    	}

        this.enemyAcc --;
        if(this.enemyAcc <= 0 && APP.enemyCounter < APP.maxEnemies){
            this.minCounter = 50;
            this.maxCounter = 150;
            this.enemyAcc = Math.random()*(this.maxCounter - this.minCounter) + this.minCounter;

            tempEnemy = new Enemy({x:-APP.velEnemy,y:0}, 20, this.color, this.bulletLayer, this.id)
            tempEnemy.build();
            tempEnemy.setPosition(windowHeight/2 + 30, -windowHeight/2 + 30);
            this.bulletLayer.addChild(tempEnemy);
        }else if( APP.enemyCounter >= APP.maxEnemies){
            APP.socket.updateObj({
                timeStamp:Firebase.ServerValue.TIMESTAMP,
                action:
                {
                    message: {team:this.id},
                    type:"END_GAME",
                }
            });
            this.resetGame();
        }
        this.interactiveBackground.update();
        this.layerManager.update();
    	this.player.position.x += this.velocity.x;
    	this.player.position.y += this.velocity.y;
		if(this.player.position.y < this.base.y){
			this.velocity.y += this.gravity;
		}else{
			this.velocity.y = 0;
			this.player.position.y = this.base.y;
		}    	
    	    	
    }
})