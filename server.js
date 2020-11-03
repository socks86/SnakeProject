//node module includes
let express = require('express');
var app = require('express')();
var http = require('http').Server(app);
let io = require('socket.io')(http);
const request = require('request');

//express client files
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('A user connected.');
  socket.on('disconnect', function(){
    console.log('A user disconnected');
  });
  // socket.on('clientMsg',function(data){
  //   io.emit('serverMsg',data);
  //   pushOldMsg(data);
  // });
  // socket.on('announce',function(data){
  //   socket.broadcast.emit('serverMsg',data); pushOldMsg(data);
  // });
  // socket.on('requestOld',function(){ writeOld(socket);});
});

http.listen(process.env.PORT || 3000, function(){});