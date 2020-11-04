const GAME_WIDTH = 32;
const GAME_HEIGHT = 16;

class SnakeSegment{
    constructor(){
        this.x=0;
        this.y=0;
        this.color = 0;
    }
}
class Snake{
    constructor(playerId){
        this.x = 1;
        this.y = 1;
        this.direction = "left";
        this.playerId = playerId;
    }
    setDirection(direction){
        this.direction = direction;
    }
    move(){
        switch(this.direction){
            case "up":
                this.y--;
                if(this.y<0){
                    this.y = GAME_HEIGHT;
                }
                break;
            case "down":
                this.y++;
                if(this.y>GAME_HEIGHT){
                    this.y = 0;
                }
                break;
            case "left":
                this.x--;
                if(this.x<0){
                    this.x = GAME_WIDTH-1;
                }
                break;
            case "right":
                this.x++;
                if(this.x>GAME_WIDTH-1){
                    this.x = 0;
                }
                break;
        };
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