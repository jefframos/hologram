/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(firebaseURL){
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0xffffff);
        //this.stage.removeChild(this.loadText);



        this.loadText = new PIXI.Text("label", {font:"50px arial", fill:"black"});
    
        this.stage.addChild(this.loadText);



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

        this.date = new Date();
        this.stepTime = Firebase.ServerValue.TIMESTAMP;

        this.users = [];

        this.counter = 0;


        this.colorList = [0xFF0000, 0x00FF00,0x0000FF,0xFFFFFF]

        this.teams = "";

	},
    deviceLeft:function(){

        APP.stepTime = Firebase.ServerValue.TIMESTAMP;
        APP.socket.updateObj({
            timeStamp:Firebase.ServerValue.TIMESTAMP,
            action:
            {
                message: {pos:ev.center, value:"TE AMO "},
                type:"REMOVE_USER",
                stepTime: APP.stepTime,
                type: ev.type,
                id: APP.id
            }
        });

    },
    readlast:function(obj){
        //console.log('readlast', obj);
    },
    readSnapshot:function(obj){
        //console.log('readSnapshot', obj);
    },
    updateUser:function(id, time){
        //console.log("UPDATE USER ");
        // obj.action.id, Firebase.ServerValue.TIMESTAMP
        for (var i = APP.users.length - 1; i >= 0; i--) {
            if(id == APP.users[i].id)
            {
                APP.users[i].stepTime = time;
            }
        };
    },
    addUser:function(obj){
        //console.log("ADDED USER ");
        APP.teams += obj.action.message.team;
        APP.users.push({
            id:obj.action.id,
            team:obj.action.message.team,
            startedTime: obj.action.startedTime,
            stepTime: Firebase.ServerValue.TIMESTAMP
        });

         

        if(obj.application.teams != APP.teams){
            APP.socket.updateObj({
                action:{
                    type:"UPDATE_TEAMS"
                },
                application:{
                    teams: APP.teams
                },
                timeStamp:Firebase.ServerValue.TIMESTAMP
            });
        }
    },
    getUser:function(id){
        //// console.log("GET USER");
        for (var i = APP.users.length - 1; i >= 0; i--) {
            if(id == APP.users[i].id)
            {
                
                return APP.users[i];
            }
        };
    },
    act:function(obj){
        APP.users.push(obj);
    },
    readObj:function(obj){
        //console.log('readObj', obj);
        
        if(!obj){
            return;
        }
        //// console.log(obj.application.startedTime > obj.timeStamp);
        //console.log(obj.application.startedTime , obj.timeStamp);
        if(obj.application.startedTime >= obj.timeStamp){
            //console.log('startedTime da aplicacao esta maior que o usuario');
            return;
        }


        //console.log(obj.action.type);

        switch(obj.action.type) {
            case "JUMP":
                    //console.log(APP.getUser(obj.action.id).team);
                    APP.gameScreen.jump(APP.getUser(obj.action.id).team);
                    //init users
                    //APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "NEW_USER":
                    contains = false;
                    for (var i = APP.users.length - 1; i >= 0; i--) {
                        if(APP.users[i].id == obj.action.id){
                            contains = true;
                            break;
                        }
                    };
                    if(!contains){
                        APP.addUser(obj);
                    }                   
                    //init users
                    APP.gameScreen.initTeam(obj.action.message.team);
                break;
            case "SEND_MESSAGE":
                    tempUser = APP.getUser(obj.action.id);
                    if(tempUser){
                        //console.log('SEND_MESSAGE');
                        APP.updateUser(obj.action.id, Firebase.ServerValue.TIMESTAMP);
                        APP.gameScreen.changeColor(obj.action.message.value+(APP.counter++));
                    }else{
                        //console.log("SEM USER");
                    }                
                break;
            default:
                //console.log('nao é ação');
        }

    },
    writeObj:function(obj){
        //console.log('writeObj', obj);
    },
    setObj:function(obj){
        //console.log('setObj', obj);
    },
    show:function(){
    },
    hide:function(){
    },
	build:function(){
        var self = this;
        if(isMobile){ 
            this.startedTime = this.stepTime = Firebase.ServerValue.TIMESTAMP;

            this.stage.setBackgroundColor(0x000000);
            this.mobileLobby = new MobileLobby('MobileLobby');
            this.mobileController = new MobileController('MobileController');
            this.screenManager.addScreen(this.mobileLobby);
            this.screenManager.addScreen(this.mobileController);
            this.screenManager.change('MobileLobby');

        }else{
            this.startedTime = this.stepTime = Firebase.ServerValue.TIMESTAMP;
            this.socket.updateObj({application:{
                id:this.id,
                startedTime:this.startedTime,
                stepTime:this.stepTime},
                timeStamp:Firebase.ServerValue.TIMESTAMP
            });

            this.stage.setBackgroundColor(0x000000);
            this.gameScreen = new GameScreen('Game');
            this.screenManager.addScreen(this.gameScreen);

            this.screenManager.change('Game');
        }
	},
    destroy:function(){
    }
});