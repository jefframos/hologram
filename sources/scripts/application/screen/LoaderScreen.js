/*jshint undef:false */
var LoaderScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        

        var self = this;

        

        var assetsToLoader = [
        "img/plane1.png",
        "img/plane2.png",
        "img/plane3.png",
        "img/plane4.png",
        "img/enemy.png",
        ];
        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
    },
    onProgress:function(){

    },
    onAssetsLoaded:function()
    {
        this.screenManager.change(APP.firstScreen);
    },
    update:function()
    {
    }
});
