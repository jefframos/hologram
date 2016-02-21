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