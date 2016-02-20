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
        //this.socket.bind(SmartSocket.READ_LAST, this.readlast);
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

                mc.on('pan swipe pinch tap doubletap press', function(ev) {
                    APP.socket.updateObj({socket:{
                        message: {pos:ev.center},
                        type: ev.type,
                        id: self.id
                    }});
                });
            });
        }else{
            this.socket.updateObj({userDesktop:{isMobile:this.isMobile,id:this.id}});
        }
	},
    destroy:function(){
    }
});
/*jshint undef:false */
var FirebaseSocket = SmartSocket.extend({
    init:function(url){
        this._super();
        //instancia o firebase
        this.dataRef = new Firebase(url);
        this.dataRef.limit(1);
    },
    build:function(){
        var self = this;


        this.lastMessagesQuery = this.dataRef.endAt().limit(2);
        this.lastMessagesQuery.on('child_added', function (snapshot) {
            self.readLast(snapshot.val());
        }, function (errorObject) {
            self.socketError(errorObject);
        });

        this.dataRef.on('child_added', function (snapshot) {
            self.readSocketList(snapshot.val());
        }, function (errorObject) {
            self.socketError(errorObject);
        });

        this.dataRef.on('value', function(data) {
            self.readObj(data.val());
        }, function (errorObject) {
            self.socketError(errorObject);
        });
    },
    writeObj:function(obj){
        this._super(obj);
        this.dataRef.push(obj);
    },
    setObj:function(obj){
        this._super(obj);
        this.dataRef.set(obj);
    },
    updateObj:function(obj){
        this._super(obj);
        this.dataRef.update(obj);
    },
    destroy:function(){
    }
});
/*jshint undef:false */
var MobileApp = SmartObject.extend({
	init:function(){
        this._super();
	},
    show:function(){
    },
    hide:function(){
    },
	build:function(){
	},
    destroy:function(){
    }
});
/*jshint undef:false */

isMobile = false;
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
	isMobile = true;


// var windowWidth = 960,
// windowHeight = 640;

// if(isMobile){
// 	tempH = windowHeight
// 	windowHeight = window.innerHeight;
// 	windowWidth = window.innerWidth;
// }

windowWidth = screen.width;
windowHeight = screen.height;

windowWidth = window.innerWidth;
windowHeight = window.innerHeight;

console.log(screen, window.innerWidth, window.innerHeight);

if(isMobile){
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
}

var gameView = document.getElementById('game');
var renderer = PIXI.autoDetectRecommendedRenderer(windowWidth, windowHeight, {antialias:true, view:gameView});


var APP = new Application('https://holo.firebaseio.com/');
APP.build();
APP.show();

var first = true;
function update() {
	requestAnimFrame( update );

	if(first){
		var tempRation =  (window.innerHeight/windowHeight);
		var ratio = 1;//tempRation < (window.innerWidth/windowWidth)?tempRation:(window.innerWidth/windowWidth);
		
		windowWidthVar = windowWidth * ratio;
		windowHeightVar = windowHeight * ratio;

		renderer.view.style.width = windowWidthVar+'px';
		renderer.view.style.height = windowHeightVar+'px';
		first = false;
	}
	APP.update();
	renderer.render(APP.stage);
}


var initialize = function(){
	// //inicia o game e da um build
	PIXI.BaseTexture.SCALE_MODE =0;
	document.body.appendChild(renderer.view);
	
	requestAnimFrame( update);
};

(function () {

	var App = {
		init: function () {
			initialize();
		}
	};
	$(App.init);
})();

