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