const e = require("express");

const GAME_WIDTH = 32;
const GAME_HEIGHT = 18;
class HighScore{
    constructor(name,color,length){
        this.name = name;
        this.color = color;
        this.length = length;
    }
    compare(score){
        if (this.length>score.length){
            return true;
        }
        return false;
    }
}
class SnakeSegment{
    constructor(x,y,direction,image,color){
        this.direction=direction;
        this.image = image;
        this.x=x;
        this.y=y;
        this.color = color;
    }
    collides(segment){
        if(this.x == segment.x && this.y == segment.y ){
            return true;
        }
        else{
            return false;
        }
    }
}
class Snake{
    constructor(playerId,socketId,name,color){
        this.head = new SnakeSegment(0,0,'right','head',color);
        this.tail = [];
        this.name = name;
        this.color = color;
        this.direction = 'right';
        this.lastDirection='right';
        this.playerId = playerId;
        this.socket = socketId;
        this.length = 0;
        this.deathFlag = false;
        this.swordFlag = false;
        this.generatePosDir();
    }
    generatePosDir(){
        //this could be altered to check collisions
        var x = Math.floor(Math.random()*GAME_WIDTH);
        var y = Math.floor(Math.random()*GAME_HEIGHT);
        var dir;
        switch (Math.floor(Math.random()*4)){
            case 0:
                dir = 'right';
                break;
            case 1:
                dir = 'down';
                break;
            case 2:
                dir = 'left';
                break;
            case 3:
                dir = 'up';
                break;
        };
        this.head.x = x;
        this.head.y = y;
        this.direction = dir;
        this.lastDirection = dir;
    }
    grow(x){
        this.length+=x;
    }
    shrink(x){
        if (this.length>0){
            this.length-=x;
            this.tail.splice(this.tail.length -x,x);
        }
        if(this.length<0){
            this.length=0;
        }
    }
    setDirection(direction){
        switch (direction){
            case 'right':
                if(this.lastDirection != 'left'){
                    this.direction = direction;
                }
                break;
            case 'left':
                if(this.lastDirection != 'right'){
                    this.direction = direction;
                }
                break;
            case 'up':
                if(this.lastDirection != 'down'){
                    this.direction = direction;
                }
                break;
            case 'down':
                if(this.lastDirection != 'up'){
                    this.direction = direction;
                }
                break;
        };
        
    }
    move(){
        this.tail.push(new SnakeSegment(this.head.x,this.head.y,this.direction,'pixel',this.color));
        
        switch(this.direction){
            case "up":
                this.head.y--;
                this.head.direction = 'up';
                this.lastDirection = 'up';
                if(this.head.y<0){
                    this.head.y = GAME_HEIGHT-1;
                }
                break;
            case "down":
                this.head.y++;
                this.head.direction = 'down';
                this.lastDirection = 'down';
                if(this.head.y>GAME_HEIGHT-1){
                    this.head.y = 0;
                }
                break;
            case "left":
                this.head.x--;
                this.head.direction = 'left';
                this.lastDirection = 'left';
                if(this.head.x<0){
                    this.head.x = GAME_WIDTH-1;
                }
                break;
            case "right":
                this.head.x++;
                this.head.direction = 'right';
                this.lastDirection = 'right';
                if(this.head.x>GAME_WIDTH-1){
                    this.head.x = 0;
                }
                break;
        };
        while (this.tail.length>this.length){
            this.tail.shift();
            if(this.tail.length){
                this.tail[0].image = 'pixel';
            }
        }
    }
    update(){
        this.move();
    }
}
class Item{
    constructor(items){

        this.x = Math.floor((Math.random() * 32));
        this.y = Math.floor((Math.random() * 18));
        while (this.isOccupied(items)){
            this.x = Math.floor((Math.random() * 32));
            this.y = Math.floor((Math.random() * 18));
        }
        this.image = 'pixel';
    }
    isOccupied(items){
        for (var i =0; i<items.length; i++){
            if(this.x == items[i].x && this.y == items[i].y){
                return true;
            }else{
                return false;
            }
        }
    }
    pickedUp(player){
        player.grow(1);
    }
}
class Apple{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'apple';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
    }
}
class Banana{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'banana';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.grow(2);
    }
}
class Orange{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'orange';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.grow(4);
    }
}
class Portal{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'portal';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.generatePosDir();
    }
}
class Skull{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'skull';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.deathFlag = true;
    }
}
class TempPotion{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'tempPotion';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.tail=[];
    }
}
class Potion{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'potion';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.length = 0;
        player.tail = [];
    }
}
class GoldenApple{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'goldenApple';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.grow(99);
    }
}
class Sword{
    constructor(item){
        this.parent = item;
        this.x = item.x;
        this.y = item.y;
        this.image = 'sword';
    }
    pickedUp(player){
        this.parent.pickedUp(player);
        player.swordFlag = true;
        //method to kill all mobs here
    }
}

class Mob{
    constructor(image, updateObject){
        this.x = Math.floor((Math.random() * 32));
        this.y = Math.floor((Math.random() * 18));
        this.image = image;
        this.dir = 'right';
        this.updateObject = updateObject;
        
    }

    collide(player){
        if (player.head.collides(this)){
            player.deathFlag = true;
            return true;
        }

        return false;
    }

    update(){
        this.updateObject.update(this);
        }
    
}

class Spinnable{
    update(mob){
         switch(Math.floor(Math.random()*4)){
            case 1:
                mob.dir = 'right';
                break;
            case 2:
                mob.dir = 'down';
                break;
            case 3:
                mob.dir = 'left';
            case 0:
                mob.dir = 'up';
        }
    }
}

