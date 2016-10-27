const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/chat', ['messages']);

app.use(express.static('./public'));

let users = {};

io.on('connection', (socket)=> {

	socket.on('disconnect', ()=>{
		delete users[socket.id];
	});

	socket.on('chat message', (msg)=>{

		let data =  {
			msg: msg,
			datetime: new Date(),
			who: socket.id
		};

		db.messages.insert(data, (err, doc)=>{
			io.emit('msg', doc);
		});
	});

	users[socket.id] = socket;

	socket.emit('user list', Object.keys(users));

	db.messages.find({}, {}).sort({datetime:1}).limit(100).toArray((err, docs)=>{
			socket.emit('last messages', docs);
	});


});


server.listen(process.env.PORT || 3000, ()=> {
	console.log('listening on *');
});