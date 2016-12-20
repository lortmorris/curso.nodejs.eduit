const http = require('http');
const fs = require('fs');
const mongojs = require("mongojs");
const db = mongojs("mongodb://127.0.0.1/chat", ["messages"]);
const express = require("express");
const app = express();
const exphbs = require('express-handlebars');

app.use(express.static("./public"));

const server = http.createServer(app);
const io = require('socket.io')(server);
server.listen(5000);

var connected = {};


app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'default'}));
app.set('view engine', '.hbs');


app.get("/", (req, res)=> {

	console.log('entrnado en home');

	db.messages.find({}, {}, (err, docs)=> {
		res.render("index", {messages: docs});
	});

});

const sendMsg = (msg, socket)=> {
	db.messages.insert({
			msg: msg,
			added: new Date(),
			socketid: socket.id

		}
		, (err, doc)=> {
			console.log(err, doc);
			io.emit("msg", doc);

		});


}

io.on('connection', function (socket) {
	connected[socket.id] = {
		socket: socket,
		added: new Date()
	};

	io.emit("new user", {socketid: socket.id});

	socket.on('msg', data=> sendMsg(data, socket));

	socket.on('getLost', (id)=> {

		db.messages.find({$lt: {_id: db.ObjectId(id)}}).sort({_id: -1}, (err, docs)=> {
			console.log(err, docs);
			socket.emit("recover", docs);
		})
	});


	socket.on('disconnect', ()=> {
		delete connected[socket.id];
	});


});
