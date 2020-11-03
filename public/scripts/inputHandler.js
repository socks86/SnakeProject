//add a key listener
document.addEventListener('keydown', handleKeypress);
//emit socket events when game controls are pressed
function handleKeypress(e){
  switch (e.code){
    case "ArrowUp":
      socket.emit('moveRequest','up');
      break;
    case "ArrowDown":
      socket.emit('moveRequest','down');
      break;  
    case "ArrowLeft":
      socket.emit('moveRequest','left');
      break;
    case "ArrowRight":
      socket.emit('moveRequest','right');
      break;
  };
}