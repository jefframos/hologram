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