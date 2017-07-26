const http = require('http');
const express = require('express');
const mongojs = require('mongojs');
const app = express();
const server = http.createServer(app);
const db = mongojs('mongodb://127.0.0.1/chat', ['messages']);
const io = require('socket.io')(server);

const Libs = require('./lib');
app.use( express.static('./public') );
server.listen(5000, ()=> console.info('listening'));

const Application = {
  db,
};


Application.sendError = (msg, socket) => {
  socket.emit('msg', `ERROR:/> ${msg}`);
}

Application.sendMSG = (msg, socket) => {
  socket.emit('msg', `> ${msg}`);
}

Application.libs = Libs(Application);

Application.Commands = {
  '/join': Application.libs.Join,
  '/help': Application.libs.Help,
  '/list': () => {},
  '/msg': () => {},
  '/nick' : Application.libs.Nick,
};

const processCMD = (msg, socket) => {
  const arguments = msg.split(' ');
  const cmd = arguments.shift();
  console.info('processCMD: ', cmd, arguments);
  if (typeof Application.Commands[cmd] === 'undefined') return socket.emit('msg', 'Command not found');
  Application.Commands[cmd]({
    cmd,
    arguments,
  }, socket);
};


io.on('connection', socket => {
  socket.on('disconnect', ()=> console.info('bye ', socket.id));
  socket.on('command', msg => {
    processCMD(msg, socket);
    db.messages.insert({
      added: new Date(),
      msg,
      socketId: socket.id,
    });
  });
});

app.get('/messages', (req, res) => {
  const query = {};
  if (req.query.msg) query.msg = RegExp(req.query.msg);
  Application.lib.getMessages(query)
  .then(data => res.json(data))
  .catch(e => res.json({err: e.toString()}));
});
