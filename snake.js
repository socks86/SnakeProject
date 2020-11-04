var gameWidth = 32;
var gameHeight = 16;

module.exports.game = function(){
    this.players = [];
    this.mobs=[];
    this.items=[];
    this.addPlayer = function(playerId){
        this.players.push(
            new snake(playerId)
        );
    };
    this.getPlayerById = function(playerId){
        for (var i=0;i<this.players.length;i++){
            if (playerId == this.players[i].playerId){
                return this.players[i];
            }
        }
    };
    this.removePlayer = function(playerId){
        this.players = this.players.filter(function(el) { return el.playerId != playerId; });
    }
    
    this.turnPlayer = function(playerId,direction){
        this.getPlayerById(playerId).setDirection(direction);
    };
    this.getGameState = function(){
        //var state;
        //state.players = this.players //etc
        return this.players;
    };
    this.update = function(){
        for (var i=0;i<this.players.length;i++){
            this.players[i].update();
        }
    };
};

var snake = function(playerId){
    this.x = 1;
    this.y = 1;
    this.direction = "left";
    this.playerId = playerId;
    this.update=function(){
        this.move(this.direction);
    }
    this.setDirection=function(direction){
        this.direction = direction;
    };
    this.move=function(direction){
        switch(direction){
            case "up":
                this.y--;
                if(this.y<0){
                    this.y = gameHeight;
                }
                break;
            case "down":
                this.y++;
                if(this.y>gameHeight){
                    this.y = 0;
                }
                break;
            case "left":
                this.x--;
                if(this.x<0){
                    this.x = gameWidth-1;
                }
                break;
            case "right":
                this.x++;
                if(this.x>gameWidth-1){
                    this.x = 0;
                }
                break;
        };
    }
    this.log = function(){
        console.log("snake "+this.playerId +" is at coords x: "+this.x+" y: "+this.y);
    }
}
var mob = function(){
    this.x=0;
    this.y=0;
    this.update = function(){};
}
var item = function(){
    this.x=0;
    this.y=0;
    this.update = function(){
    };   
}
var itemDecorator = function(thing){
    this.x=0;
    this.y=0;
    this.update = function(){
        //do stuff

    };   
}