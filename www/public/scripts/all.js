/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(firebaseURL){
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0xffffff);
        this.stage.removeChild(this.loadText);



        // this.loadText = new PIXI.Text("label", {font:"50px arial", fill:"black"});
    
        // this.stage.addChild(this.loadText);



        this.appContainer = document.getElementById('rect');
        this.id = parseInt(Math.random() * 100000000000);

        //this.socket = new FirebaseSocket(firebaseURL +parseInt(Math.random() * 100000000000));
        this.socket = new FirebaseSocket(firebaseURL +'12221');
        this.socket.build();
        //this.socket.bind(SmartSocket.READ_SOCKET_SNAPSHOT, this.readSnapshot);
        //this.socket.bind(SmartSocket.READ_LAST, this.readlast);
        this.socket.bind(SmartSocket.READ_OBJ, this.readObj);
        this.socket.bind(SmartSocket.WRITE_OBJ, this.writeObj);
        this.socket.bind(SmartSocket.SET_OBJ, this.setObj);

        this.date = new Date();
        this.stepTime = Firebase.ServerValue.TIMESTAMP;

        this.users = [];

        this.counter = 0;


        this.colorList = [ 0x0000FF, 0xFF0000, 0x00FF00,0xFFFFFF]

        this.teams = "";
        this.kills = 0
        this.escapes = 0
        this.miss = 0

        this.maxEnemies = 20;

	},
    deviceLeft:function(){

        APP.stepTime = Firebase.ServerValue.TIMESTAMP;
        APP.socket.updateObj({
            timeStamp:Firebase.ServerValue.TIMESTAMP,
            action:
            {
                message: {pos:ev.center, value:"TE AMO "},
                type:"REMOVE_USER",
                stepTime: APP.stepTime,
                type: ev.type,
                id: APP.id
            }
        });

    },
    readlast:function(obj){
        //console.log('readlast', obj);
    },
    readSnapshot:function(obj){
        //console.log('readSnapshot', obj);
    },
    updateUser:function(id, time){
        //console.log("UPDATE USER ");
        // obj.action.id, Firebase.ServerValue.TIMESTAMP
        for (var i = APP.users.length - 1; i >= 0; i--) {
            if(id == APP.users[i].id)
            {
                APP.users[i].stepTime = time;
            }
        };
    },
    addUser:function(obj){
        //console.log("ADDED USER ");
        APP.teams += obj.action.message.team;
        APP.users.push({
            id:obj.action.id,
            team:obj.action.message.team,
            startedTime: obj.action.startedTime,
            stepTime: Firebase.ServerValue.TIMESTAMP
        });

         

        if(obj.application.teams != APP.teams){
            APP.socket.updateObj({
                action:{
                    type:"UPDATE_TEAMS"
                },
                application:{
                    teams: APP.teams
                },
                timeStamp:Firebase.ServerValue.TIMESTAMP
            });
        }
    },
    getUser:function(id){
        //// console.log("GET USER");
        for (var i = APP.users.length - 1; i >= 0; i--) {
            if(id == APP.users[i].id)
            {
                
                return APP.users[i];
            }
        };
    },
    act:function(obj){
        APP.users.push(obj);
    },
    readObj:function(obj){
        //console.log('readObj', obj);
        
        if(!obj){
            return;
        }
        //// console.log(obj.application.startedTime > obj.timeStamp);
        //console.log(obj.application.startedTime , obj.timeStamp);
        if(obj.application.startedTime >= obj.timeStamp){
            //console.log('startedTime da aplicacao esta maior que o usuario');
            return;
        }


        //console.log(obj.action.type);

        switch(obj.action.type) {
            // case "RESET":
            //     // if(isMobile && obj.action.message.team == APP.currentTeam)
            //     //     APP.miss ++;
            //         //console.log(APP.getUser(obj.action.id).team);
            //         //init users
            //         //APP.gameScreen.initTeam(obj.action.message.team);
            //     break;
            case "MISS":
                if(isMobile && obj.action.message.team == APP.currentTeam)
                    APP.miss ++;
                    //console.log(APP.getUser(obj.action.id).team);
                    //init users
                    //APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "END_GAME":
                if(isMobile)
                    APP.endGame = true;
                    //console.log(APP.getUser(obj.action.id).team);
                    //init users
                    //APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "NEW_KILL":
                if(isMobile && obj.action.message.team == APP.currentTeam){
                    APP.kills ++;
                    APP.counter --
                }
                    //console.log(APP.getUser(obj.action.id).team);
                    //init users
                    //APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "NEW_ESCAPE":
                    //console.log(APP.getUser(obj.action.id).team);
                if(isMobile && obj.action.message.team == APP.currentTeam){
                    APP.escapes ++;
                    APP.counter --
                }
                    //init users
                    //APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "JUMP":
                    //console.log(APP.getUser(obj.action.id).team);
                    APP.gameScreen.jump(APP.getUser(obj.action.id).team);
                    //init users
                    //APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "NEW_USER":
                    contains = false;
                    for (var i = APP.users.length - 1; i >= 0; i--) {
                        if(APP.users[i].id == obj.action.id){
                            contains = true;
                            break;
                        }
                    };
                    if(!contains){
                        APP.addUser(obj);
                    }                   
                    //init users
                    APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "SEND_MESSAGE":
                    tempUser = APP.getUser(obj.action.id);
                    if(tempUser){
                        //console.log('SEND_MESSAGE');
                        APP.updateUser(obj.action.id, Firebase.ServerValue.TIMESTAMP);
                        APP.gameScreen.changeColor(obj.action.message.value+(APP.counter++));
                    }else{
                        //console.log("SEM USER");
                    }                
                break;
            default:
                //console.log('nao é ação');
        }

    },
    writeObj:function(obj){
        //console.log('writeObj', obj);
    },
    setObj:function(obj){
        //console.log('setObj', obj);
    },
    show:function(){
    },
    hide:function(){
    },
	build:function(){
        var self = this;
        if(isMobile){ 
            this.startedTime = this.stepTime = Firebase.ServerValue.TIMESTAMP;

            this.stage.setBackgroundColor(0x000000);
            APP.firstScreen = 'MobileLobby';

            this.mobileLobby = new MobileLobby('MobileLobby');
            this.mobileController = new MobileController('MobileController');
            this.loaderScreen = new LoaderScreen('Loader');
            this.screenManager.addScreen(this.mobileLobby);
            this.screenManager.addScreen(this.mobileController);
            this.screenManager.addScreen(this.loaderScreen);
            this.screenManager.change('Loader');

        }else{
            this.startedTime = this.stepTime = Firebase.ServerValue.TIMESTAMP;
            this.socket.updateObj({application:{
                id:this.id,
                startedTime:this.startedTime,
                stepTime:this.stepTime},
                timeStamp:Firebase.ServerValue.TIMESTAMP
            });
            APP.firstScreen = 'Game';

            this.stage.setBackgroundColor(0x000000);
            this.gameScreen = new GameScreen('Game');
            this.loaderScreen = new LoaderScreen('Loader');
            this.screenManager.addScreen(this.gameScreen);
            this.screenManager.addScreen(this.loaderScreen);

            this.screenManager.change('Loader');
        }
	},
    destroy:function(){
    }
});
/*jshint undef:false */
var InteractiveBackground = Class.extend({
	init:function(){
		//this._super( true );
		this.container = new PIXI.DisplayObjectContainer();
		this.vecDots = [];
		this.gravity = 4;
		this.accel = 0;
	},
	build: function(w,h){
		this.dist = 80;
		this.width = w;
		this.height = h;
		console.log(w,h);
		var _w = this.width / this.dist;
		var _h = this.height / this.dist;
		for (var i = 0; i < _w; i++) {
			for (var j = 0; j < _h; j++) {
				if(Math.random() > 0.2){
					var dot = new PIXI.Graphics();
					dot.beginFill(0xFFFFFF);
					dot.velocity = {x:0,y:0};
					dot.velocity.y = 0.1 + Math.random() * 0.2;
					dot.velocity.x = 0;
					dot.drawRect(0,0,Math.ceil(2 *dot.velocity.y), Math.ceil(12 * dot.velocity.y));
					dot.position.x = this.dist * i + (Math.random()*this.dist) / 2;
					dot.position.y = this.dist * j + (Math.random()*this.dist) / 2;
					this.container.addChild(dot);
					dot.alpha = 0.5 * Math.random() + 0.3;
					dot.side = Math.random() < 0.5 ? 1 : -1;
					this.vecDots.push(dot);
				}
			}
		}

	},
	getContent: function(){
		return this.container;
	},
	update: function(){
		for (var i = this.vecDots.length - 1; i >= 0; i--) {
			this.vecDots[i].position.x += this.vecDots[i].velocity.x + this.accel;
			this.vecDots[i].position.y += this.gravity//this.vecDots[i].velocity.y + this.gravity;
			this.vecDots[i].alpha += 0.01 * this.vecDots[i].side;
			if(this.vecDots[i].alpha <= 0 || this.vecDots[i].alpha >= 0.8){
				// this.vecDots[i].alpha = 0.6 * Math.random() + 0.3;
				this.vecDots[i].side *= -1;
			}
			if(this.vecDots[i].position.y > this.height + this.dist){
				this.vecDots[i].position.y = 0;
			}

			// if(this.vecDots[i].position.x > this.width + this.dist){
			// 	this.vecDots[i].position.x = 0;
			// }else if(this.vecDots[i].position.x < 0){
			// 	this.vecDots[i].position.x = windowWidth + this.dist;
			// }
		}
		// this._super();
	},
});
/*jshint undef:false */
var MiddleSquare = Class.extend({

	init: function () {
        this.container = new PIXI.DisplayObjectContainer();
    },
    build: function(size){

		this.middleSquare = new PIXI.Graphics();
    	this.middleSquare.lineStyle(0.5,0x555555);
        this.middleSquare.drawRect(0,0,size.width,size.height);
		
		this.middleSquare.pivot = {x:  this.middleSquare.width /2,y:  this.middleSquare.height /2};

		this.container.addChild(this.middleSquare);


		// this.returnButtonLabel = new PIXI.Text("2", {font:"30px arial", fill:"white"});
    
  //       this.container.addChild(this.returnButtonLabel);

  //       this.returnButtonLabel.scale.x =-1;

  //       this.returnButtonLabel.position.x = -this.returnButtonLabel.width /2;
		// this.returnButtonLabel.position.y = this.middleSquare.height/2 - this.returnButtonLabel.height// - this.returnButtonLabel.height /2;
    }
})
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
/*jshint undef:false */
var MobileApp = SmartObject.extend({
	init:function(){
        this._super();
	},
    show:function(){
    },
    hide:function(){
    },
	build:function(){
	},
    destroy:function(){
    }
});
/*jshint undef:false */
function degressToRad(deg){
    return deg / 180 * Math.PI;
}
function radToDegrees(rad){
    return deg * 180 / Math.PI;
}
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.gameContainer = new PIXI.DisplayObjectContainer();
        this.topGame = new GameView();
        this.rightGame = new GameView();
        this.bottomGame = new GameView();
        this.leftGame = new GameView();
        
        this.gameViewList = [this.topGame,this.rightGame,this.bottomGame,this.leftGame]
    },
    destroy: function () {
        this._super();
    },
    build: function () {

        this.addChild(this.gameContainer);

        this.topGame.build(0);
        this.gameContainer.addChild(this.topGame.container);
        this.topGame.container.position.x = windowWidth / 2;
        this.topGame.container.position.y = windowHeight / 2;
        // this.topGame.container.interactive = true;

        this.rightGame.build(1);
        this.gameContainer.addChild(this.rightGame.container);
        this.rightGame.container.position.x = windowWidth / 2;
        this.rightGame.container.position.y = windowHeight / 2;
        this.rightGame.container.rotation = degressToRad(90);

        this.bottomGame.build(2);
        this.gameContainer.addChild(this.bottomGame.container);
        this.bottomGame.container.position.x = windowWidth / 2;
        this.bottomGame.container.position.y = windowHeight / 2;
        this.bottomGame.container.rotation = degressToRad(180);

        this.leftGame.build(3);
        this.gameContainer.addChild(this.leftGame.container);
        this.leftGame.container.position.x = windowWidth / 2;
        this.leftGame.container.position.y = windowHeight / 2;
        this.leftGame.container.rotation = degressToRad(270);



        this.middleSquare = new MiddleSquare();
        this.middleSquare.build({width:120, height:120});
    	this.middleSquare.container.position.x = windowWidth / 2;
        this.middleSquare.container.position.y = windowHeight / 2;
        this.gameContainer.addChild(this.middleSquare.container);


    	this.crossLine1 = new PIXI.Graphics();
        this.crossLine1.lineStyle(0.5,0x555555);
        this.crossLine1.moveTo(0,0);
        this.crossLine1.lineTo(0,windowHeight * 2);
        this.crossLine1.position.x = windowWidth / 2;
        this.crossLine1.position.y = windowHeight / 2;
        this.crossLine1.pivot = {x:  this.crossLine1.width /2,y:  this.crossLine1.height /2}
        this.crossLine1.rotation = 45 * 3.14 / 180;


        this.crossLine2 = new PIXI.Graphics();
        this.crossLine2.lineStyle(0.5,0x555555);
        this.crossLine2.moveTo(0,0);
        this.crossLine2.lineTo(0,windowHeight * 2);
        this.crossLine2.position.x = windowWidth / 2;
        this.crossLine2.position.y = windowHeight / 2;
        this.crossLine2.pivot = {x:  this.crossLine2.width /2,y:  this.crossLine2.height /2}
        this.crossLine2.rotation = -45 * 3.14 / 180;


        this.gameContainer.addChild(this.crossLine1);
        this.gameContainer.addChild(this.crossLine2);

        
    },
    jump: function (id) {
        this.gameViewList[id].jump();
    },
    initTeam: function (id) {
        console.log(id);
        this.gameViewList[id].initTeam();
    },
    changeColor: function (label) {

        if(this.returnButtonLabel && this.returnButtonLabel.parent)
        this.gameContainer.removeChild(this.returnButtonLabel);

        this.returnButtonLabel = new PIXI.Text(label, {font:"50px arial", fill:"white"});
    
        this.gameContainer.addChild(this.returnButtonLabel);

        this.returnButtonLabel.scale.x =-1;

        this.returnButtonLabel.position.x = windowWidth / 2 - this.returnButtonLabel.width /2;
		this.returnButtonLabel.position.y = windowHeight / 4 - 40 - this.returnButtonLabel.height /2;

    },
    update: function () {
        for (var i = this.gameViewList.length - 1; i >= 0; i--) {
            this.gameViewList[i].update();
        };
        //this.circle1.position.x ++
    }
})
/*jshint undef:false */
var LoaderScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        

        var self = this;

        

        var assetsToLoader = [
        "img/plane1.png",
        "img/plane2.png",
        "img/plane3.png",
        "img/plane4.png",
        "img/enemy.png",
        ];
        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
    },
    onProgress:function(){

    },
    onAssetsLoaded:function()
    {
        this.screenManager.change(APP.firstScreen);
    },
    update:function()
    {
    }
});

