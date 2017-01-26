const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use( express.static('./public'));

const usersList = {};
const channelsList = {};

const responseToChannel=(channel, msg)=>{
  if(!channelsList[channel]) return Promise.reject('channel not exists');
  response(msg, Object.keys(channelsList[channel].users));
}
const response =(txt, users=[])=>{
  users.forEach(u => usersList[u].socket.emit('msg', txt))
};


const commands = require('./commands')({
  response: response,
  responseToChannel: responseToChannel,
  usersList:usersList,
  channelsList: channelsList
});

const command = (txt, id)=>{
    let parts = txt.trim().split(' ');
    if(parts[0] in commands){
      let docommand = parts.shift();
      return commands[docommand](parts, id)
    }else Promise.reject('command not found');
}



io.on('connection', (socket)=>{
  usersList[socket.id] ={
    socket: socket,
    channels: []
  };
  socket.on('command', (data)=>{
    command(data, socket.id)
    .then((res)=> response(res, [socket.id]))
    .catch((err)=> {
      console.log(err);
      response(err, [socket.id])
    });
  })
  socket.on('disconnect', ()=>{
    delete usersList[socket.id];
  });
});

server.listen(process.env.PORT || 5000);
