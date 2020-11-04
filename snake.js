const GAME_WIDTH = 32;
const GAME_HEIGHT = 16;

class SnakeSegment{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.color = 0;
    }
}
class Snake{
    constructor(playerId){
        this.head = new SnakeSegment(0,0);
        this.tail = [];
        this.direction = "right";
        this.playerId = playerId;
        this.length = 0;
    }
    grow(){
        this.length++;
    }
    shrink(){
        this.length--;
    }
    setDirection(direction){
        this.direction = direction;
    }
    move(){
        this.tail.push(new SnakeSegment(this.head.x,this.head.y));
        switch(this.direction){
            case "up":
                this.head.y--;
                if(this.head.y<0){
                    this.head.y = GAME_HEIGHT;
                }
                break;
            case "down":
                this.head.y++;
                if(this.head.y>GAME_HEIGHT){
                    this.head.y = 0;
                }
                break;
            case "left":
                this.head.x--;
                if(this.head.x<0){
                    this.head.x = GAME_WIDTH-1;
                }
                break;
            case "right":
                this.head.x++;
                if(this.head.x>GAME_WIDTH-1){
                    this.head.x = 0;
                }
                break;
        };
        while (this.tail.length>this.length){
            this.tail.shift();
        }
    }
    update(){
        this.move();
    }
}

module.exports.Game = class Game{
    constructor(){
        this.players = [];
        this.mobs=[];
        this.items=[];
    }
    addPlayer(playerId){
        this.players.push(
            new Snake(playerId)
        );
    };
    //should be error catching for player not found
    getPlayerById(playerId){
        for (var i=0;i<this.players.length;i++){
            if (playerId == this.players[i].playerId){
                return this.players[i];
            }
        }
    };
    removePlayer(playerId){
        this.players = this.players.filter(function(el) { return el.playerId != playerId; });
    }
    turnPlayer(playerId,direction){
        this.getPlayerById(playerId).setDirection(direction);
    }
    growPlayer(playerId){
        this.getPlayerById(playerId).grow();
    }
    shrinkPlayer(playerId){
        this.getPlayerById(playerId).shrink();
    }
    getGameState(){
        //var state;
        //state.players = this.players //etc
        return this.players;
    }
    update(){
        for (var i=0;i<this.players.length;i++){
            this.players[i].update();
        }
    }
}