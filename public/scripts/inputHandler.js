//add a key listener
document.addEventListener('keydown', handleKeypress);
//emit socket events when game controls are pressed
function handleKeypress(e){
  switch (e.code){
    case "ArrowUp":
      socket.emit('playerTurn','up');
      break;
    case "ArrowDown":
      socket.emit('playerTurn','down');
      break;  
    case "ArrowLeft":
      socket.emit('playerTurn','left');
      break;
    case "ArrowRight":
      socket.emit('playerTurn','right');
      break;
    case "KeyQ":
      socket.emit('playerGrow');
      break;
    case "KeyW":
      socket.emit('playerShrink');
      break;
  };
  //if statement to support old browsers
}
//add event listeners for buttons