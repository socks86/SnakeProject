module.exports.game = function(){
    this.players = [];
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
    
    this.movePlayer = function(playerId,direction){
        this.getPlayerById(playerId).move(direction);
        this.getPlayerById(playerId).log();
    };
    this.getGameState = function(){
        return this.players;
    };
};

snake = function(playerId){
    this.x = 1;
    this.y = 1;
    this.playerId = playerId;
    this.move=function(direction){
        switch(direction){
            case "up":
                this.y--;
                break;
            case "down":
                this.y++;
                break;
            case "left":
                this.x--;
                break;
            case "right":
                this.x++;
                break;
        };
    }
    this.log = function(){
        console.log("snake "+this.playerId +" is at coords x: "+this.x+" y: "+this.y);
    }
}