/*jshint undef:false */
var MobileController = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.gameContainer = new PIXI.DisplayObjectContainer();

        this.statsLabel = new PIXI.Text("COUNTER:"+APP.counter+"\nKILLS:"+APP.kills+"\nESCAPES:"+APP.escapes+"\nERRORS:"+APP.miss, {font:"20px arial", fill:"white"});
        this.statsLabel.position.y = windowHeight * 0.05
        this.statsLabel.position.x = windowHeight * 0.05
        this.gameContainer.addChild(this.statsLabel);

        APP.counter = APP.maxEnemies
        
    },
    destroy: function () {
        this._super();
    },
    build: function () {

        //alert(APP.colorList[APP.currentTeam]);
    	var self = this;

        this.interactiveBackground = new InteractiveBackground();
        this.interactiveBackground.build(windowWidth, windowHeight);
        this.container.addChild(this.interactiveBackground.container);

    	this.middleSquare = new SimpleSprite("img/plane"+(APP.currentTeam + 1)+".png");

        //alert('=1');
		this.middleSquare.getContent().anchor = {x:0.5,y:0.5};
		//this.middleSquare.pivot = {x:  this.middleSquare.width /2,y:  this.middleSquare.height /2};
		this.middleSquare.getContent().position.x = windowWidth / 2// - this.middleSquare.getContent().width / 2;
		this.middleSquare.getContent().position.y = windowHeight / 2// - this.middleSquare.getContent().height / 2;
        //alert('=2');
		this.gameContainer.addChild(this.middleSquare.getContent());

        //alert('=3');
        this.middleSquare.getContent().interactive = true;
        this.middleSquare.getContent().touchstart = this.middleSquare.getContent().mousedown = function(mouseData){
            self.jump();
        };
        //alert('=4');

        this.addChild(this.gameContainer)

        TweenLite.from(this.middleSquare.getContent().position, 1, {ease:"easeOutBack", y:windowHeight});
        //alert('=5');

    },

    jump: function () {

        this.middleSquare.getContent().scale = {x:1, y:1}

        TweenLite.from(this.middleSquare.getContent().scale, 1, {x:1.2, y:1.2});
        if(APP.endGame){
            APP.endGame = false;
            APP.kills = APP.escapes = APP.miss = 0
            APP.counter = APP.maxEnemies
        }
    	APP.socket.updateObj({
            timeStamp:Firebase.ServerValue.TIMESTAMP,
            action:
            {
                message: {},
                type:"JUMP",
                id: APP.id
            }
        });
    },
    update: function () {
        this.interactiveBackground.update();

        this.statsLabel.setText("COUNTER:"+APP.counter+"\nKILLS:"+APP.kills+"\nESCAPES:"+APP.escapes+"\nERRORS:"+APP.miss);

        if(APP.endGame){
            this.statsLabel.setText("END GAME\nKILLS:"+APP.kills+"\nESCAPES:"+APP.escapes+"\nERRORS:"+APP.miss);
            this.updateable = false;
        }
    }
})
/*jshint undef:false */
var MobileLobby = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.gameContainer = new PIXI.DisplayObjectContainer();
        this.topGame = new SimpleSprite("img/plane1.png");
        this.rightGame = new SimpleSprite("img/plane2.png");
        this.bottomGame = new SimpleSprite("img/plane3.png");
        this.leftGame = new SimpleSprite("img/plane4.png");

        this.planes = [this.topGame,this.rightGame,this.bottomGame,this.leftGame];
        this.block = false;
    },
    destroy: function () {
        this._super();
    },
    build: function () {

    	var self = this;

        this.interactiveBackground = new InteractiveBackground();
        this.interactiveBackground.build(windowWidth, windowHeight);
        this.container.addChild(this.interactiveBackground.container);

        this.addChild(this.gameContainer);

        
        this.gameContainer.addChild(this.topGame.getContent());

        ratio = (windowWidth * 0.2) / this.topGame.getContent().width ;

        this.topGame.getContent().position.x = windowWidth * 0.25 * 0//windowWidth / 2 - this.topGame.getContent().width /2;
        this.topGame.getContent().position.y = windowHeight / 2;
        this.topGame.getContent().scale = {x:ratio,y:ratio}


		this.topGame.getContent().interactive = true;
        this.topGame.getContent().touchstart = this.topGame.getContent().mousedown = function(mouseData){
            if(self.block){
                return;
            }
            self.choiceTeam(0);
        };



        
        this.gameContainer.addChild(this.rightGame.getContent());
        this.rightGame.getContent().position.x = windowWidth * 0.25 * 1;
        this.rightGame.getContent().position.y = windowHeight / 2;
        this.rightGame.getContent().scale = {x:ratio,y:ratio}

        this.rightGame.getContent().interactive = true;
        this.rightGame.getContent().touchstart = this.rightGame.getContent().mousedown = function(mouseData){
            if(self.block){
                return;
            }
            self.choiceTeam(1);
        };



        
        this.gameContainer.addChild(this.bottomGame.getContent());
        this.bottomGame.getContent().position.x = windowWidth * 0.25 * 2;
        this.bottomGame.getContent().position.y = windowHeight / 2;
        this.bottomGame.getContent().scale = {x:ratio,y:ratio}

        this.bottomGame.getContent().interactive = true;
        this.bottomGame.getContent().touchstart = this.bottomGame.getContent().mousedown = function(mouseData){
            if(self.block){
                return;
            }
           self.choiceTeam(2);
        };



        
        this.gameContainer.addChild(this.leftGame.getContent());
        this.leftGame.getContent().position.x = windowWidth * 0.25 * 3;
        this.leftGame.getContent().position.y = windowHeight / 2;
        this.leftGame.getContent().scale = {x:ratio,y:ratio}

        this.leftGame.getContent().interactive = true;
        this.leftGame.getContent().touchstart = this.leftGame.getContent().mousedown = function(mouseData){
            if(self.block){
                return;
            }
            self.choiceTeam(3);
        };

    },

    choiceTeam: function (id) {
    	APP.currentTeam = id;
    	var self = this;
        this.block = true;
        
        TweenLite.to(this.planes[id].getContent().position, 1, {ease:"easeInCubic", y : - 100, onComplete:function(){
            APP.socket.updateObj({
                timeStamp:Firebase.ServerValue.TIMESTAMP,
                action:
                {
                    message: {team:id, value:"TE AMO "},
                    type:"NEW_USER",
                    id: APP.id
                }
            });
            self.screenManager.change('MobileController');
        }});

        for (var i = this.planes.length - 1; i >= 0; i--) {
            if(id != i){
                TweenLite.to(this.planes[i].getContent().position, 0.8, {ease:"easeInCubic", y : windowHeight + 50});
            }
        };
    },
    update: function () {
        this.interactiveBackground.update();
    }
})
/*jshint undef:false */
var FirebaseSocket = SmartSocket.extend({
    init:function(url){
        this._super();
        //instancia o firebase
        this.dataRef = new Firebase(url);
        this.dataRef.limitToLast(1);
    },
    build:function(){
        var self = this;


        this.lastMessagesQuery = this.dataRef.endAt().limitToLast(2);
        this.lastMessagesQuery.on('child_added', function (snapshot) {
            self.readLast(snapshot.val());
        }, function (errorObject) {
            self.socketError(errorObject);
        });

        this.dataRef.on('child_added', function (snapshot) {
            self.readSocketList(snapshot.val());
        }, function (errorObject) {
            self.socketError(errorObject);
        });

        this.dataRef.on('value', function(data) {
            self.readObj(data.val());
        }, function (errorObject) {
            self.socketError(errorObject);
        });

        // mySessionRef.onDisconnect().update({ endedAt: Firebase.ServerValue.TIMESTAMP });
        // mySessionRef.update({ startedAt: Firebase.ServerValue.TIMESTAMP });

    },
    writeObj:function(obj){
        this._super(obj);
        this.dataRef.push(obj);
    },
    setObj:function(obj){
        this._super(obj);
        this.dataRef.set(obj);
    },
    updateObj:function(obj){
        this._super(obj);
        this.dataRef.update(obj);
    },
    destroy:function(){
    }
});
/*jshint undef:false */
var Bullet = Entity.extend({
    init:function(vel, range, color, entityLayer, teamID){
        // console.log(vel);
        this._super( true );
        this.entityLayer = entityLayer;
        this.color = color;
        this.updateable = false;
        this.deading = false;
        this.range =range;
        this.teamID = teamID;
        this.width = 1;
        this.height = 1;
        this.type = 'fire';
        this.node = null;
        this.velocity.x = vel.x;
        this.velocity.y = vel.y;
        this.timeLive = 100;
        this.defaultVelocity = 1;
        this.entityContainer = new PIXI.DisplayObjectContainer();
        this.hitContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.hitContainer);

        this.collidable = true;

    },
    debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();
        // this.debugPolygon.lineStyle(0.5,color);
        this.debugPolygon.beginFill(color);
        this.debugPolygon.moveTo(0,0);
        this.debugPolygon.lineTo(-this.range,this.range*2)
        this.debugPolygon.lineTo(this.range,this.range*2)
        // this.debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0;
        this.hitContainer.addChild(this.debugPolygon);
    },
    getContent:function(){
        return this.entityContainer;
    },
    build: function(){
        // this._super();
        this.centerPosition = {x:0, y:0};
        this.updateable = true;
        this.collidable = true;
        // var self = this;
        this.debugPolygon(this.color);
    },
    update: function(){
        this._super();
        this.timeLive --;
        this.entityLayer.collideChilds(this);
        if(this.getContent().position.y < -windowHeight / 1.8){
            this.preKill();
             APP.socket.updateObj({
                timeStamp:Firebase.ServerValue.TIMESTAMP,
                action:
                {
                    message: {team:this.teamID},
                    type:"MISS",
                }
            });
        }
        // if(this.timeLive <= 0){
        //     this.preKill();
        // }
    },
    collide:function(arrayCollide){
        // console.log('fireCollide', arrayCollide[0].type);
        // if(this.collidable){
        //     if(arrayCollide[0].type === 'enemy'){
        //         // this.getContent().tint = 0xff0000;
        //         this.preKill();
        //         arrayCollide[0].hurt(this.power);

        //     }
        // }
    },
    preKill:function(){
        //this._super();
        if(this.collidable){
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){self.kill = true;}});
        }
    },
});

