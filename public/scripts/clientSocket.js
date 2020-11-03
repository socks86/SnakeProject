//injected from socket.io
var socket = io();

//client event handlers here
function addSocketEvents(socket){
  //for chat.js
  socket.on('gameState',function(data){
    //console.log(data);
    graphics.showGameState(data);
  });

}
//add the event handlers to the client socket
addSocketEvents(socket);