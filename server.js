//node module includes
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
let express = require('express');
var app = require('express')();
var http = require('http').Server(app);
let io = require('socket.io')(http);
const request = require('request');

//custom includes
var snakeGame = require('./snake.js');
//express client files
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var nextPlayerId = 0;
var game = new snakeGame.Game();

game.emitGameOver = function(socket){
  io.to(socket).emit('gameOver');
}
game.emitHighScores = function(){
  io.emit('highScores',game.highScores);
}

function loop(){
  var timestamp = Date.now();
  //add some deltatime thing
  game.update();
  io.emit('gameState',game.getGameState());
  var elapsed = Date.now()-timestamp;
  var timeout = 250 - elapsed;
  if (timeout>0){
    setTimeout(loop,timeout);
  }
  
}

loop();


io.on('connection', function(socket){
  console.log('A user connected.');
  console.log('Assigning player id '+nextPlayerId);
  socket.playerId = nextPlayerId;
  nextPlayerId++;
  socket.on('playerJoin',function(data){
    game.addPlayer(socket.playerId,socket.id,data.name,data.color);
  });
  socket.on('playerDie',function(){
    game.removePlayer(socket.playerId);
  });
  socket.on('disconnect', function(){
    console.log('player id '+socket.playerId + ' disconnected');
    game.removePlayer(socket.playerId);
  });
  socket.on('playerTurn', function(data){
    game.turnPlayer(socket.playerId,data);
  });
  socket.on('playerGrow', function(){
    game.growPlayer(socket.playerId);
  });
  socket.on('playerShrink', function(){
    game.shrinkPlayer(socket.playerId);
  });
  game.emitHighScores();
});

http.listen(process.env.PORT || 3000, function(){});