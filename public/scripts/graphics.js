//build the main pixi object
const app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio 
});
//add the canvas to the html
document.body.appendChild(app.view);
//add a resize listener
window.addEventListener('resize', resize);
// Resize function window
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
}
//resize before 1st render
resize();

var graphics = {
    height:18,
    width:32,
    sprites:[]
};
graphics.draw = function(){
    app.stage.removeChildren();
    for (var i = 0;i<this.sprites.length;i++){
        var s = this.sprites[i];
        var sprite = new PIXI.Sprite.from(s.image);
        sprite.width = app.renderer.width/this.width;
        sprite.height = app.renderer.height/this.height;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        //sprite.rotation = s.rotation;
        sprite.position.x = (s.x * sprite.width)+sprite.width/2;
        sprite.position.y = (s.y * sprite.height)+sprite.height/2;
        app.stage.addChild(sprite);
    }
};

graphics.addSprite = function(image,x,y){
    //needs color, angle in radians 1/2PI
    //animations?
    var newSprite = [];
    newSprite.image = image;
    newSprite.x =x;
    newSprite.y = y;
    this.sprites.push(newSprite);
};
//different for other objects
graphics.makeSnakeSpriteFrame = function(){};
graphics.makeItemSpriteFrame = function(){};
graphics.makeMobSpriteFrame = function(){};

graphics.showGameState = function(gameState){
    this.sprites=[];
    for (var i=0;i<gameState.length;i++){
        var gameObject = gameState[i];
        //some switch statement to pass the gameobject to the right sprite create function
        graphics.addSprite('../images/snake head.png',gameObject.x,gameObject.y);
    }
    graphics.draw();
};

// function testGraphics(){
//     graphics.sprites = [];
//     for(var i=0;i<100;i++){
//         graphics.addSprite('../images/snake head.png',Math.floor(Math.random()*32),Math.floor(Math.random()*18));
//     }
//     graphics.draw();
// }