/*jshint undef:false */
var Enemy = Entity.extend({
    init:function(vel, range, color, entityLayer, teamID){
        // console.log(vel);
        this._super( true );
        this.entityLayer = entityLayer;
        this.color = color;
        this.updateable = false;
        this.deading = false;
        this.range =range;
        this.teamID = teamID;
        this.width = 1;
        this.height = 1;
        this.type = 'fire';
        this.node = null;
        this.velocity.x = vel.x;
        this.velocity.y = vel.y;
        this.timeLive = 1000;
        this.defaultVelocity = 1;
        this.entityContainer = new PIXI.DisplayObjectContainer();
        this.hitContainer = new PIXI.DisplayObjectContainer();
        this.entityContainer.addChild(this.hitContainer);

        this.collidable = true;

    },
    debugPolygon: function(color, force){
        this.debugPolygon = new PIXI.Graphics();

        this.img = new SimpleSprite("img/enemy.png");
        this.img.getContent().anchor = {x:0.5,y:0.5}
        this.debugPolygon.lineStyle(0.5,color);
        // this.debugPolygon.beginFill(color);
        // this.debugPolygon.moveTo(0,0);
        // this.debugPolygon.lineTo(-this.range,this.range*2)
        // this.debugPolygon.lineTo(this.range,this.range*2)
        // this.debugPolygon.drawCircle(0,0,this.range);
        // this.debugPolygon.alpha = 0;
        this.hitContainer.addChild(this.debugPolygon);
        this.hitContainer.addChild(this.img.getContent());
    },
    getContent:function(){
        return this.entityContainer;
    },
    build: function(){
        // this._super();
        this.centerPosition = {x:0, y:0};
        this.updateable = true;
        this.collidable = true;
        // var self = this;
        this.debugPolygon(this.color);
    },
    update: function(){
        this._super();
        if(!this.updateable) return
        this.timeLive --;
        this.entityLayer.collideChilds(this);
        if(this.getContent().position.x < -windowHeight / 2){
            console.log(this.teamID)
             APP.velEnemy -= 0.1;
            if(APP.velEnemy < 1.5)
                APP.velEnemy = 1.5
            APP.enemyCounter++
            APP.socket.updateObj({
                timeStamp:Firebase.ServerValue.TIMESTAMP,
                action:
                {
                    message: {team:this.teamID},
                    type:"NEW_ESCAPE",
                }
            });
            this.kill = true;
            this.updateable = false;
        }
        if(this.timeLive <= 0){
            this.preKill();
        }
    },
    collide:function(arrayCollide){
        if(this.collidable){
             APP.velEnemy += 0.1;
            if(APP.velEnemy > 4.5)
                APP.velEnemy = 4.5
            APP.enemyCounter++
            APP.socket.updateObj({
                timeStamp:Firebase.ServerValue.TIMESTAMP,
                action:
                {
                    message: {team:this.teamID},
                    type:"NEW_KILL",
                }
            });
            this.preKill();
            arrayCollide[0].preKill();
        }
    },
    preKill:function(){
        //this._super();
        if(this.collidable){
           
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:1.2, y:1.2, onComplete:function(){self.kill = true;}});
            TweenLite.to(this.getContent(), 0.3, {alpha:0});
        }
    },
});