class Moveable{
    update(mob){
        switch(Math.floor(Math.random()*4)){
            case 1:
                mob.x++;
                if (mob.x > 31){
                    mob.x = 0;
                }
                break;
            case 2:
                mob.x--;
                if (mob.x < 0){
                    mob.x = 31;
                }
                break;
            case 3:
                mob.y++;
                if (mob.y > 17){
                    mob.y = 0;
                }
                break;
            case 4:
                mob.y--;
                if (mob.y < 0){
                    mob.y = 17;
                }
                break;
        }
    }
}




module.exports.Game = class Game{
    constructor(){
        this.players = [];
        this.highScores = [];
        this.mobs=[];
        this.items=[];
    }
    addPlayer(playerId,socketId,name,color){
        if (this.players.length == 0){
            this.items = [];
            this.mobs = [];
        }
        this.players.push(
            new Snake(playerId,socketId,name,color)
        );
    };
    //should be error catching for player not found
    getPlayerById(playerId){
        for (var i=0;i<this.players.length;i++){
            if (playerId == this.players[i].playerId){
                return this.players[i];
            }
        }
        return -1;
    };
    removePlayer(playerId){
        //this function is added at runtime in server.js
        var p = this.getPlayerById(playerId);
        if(p != -1){
            var score = new HighScore(p.name,p.color,p.length);
            this.checkHighScore(score);
            this.emitGameOver(p.socket);
            this.players = this.players.filter(function(el) { return el.playerId != playerId; });
        }
    }
    turnPlayer(playerId,direction){
        if(this.getPlayerById(playerId) != -1){
            this.getPlayerById(playerId).setDirection(direction);
        }
    }
    growPlayer(playerId, x){
        if(this.getPlayerById(playerId) != -1){
            this.getPlayerById(playerId).grow(x);
        }
    }
    shrinkPlayer(playerId){
        if(this.getPlayerById(playerId) != -1){
            this.getPlayerById(playerId).shrink(3);
        }
    }
    getGameState(){
        //var state;
        //state.players = this.players //etc
        return this;
    }

    addItem(){
        var itemChance = Math.floor(Math.random()*100)+1;//1-100
        if(itemChance>99){
            this.items.push(new GoldenApple(new Item(this.items)));
        }
        else if(itemChance>97){
            this.items.push(new Sword(new Item(this.items)));
        }
        else if(itemChance>95){
            this.items.push(new Skull(new Item(this.items)));
        }
        else if(itemChance>93){
            this.items.push(new Portal(new Item(this.items)));
        }
        else if(itemChance>91){
            this.items.push(new Potion(new Item(this.items)));
        }
        else if(itemChance>89){
            this.items.push(new TempPotion(new Item(this.items)));
        }
        else if(itemChance>75){
            this.items.push(new Orange(new Item(this.items)));
        }
        else if(itemChance>50){
            this.items.push(new Banana(new Item(this.items)));
        }
        else {
            this.items.push(new Apple(new Item(this.items)));
        }
    }

    addMob(image, updateObject){
        this.mobs.push(new Mob(image, updateObject));
    }



    update(){
        var itemChance = 1 - (this.players.length*.1);
        if (Math.random() > itemChance){
            this.addItem();
        }
        var mobChance = 1 - (this.players.length*.01);
        if (Math.random() > mobChance){
            if (Math.random() > 0.5){
                this.addMob('slime', new Moveable());
            }
            else {
                this.addMob('ghost', new Spinnable());
            }
        }
        for(var i=0;i<this.mobs.length;i++){
            this.mobs[i].update();
        }
        for (var i=0;i<this.players.length;i++){
            this.players[i].update();
            var pid = this.players[i].playerId;

            var currentHead = this.players[i].head;
            for (var j=0; j<this.items.length; j++){
                if (currentHead.collides(this.items[j])){
                    //this.growPlayer(this.players[i].playerId);
                    this.items[j].pickedUp(this.players[i]);
                    this.items.splice(j,1);
                }

            }        
             for (var j=0; j<this.mobs.length; j++){
                if (this.mobs[j].collide(this.players[i])){
                    this.mobs.splice(j,1);
                }
             }
             
            for (var j=0;j<this.players.length;j++){
                var snake = this.players[j];
                if (j!=i && currentHead.collides(snake.head)){
                     this.removePlayer(this.players[i].playerId);
                }
                for(var k=0;k<snake.tail.length;k++){
                    if(currentHead.collides(snake.tail[k])){
                        this.removePlayer(this.players[i].playerId);
                    }
                }
            }
            // for (var j=0;j<this.items.length;j++){
            //     if(currentHead.collides(this.foods[j])){
            //         this.growPlayer(this.players[i].playerId);
            //         this.foods.splice(j,1);
            //     }
            // }
            if(this.getPlayerById(pid) != -1){
                if(this.players[i].swordFlag){
                    this.growPlayer(pid, this.mobs.length);
                    this.mobs = [];
                    this.players[i].swordFlag = false;
                }
                if (this.players[i].deathFlag){
                    this.removePlayer(this.players[i].playerId);
                }
            }
        }
    }
    checkHighScore(score){
        this.highScores.push(score);
        this.highScores.sort((a,b) =>(b.length - a.length));
        this.highScores = this.highScores.slice(0,3);
        //another socket function added at runtime in server.js
        this.emitHighScores();
    }
}
