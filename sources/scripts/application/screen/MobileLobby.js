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