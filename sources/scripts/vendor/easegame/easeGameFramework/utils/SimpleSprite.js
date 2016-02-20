var SimpleSprite =  Class.extend({
	init:function(img, anchor){
		if(typeof(img) === "string")
		{
			this.texture = new PIXI.Texture.fromImage(img);
		}
		else
			this.texture = img;

		this.container = new PIXI.Sprite(this.texture);
		if(anchor){
			this.container.anchor = anchor;
			// console.log(anchor);
		}
	},
	getContent:function(){
		return this.container;
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	}
});
