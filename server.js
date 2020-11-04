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

function loop(){
  game.update();
  io.emit('gameState',game.getGameState());
  setTimeout(loop,250);
}

loop();

io.on('connection', function(socket){
  console.log('A user connected.');
  console.log('Assigning player id '+nextPlayerId);
  socket.playerId = nextPlayerId;
  game.addPlayer(nextPlayerId);
  nextPlayerId++;
  socket.on('disconnect', function(){
    console.log('player id '+socket.playerId + 'disconnected');
    game.removePlayer(socket.playerId);
  });
  socket.on('playerTurn', function(data){
    game.turnPlayer(socket.playerId,data);
  });
});

http.listen(process.env.PORT || 3000, function(){});