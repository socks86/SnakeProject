//injected from socket.io
var socket = io();

//client event handlers here
function addSocketEvents(socket){
  //for chat.js
  socket.on('gameState',function(data){
    showCurrentPlayers(data);
    graphics.showGameState(data);
  });
  socket.on('gameOver',function(){
    toggleMenu();
  });
  socket.on('highScores',function(data){
    showHighScores(data);
  });
}
//add the event handlers to the client socket
addSocketEvents(socket);