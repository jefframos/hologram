/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(firebaseURL){
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0xffffff);
        this.stage.removeChild(this.loadText);
        this.isMobile = isMobile;
        this.appContainer = document.getElementById('rect');
        this.id = parseInt(Math.random() * 100000000000);

        //this.socket = new FirebaseSocket(firebaseURL +parseInt(Math.random() * 100000000000));
        this.socket = new FirebaseSocket(firebaseURL +'12221');
        this.socket.build();
        //this.socket.bind(SmartSocket.READ_SOCKET_SNAPSHOT, this.readSnapshot);
        this.socket.bind(SmartSocket.READ_LAST, this.readlast);
        this.socket.bind(SmartSocket.READ_OBJ, this.readObj);
        this.socket.bind(SmartSocket.WRITE_OBJ, this.writeObj);
        this.socket.bind(SmartSocket.SET_OBJ, this.setObj);
	},
    readlast:function(obj){
        console.log('readlast', obj);
    },
    readSnapshot:function(obj){
        console.log('readSnapshot', obj);
    },
    readObj:function(obj){
        console.log('readObj', obj.socket);
        if(obj.socket.action){
            APP.gameScreen.changeColor(obj.socket.message.value);
        }
    },
    writeObj:function(obj){
        console.log('writeObj', obj);
    },
    setObj:function(obj){
        console.log('setObj', obj);
    },
    show:function(){
    },
    hide:function(){
    },
	build:function(){
        var self = this;
        if(this.isMobile){        // if(true){

            this.socket.updateObj({userMobile:{isMobile:this.isMobile,id:this.id}});

            var touchActions = ['auto', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'];
            Hammer.each(touchActions, function(touchAction) {
                var el = renderer.view;

                var mc = new Hammer(el, {
                    touchAction: touchAction
                });
                mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
                mc.get('pinch').set({ enable: true });

                // mc.on('pan swipe pinch tap doubletap press', function(ev) {
                mc.on('tap', function(ev) {
                    APP.socket.updateObj({socket:{
                        message: {pos:ev.center, value:"TE AMO =)"},
                        action: true,
                        type: ev.type,
                        id: self.id
                    }});
                });
            });
        }else{
            this.socket.updateObj({userDesktop:{isMobile:this.isMobile,id:this.id}});
            this.stage.setBackgroundColor(0x000000);
            this.gameScreen = new GameScreen('Game');
            this.screenManager.addScreen(this.gameScreen);

            this.screenManager.change('Game');
        }
	},
    destroy:function(){
    }
});