/*jshint undef:false */
var Enemy = Entity.extend({
    init:function(vel, range, color, entityLayer, teamID){
        // console.log(vel);
        this._super( true );
        this.entityLayer = entityLayer;
        this.color = color;
        this.updateable = false;
        this.deading = false;
        this.range =range;
        this.teamID = teamID;
        this.width = 1;
        this.height = 1;
        this.type = 'fire';
        this.node = null;
        this.velocity.x = vel.x;
        this.velocity.y = vel.y;
        this.timeLive = 1000;
        this.defaultVelocity = 1;
        this.entityContainer = new PIXI.DisplayObjectContainer();
        this.hitContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.hitContainer);

        this.collidable = true;

    },
    debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();

        this.img = new SimpleSprite("img/enemy.png");
        this.img.getContent().anchor = {x:0.5,y:0.5}
        this.debugPolygon.lineStyle(0.5,color);
        // this.debugPolygon.beginFill(color);
        // this.debugPolygon.moveTo(0,0);
        // this.debugPolygon.lineTo(-this.range,this.range*2)
        // this.debugPolygon.lineTo(this.range,this.range*2)
        // this.debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0;
        this.hitContainer.addChild(this.debugPolygon);
        this.hitContainer.addChild(this.img.getContent());
    },
    getContent:function(){
        return this.entityContainer;
    },
    build: function(){
        // this._super();
        this.centerPosition = {x:0, y:0};
        this.updateable = true;
        this.collidable = true;
        // var self = this;
        this.debugPolygon(this.color);
    },
    update: function(){
        this._super();
        if(!this.updateable) return
        this.timeLive --;
        this.entityLayer.collideChilds(this);
        if(this.getContent().position.x < -windowHeight / 2){
            console.log(this.teamID)
             APP.velEnemy -= 0.1;
            if(APP.velEnemy < 1.5)
                APP.velEnemy = 1.5
            APP.enemyCounter++
            APP.socket.updateObj({
                timeStamp:Firebase.ServerValue.TIMESTAMP,
                action:
                {
                    message: {team:this.teamID},
                    type:"NEW_ESCAPE",
                }
            });
            this.kill = true;
            this.updateable = false;
        }
        if(this.timeLive <= 0){
            this.preKill();
        }
    },
    collide:function(arrayCollide){
        if(this.collidable){
             APP.velEnemy += 0.1;
            if(APP.velEnemy > 4.5)
                APP.velEnemy = 4.5
            APP.enemyCounter++
            APP.socket.updateObj({
                timeStamp:Firebase.ServerValue.TIMESTAMP,
                action:
                {
                    message: {team:this.teamID},
                    type:"NEW_KILL",
                }
            });
            this.preKill();
            arrayCollide[0].preKill();
        }
    },
    preKill:function(){
        //this._super();
        if(this.collidable){
           
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:1.2, y:1.2, onComplete:function(){self.kill = true;}});
            TweenLite.to(this.getContent(), 0.3, {alpha:0});
        }
    },
});

