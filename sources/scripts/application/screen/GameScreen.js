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