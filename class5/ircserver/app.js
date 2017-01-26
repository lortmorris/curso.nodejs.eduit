const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use( express.static('./public'));

const usersList = {};
const response =(txt, users=[])=>{
  users.forEach(u => usersList[u].socket.emit('msg', txt))
};


const commands = require('./commands')({
  response: response,
  usersList:usersList
});

const command = (txt, id)=>{
  return new Promise((resolve, reject)=>{
    let parts = txt.trim().split(' ');
    if(parts[0] in commands){
      let docommand = parts.shift();
      commands[docommand](parts, id)
      .then((res)=>{ resolve(res) })
      .catch((err)=> reject(err));
    }else reject('command not found');
  })
}



io.on('connection', (socket)=>{
  usersList[socket.id] ={
    socket: socket
  };
  socket.on('command', (data)=>{
    command(data, socket.id)
    .then((res)=> response(res, [socket.id]))
    .catch((err)=> {
      response(err, [socket.id])
    });
  })
  socket.on('disconnect', ()=>{
    delete usersList[socket.id];
  });
});

server.listen(process.env.PORT || 5000);
