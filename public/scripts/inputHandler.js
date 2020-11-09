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
    case "Enter":
      joinGame();
      break;
    // case "KeyQ":
    //   socket.emit('playerGrow');
    //   break;
    // case "KeyW":
    //   socket.emit('playerShrink');
    //   break;
    // case "KeyE":
    //   socket.emit('playerDie');
    //   break;
  };
  //if statement to support old browsers
}
//add event listeners for buttons
function joinGame(){
  if (document.getElementById('menu').style.display != "none"){
    var data = {};
    data.name = getName();
    data.color = getColor();
    socket.emit('playerJoin', data);
    toggleMenu();
  }
}
function toggleMenu(){
  var menu = document.getElementById('menu');
  if(menu.style.display == "none"){
    menu.style.display = "block";
  }else{
    menu.style.display = "none";
  }
}

function getColor() { 
  var ele = document.getElementsByName('color'); 
    
  for(i = 0; i < ele.length; i++) { 
      if(ele[i].checked){
        return(ele[i].value);
      } 
  } 
} 
function getName(){
  return document.getElementById('name').value;
}

function highlightRadio(){
  var ele = document.getElementsByName('color');
  var control = document.getElementsByClassName('radioControl');
  for(i = 0; i < ele.length; i++) { 
      if(ele[i].checked){
        control[i].classList.add("radioHighlight");
      } else{
        control[i].classList.remove("radioHighlight")
      }
  } 
}
function addRadioListeners(){
  var ele = document.getElementsByName('color'); 
  for(i = 0; i < ele.length; i++) { 
    ele[i].addEventListener('change', highlightRadio);
  }
}
addRadioListeners();

function showCurrentPlayers(data){
  var currentPlayers = document.getElementById('currentPlayers');
  currentPlayers.innerHTML = "<p>Now Playing</p>";
  for (var i=0; i<data.length; i++){
    var p = data[i];
    var playerCard =makePlayerHTMLString(p);
    currentPlayers.innerHTML+= playerCard;
  }
}
function showHighScores(data){
  var highScores = document.getElementById('highScores');
  highScores.innerHTML = "<p>High Scores</p>";
  for (var i=0; i<data.length; i++){
    var p = data[i];
    var playerCard =makePlayerHTMLString(p);
    highScores.innerHTML+= playerCard;
  }
}
function makePlayerHTMLString(player){
  var playerCard ='<div class ="playerInfo"><div class="playerColor '+player.color+'Color"></div><div class="playerName">'+player.name+'</div><div class="playerScore">Length:'+player.length+'</div></div>';
  return playerCard
}