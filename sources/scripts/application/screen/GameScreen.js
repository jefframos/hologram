/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.gameContainer = new PIXI.DisplayObjectContainer();
        
        this.build();
    },
    destroy: function () {
        this._super();
    },
    build: function () {
    	console.log(this);

    	this.addChild(this.gameContainer);

    	this.middleSquare = new PIXI.Graphics();
    	this.middleSquare.beginFill(0xff00ff);
        this.middleSquare.drawRect(0,0,80,80);
		this.middleSquare.position.x = windowWidth / 2;
		this.middleSquare.position.y = windowHeight / 2;
		this.middleSquare.pivot = {x:  this.middleSquare.width /2,y:  this.middleSquare.height /2}

        this.gameContainer.addChild(this.middleSquare);

    	this.crossLine1 = new PIXI.Graphics();
        this.crossLine1.lineStyle(2,0xff00ff);
        this.crossLine1.moveTo(0,0);
        this.crossLine1.lineTo(0,windowHeight * 2);
        this.crossLine1.position.x = windowWidth / 2;
        this.crossLine1.position.y = windowHeight / 2;
        this.crossLine1.pivot = {x:  this.crossLine1.width /2,y:  this.crossLine1.height /2}
        this.crossLine1.rotation = 45 * 3.14 / 180;



        this.crossLine2 = new PIXI.Graphics();
        this.crossLine2.lineStyle(2,0xff00ff);
        this.crossLine2.moveTo(0,0);
        this.crossLine2.lineTo(0,windowHeight * 2);
        this.crossLine2.position.x = windowWidth / 2;
        this.crossLine2.position.y = windowHeight / 2;
        this.crossLine2.pivot = {x:  this.crossLine2.width /2,y:  this.crossLine2.height /2}
        this.crossLine2.rotation = -45 * 3.14 / 180;


        this.gameContainer.addChild(this.crossLine1);
        this.gameContainer.addChild(this.crossLine2);


        this.circle1 = new PIXI.Graphics();
    	this.circle1.beginFill(0xff0000);
        this.circle1.drawCircle(80,80, 80);
		this.circle1.position.x = windowWidth / 2;
		this.circle1.position.y = windowHeight / 4 - 40;
		this.circle1.pivot = {x:  this.circle1.width /2,y:  this.circle1.height /2}

        this.gameContainer.addChild(this.circle1);
    },
    changeColor: function (label) {

    	this.gameContainer.removeChild(this.circle1);
    	this.circle1 = new PIXI.Graphics();
    	this.circle1.beginFill(0x0000ff);
        this.circle1.drawCircle(80,80, 80);
		this.circle1.position.x = windowWidth / 2;
		this.circle1.position.y = windowHeight / 4 - 40;
		this.circle1.pivot = {x:  this.circle1.width /2,y:  this.circle1.height /2}

        this.gameContainer.addChild(this.circle1);

        returnButtonLabel = new PIXI.Text(label, {font:"90px arial", fill:"white"});
returnButtonLabel.scale.x = -4
returnButtonLabel.scale.y = 4;
        this.gameContainer.addChild(returnButtonLabel);

        returnButtonLabel.position.x = windowWidth / 2 - returnButtonLabel.width /2;
		returnButtonLabel.position.y = windowHeight / 4 - 40 - returnButtonLabel.height /2;

    },
    update: function () {
    }
})