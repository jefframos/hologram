/*jshint undef:false */
var StandardModal = Class.extend({
    init:function(mainScreen){
    	this.container = new PIXI.DisplayObjectContainer();
    	this.modalContainer = new PIXI.DisplayObjectContainer();
       	this.mainScreen = mainScreen;
    },
    getContent:function(){
    	return this.container;
    },
    build: function(){
    	this.backModal = new PIXI.Graphics();
    	this.backModal.beginFill(0);
    	this.backModal.drawRect(0,0,windowWidth, windowHeight);
        this.backModal.alpha = 0.2;
    	this.container.addChild(this.backModal);
    	this.backModal.interactive = true;
    	var self = this;
    	this.backModal.mousedown = this.backModal.touchstart = function(data){
    		// self.hide();
    	}
       	this.container.addChild(this.modalContainer);
    },
    show: function(){
    	this.container.visible = true;
	    this.mainScreen.pause();
    	var self = this;
    	TweenLite.to(this.container, .5, {alpha:1, onComplete:function(){
	       	self.container.visible = true;
    	}})    	
    },
    hide: function(){
    	var self = this;
    	TweenLite.to(this.container, .5, {alpha:0, onComplete:function(){
	       	self.mainScreen.unpause();
	       	self.container.visible = false;
    	}})
    },
    update: function(){
    },
});