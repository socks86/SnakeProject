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
	app.renderer.resize(window.innerHeight*(16/9), window.innerHeight);
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
        sprite.width = app.renderer.height/this.height;
        sprite.height = app.renderer.height/this.height;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.position.x = (s.x * sprite.width)+sprite.width/2;
        sprite.position.y = (s.y * sprite.height)+sprite.height/2;
        sprite.angle = s.angle;
        sprite.tint = s.tint;
        app.stage.addChild(sprite);
    }
};

graphics.addSprite = function(image,x,y,color,direction){

    var newSprite = [];
    newSprite.image = image;
    newSprite.x =x;
    newSprite.y = y;
    switch (color){
        case 'red':
            newSprite.tint = '0xFF0000';
            break;
        case 'orange':
            newSprite.tint = '0xFF5E13';
            break;
        case 'yellow':
            newSprite.tint = '0xFFFF00';
            break;
        case 'green':
            newSprite.tint = '0x00FF00';
            break;
        case 'blue':
            newSprite.tint = '0x0000FF';
            break;
        case 'purple':
            newSprite.tint = '0xFF00FF';
            break;
        default:
            newSprite.tint = '0xFFFFFF';   
    }
    switch (direction){
        case 'down':
            newSprite.angle = 90;
            break;
        case 'left':
            newSprite.angle = 180;
            break;
        case 'up':
            newSprite.angle = 270;
            break;
        default:
            newSprite.angle = 0;
    }
    this.sprites.push(newSprite);
};
//different for other objects
graphics.makeSnakeSpriteFrame = function(){};
graphics.makeItemSpriteFrame = function(){};
graphics.makeMobSpriteFrame = function(){};

graphics.showGameState = function(gameState){
    this.sprites=[];
    //make player sprites
    for (var i=0;i<gameState.players.length;i++){
        var gameObject = gameState.players[i];
        //some switch statement to pass the gameobject to the right sprite create function
        graphics.addSprite('../images/pixelHead.png',gameObject.head.x,gameObject.head.y,gameObject.head.color,gameObject.head.direction);
        
        gameObject.tail.forEach(segment =>{
            graphics.addSprite('../images/pixel.png',segment.x,segment.y,segment.color,segment.direction);
        });
    }
    for(var i=0; i<gameState.foods.length; i++){
        var gameObject = gameState.foods[i];
        graphics.addSprite('../images/apple.png', gameObject.x,
                gameObject.y);
        }

    //make item sprites

    //make mob sprites
    //for (var i=0; i <= 2; i++){
       // graphics.addSprite('../images/honeybadger.gif',
           // Math.floor((Math.random() * 32) + 1),
           // Math.floor((Math.random() * 18) + 1));

    //for gameState.enemies.length?

    graphics.draw();
};

// function testGraphics(){
//     graphics.sprites = [];
//     for(var i=0;i<100;i++){
//         graphics.addSprite('../images/snake head.png',Math.floor(Math.random()*32),Math.floor(Math.random()*18));
//     }
//     graphics.draw();
// }
