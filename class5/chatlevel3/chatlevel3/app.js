const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const commands = require('./commands');
const libs = require('./lib');
const usersList = {};

const Application = {
  io,
};
Application.usersList = usersList;
Application.commands = commands(Application);
Application.libs = libs(Application);

app.use(express.static('./public'));

io.on('connection', socket => {
  usersList[socket.id] = socket;
  usersList[socket.id].auth = false;

  socket.on('disconnect', () => {
    delete usersList[socket.id];
  });

  socket.on('command', (msg) => {
    socket.emit('notify', Application.libs.process(socket.id, msg)) ;
 });

});

server.listen(5000);
