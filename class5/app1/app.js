const express = require("express")
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static("./public"));

io.on('connection', (socket)=>{
  console.log('a user connected: ', socket.id);

  socket.on('disconnect', ()=>{
    console.log('user disconnected: ', socket.id);
  });
	
  socket.on('message', (msg)=>{
  	io.emit('message', socket.id+": "+msg);
  });
	
});


server.listen(3000, ()=>{
  console.log('listening on *:3000');
});