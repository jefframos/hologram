/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(firebaseURL){
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0xffffff);
        //this.stage.removeChild(this.loadText);



        this.loadText = new PIXI.Text("label", {font:"50px arial", fill:"black"});
    
        this.stage.addChild(this.loadText);



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


        this.colorList = [0xFF0000, 0x00FF00,0x0000FF,0xFFFFFF]

        this.teams = "";

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
            this.mobileLobby = new MobileLobby('MobileLobby');
            this.mobileController = new MobileController('MobileController');
            this.screenManager.addScreen(this.mobileLobby);
            this.screenManager.addScreen(this.mobileController);
            this.screenManager.change('MobileLobby');

        }else{
            this.startedTime = this.stepTime = Firebase.ServerValue.TIMESTAMP;
            this.socket.updateObj({application:{
                id:this.id,
                startedTime:this.startedTime,
                stepTime:this.stepTime},
                timeStamp:Firebase.ServerValue.TIMESTAMP
            });

            this.stage.setBackgroundColor(0x000000);
            this.gameScreen = new GameScreen('Game');
            this.screenManager.addScreen(this.gameScreen);

            this.screenManager.change('Game');
        }
	},
    destroy:function(){
    }
});
/*jshint undef:false */
var MiddleSquare = Class.extend({

	init: function () {
        this.container = new PIXI.DisplayObjectContainer();
    },
    build: function(size){

		this.middleSquare = new PIXI.Graphics();
    	this.middleSquare.lineStyle(1,0xff00ff);
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

        this.topGame.build(APP.colorList[0]);
        this.gameContainer.addChild(this.topGame.container);
        this.topGame.container.position.x = windowWidth / 2;
        this.topGame.container.position.y = windowHeight / 2;
        // this.topGame.container.interactive = true;

        this.rightGame.build(APP.colorList[1]);
        this.gameContainer.addChild(this.rightGame.container);
        this.rightGame.container.position.x = windowWidth / 2;
        this.rightGame.container.position.y = windowHeight / 2;
        this.rightGame.container.rotation = degressToRad(90);

        this.bottomGame.build(APP.colorList[2]);
        this.gameContainer.addChild(this.bottomGame.container);
        this.bottomGame.container.position.x = windowWidth / 2;
        this.bottomGame.container.position.y = windowHeight / 2;
        this.bottomGame.container.rotation = degressToRad(180);

        this.leftGame.build(APP.colorList[3]);
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
        this.crossLine1.lineStyle(1,0xff00ff);
        this.crossLine1.moveTo(0,0);
        this.crossLine1.lineTo(0,windowHeight * 2);
        this.crossLine1.position.x = windowWidth / 2;
        this.crossLine1.position.y = windowHeight / 2;
        this.crossLine1.pivot = {x:  this.crossLine1.width /2,y:  this.crossLine1.height /2}
        this.crossLine1.rotation = 45 * 3.14 / 180;


        this.crossLine2 = new PIXI.Graphics();
        this.crossLine2.lineStyle(1,0xff00ff);
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
var MobileController = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.gameContainer = new PIXI.DisplayObjectContainer();
        
    },
    destroy: function () {
        this._super();
    },
    build: function () {

        //alert(APP.colorList[APP.currentTeam]);
    	var self = this;

    	this.middleSquare = new PIXI.Graphics();
        this.middleSquare.beginFill(APP.colorList[APP.currentTeam]);
        this.middleSquare.drawCircle(0,0, 90);

        //alert('=1');
		
		//this.middleSquare.pivot = {x:  this.middleSquare.width /2,y:  this.middleSquare.height /2};
		this.middleSquare.position.x = windowWidth / 2;
		this.middleSquare.position.y = windowHeight / 2;
        //alert('=2');
		this.gameContainer.addChild(this.middleSquare);

        //alert('=3');
        this.middleSquare.interactive = true;
        this.middleSquare.touchstart = this.middleSquare.mousedown = function(mouseData){
            self.jump();
        };
        //alert('=4');

        this.addChild(this.gameContainer)

        //alert('=5');

    },

    jump: function () {
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
    }
})
/*jshint undef:false */
var MobileLobby = AbstractScreen.extend({
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

    	var self = this;

        this.addChild(this.gameContainer);

        this.topGame.build(APP.colorList[0]);
        this.gameContainer.addChild(this.topGame.container);
        this.topGame.container.position.x = windowWidth / 2;
        this.topGame.container.position.y = windowHeight / 2;

		this.topGame.container.interactive = true;
        this.topGame.container.touchstart = this.topGame.container.mousedown = function(mouseData){
            self.choiceTeam(0);
        };



        this.rightGame.build(APP.colorList[1]);
        this.gameContainer.addChild(this.rightGame.container);
        this.rightGame.container.position.x = windowWidth / 2;
        this.rightGame.container.position.y = windowHeight / 2;
        this.rightGame.container.rotation = degressToRad(90);

        this.rightGame.container.interactive = true;
        this.rightGame.container.touchstart = this.rightGame.container.mousedown = function(mouseData){
            self.choiceTeam(1);
        };



        this.bottomGame.build(APP.colorList[2]);
        this.gameContainer.addChild(this.bottomGame.container);
        this.bottomGame.container.position.x = windowWidth / 2;
        this.bottomGame.container.position.y = windowHeight / 2;
        this.bottomGame.container.rotation = degressToRad(180);

        this.bottomGame.container.interactive = true;
        this.bottomGame.container.touchstart = this.bottomGame.container.mousedown = function(mouseData){
           self.choiceTeam(2);
        };



        this.leftGame.build(APP.colorList[3]);
        this.gameContainer.addChild(this.leftGame.container);
        this.leftGame.container.position.x = windowWidth / 2;
        this.leftGame.container.position.y = windowHeight / 2;
        this.leftGame.container.rotation = degressToRad(270);

        this.leftGame.container.interactive = true;
        this.leftGame.container.touchstart = this.leftGame.container.mousedown = function(mouseData){
            self.choiceTeam(3);
        };

    },

    choiceTeam: function (id) {
    	APP.currentTeam = id;
    	APP.socket.updateObj({
            timeStamp:Firebase.ServerValue.TIMESTAMP,
            action:
            {
                message: {team:id, value:"TE AMO "},
                type:"NEW_USER",
                id: APP.id
            }
        });
        this.screenManager.change('MobileController');
    },
    update: function () {
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

