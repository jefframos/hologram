/*jshint undef:false */
var FirebaseSocket = SmartSocket.extend({
    init:function(url){
        this._super();
        //instancia o firebase
        this.dataRef = new Firebase(url);
        this.dataRef.limitToLast(1);
    },
    build:function(){
        var self = this;


        this.lastMessagesQuery = this.dataRef.endAt().limitToLast(2);
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

        // mySessionRef.onDisconnect().update({ endedAt: Firebase.ServerValue.TIMESTAMP });
        // mySessionRef.update({ startedAt: Firebase.ServerValue.TIMESTAMP });

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