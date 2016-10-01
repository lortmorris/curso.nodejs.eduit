const express = require("express")
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static("./public"));

const makeColor = (str, color)=> "<span style='color:"+color+"'>"+str+"</span>";

const activeUsers = {};

const emit=(id, msg, skip)=>{
	skip = skip || null;

	for(k in activeUsers){
		if(skip!=k)	{
			if(msg.indexOf(k)>-1) msg = makeColor(msg,"red");
			msg = msg.replace(/\/\/alegria/ig, "<img class='icon' src='http://i60.photobucket.com/albums/h34/ramarcher/Ballons%203te/Unbenannt-1-1.jpg' width='16' > ");
			activeUsers[k].emit("message", id+": "+msg);
		}
	}
};

io.on('connection', (socket)=>{
  console.log('a user connected: ', socket.id);
	activeUsers[socket.id] = socket;

	socket.emit("message", Object.keys(activeUsers).join("<br />"));
  socket.on('disconnect', ()=>{
  	delete activeUsers[socket.id];
    console.log('user disconnected: ', socket.id);
  });
	
  socket.on('message', (msg)=>{
  	emit(socket.id, msg,  socket.id);
  	socket.emit("message",makeColor(socket.id+": "+msg, "blue"));
  });
	
});


server.listen(3000, ()=>{
  console.log('listening on *:3000');
});