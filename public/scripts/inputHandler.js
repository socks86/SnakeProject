
  // document.getElementById('msg').onkeydown = function(e){
  //   if (e.keyCode==13){
  //      var data ={};
  //      data.user = username;
  //      data.msg = getMsgText();
  //      socket.emit('clientMsg',data);
  //   }
  // }
  
  // function getMsgText(){
  //   var msg = document.getElementById('msg').value;
  //   document.getElementById('msg').value = '';
  //   return msg;
  // }

  //graphics object
  //drawgame

  //input events
document.addEventListener('keydown', handleKeypress);

function handleKeypress(e){
  console.log(e.code);
}