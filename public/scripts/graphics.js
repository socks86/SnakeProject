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
    var newSprite = [];
    newSprite.image = image;
    newSprite.x =x;
    newSprite.y = y;
    this.sprites.push(newSprite);
};

function testGraphics(){
    graphics.sprites = [];
    for(var i=0;i<100;i++){
        graphics.addSprite('../images/snake head.png',Math.floor(Math.random()*18),Math.floor(Math.random()*32));
    }
    graphics.draw();
}
// // load the texture we need
// app.loader.add('bunny', '../images/snake head.png').load((loader, resources) => {
//     // This creates a texture from a 'bunny.png' image
//     const bunny = new PIXI.Sprite(resources.bunny.texture);

//     // Setup the position of the bunny
//     bunny.x = app.renderer.width / 2;
//     bunny.y = app.renderer.height / 2;

//     // Rotate around the center
//     bunny.anchor.x = 0.5;
//     bunny.anchor.y = 0.5;

//     // Add the bunny to the scene we are building
//     app.stage.addChild(bunny);

//     // Listen for frame updates
//     app.ticker.add(() => {
//          // each frame we spin the bunny around a bit
//         bunny.rotation += 0.01;
//     });
// });

