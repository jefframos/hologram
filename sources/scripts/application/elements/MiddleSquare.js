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