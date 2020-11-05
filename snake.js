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
        this.playerId = playerId;
        this.socket = socketId;
        this.length = 0;
    }
    grow(){
        this.length++;
    }
    shrink(){
        if (this.length>0){
            this.length--;
        }
    }
    setDirection(direction){
        this.direction = direction;
    }
    move(){
        this.tail.push(new SnakeSegment(this.head.x,this.head.y,this.direction,'pixel',this.color));
        
        switch(this.direction){
            case "up":
                this.head.y--;
                this.head.direction = 'up';
                if(this.head.y<0){
                    this.head.y = GAME_HEIGHT-1;
                }
                break;
            case "down":
                this.head.y++;
                this.head.direction = 'down';
                if(this.head.y>GAME_HEIGHT-1){
                    this.head.y = 0;
                }
                break;
            case "left":
                this.head.x--;
                this.head.direction = 'left';
                if(this.head.x<0){
                    this.head.x = GAME_WIDTH-1;
                }
                break;
            case "right":
                this.head.x++;
                this.head.direction = 'right';
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

module.exports.Game = class Game{
    constructor(){
        this.players = [];
        this.highScores = [];
        this.mobs=[];
        this.items=[];
    }
    addPlayer(playerId,socketId,name,color){
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
    growPlayer(playerId){
        if(this.getPlayerById(playerId) != -1){
            this.getPlayerById(playerId).grow();
        }
    }
    shrinkPlayer(playerId){
        if(this.getPlayerById(playerId) != -1){
            this.getPlayerById(playerId).shrink();
        }
    }
    getGameState(){
        //var state;
        //state.players = this.players //etc
        return this.players;
    }
    update(){
        for (var i=0;i<this.players.length;i++){
            this.players[i].update();
            for (var j=0;j<this.players.length;j++){
                var currentHead = this.players[i].head;
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
        }
    }
    checkHighScore(score){
        console.log('game is checking high scores');
        this.highScores.push(score);
        this.highScores.sort((a,b) =>(b.length - a.length));
        this.highScores = this.highScores.slice(0,3);
        //another socket function added at runtime in server.js
        this.emitHighScores();
    }
}