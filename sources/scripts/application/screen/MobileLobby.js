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