/*jshint undef:false */

isMobile = false;
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
	isMobile = true;


// var windowWidth = 960,
// windowHeight = 640;

// if(isMobile){
// 	tempH = windowHeight
// 	windowHeight = window.innerHeight;
// 	windowWidth = window.innerWidth;
// }
function degressToRad(deg){
    return deg / 180 * Math.PI;
}
function radToDegrees(rad){
    return deg * 180 / Math.PI;
}
windowWidth = screen.width;
windowHeight = screen.height;

windowWidth = window.innerWidth;
windowHeight = window.innerHeight;

console.log(screen, window.innerWidth, window.innerHeight);

if(isMobile){
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
}

var gameView = document.getElementById('game');
var renderer = PIXI.autoDetectRecommendedRenderer(windowWidth, windowHeight, {antialias:true, view:gameView});




var APP = new Application('https://holo.firebaseio.com/');
APP.build();
APP.show();


gameView.addEventListener("blur", myBlurFunction, true);
function myBlurFunction() {
    APP.deviceLeft();
}

var first = true;
function update() {
	requestAnimFrame( update );

	if(first){
		var tempRation =  (window.innerHeight/windowHeight);
		var ratio = 1;//tempRation < (window.innerWidth/windowWidth)?tempRation:(window.innerWidth/windowWidth);
		
		windowWidthVar = windowWidth * ratio;
		windowHeightVar = windowHeight * ratio;

		renderer.view.style.width = windowWidthVar+'px';
		renderer.view.style.height = windowHeightVar+'px';
		first = false;
	}
	APP.update();
	renderer.render(APP.stage);
}


var initialize = function(){
	// //inicia o game e da um build
	PIXI.BaseTexture.SCALE_MODE =0;
	document.body.appendChild(renderer.view);
	
	requestAnimFrame( update);
};

(function () {

	var App = {
		init: function () {
			initialize();
		}
	};
	$(App.init);
})();

