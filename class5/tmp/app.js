const express = require('express');
const app = express();
const http = require('http');
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/chat', ['history2']);
const server = require('http').Server(app);
const io = require('socket.io')(server);
const users = {};


app.use( express.static('./public') );

io.on('connection', socket => {

  console.log('a user connected: ', socket.id);
  users[socket.id] = {
    added: new Date().getTime(),
    sessionId: null
  };

  socket.on('disconnect', ()=>{
    console.log('user disconnected: ', socket.id);
    delete users[socket.id];
  });

  socket.on('myCurrentSessionId', val=>{
    users[socket.id].sessionId = val;
    db.history2.find({sessionId: val},{}, (err, docs)=>{
      err ? '': socket.emit('history', docs);
    })
  });

  socket.on('chat message', msg => {
    console.log(`msg ${socket.id} : ${msg.msg}`);
    db.history2.insert({
      msg: msg.msg,
      sessionId: msg.sessionId,
      added: new Date()
    }, (err, doc)=>{
      err ? console.log('error: ', err) : io.emit('chat message', doc);
    });

  });

});

server.listen(3000, ()=> console.log('listening on *:3000'));
