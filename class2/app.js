console.log("Servidor web 1.0, class2");

const http = require('http');
const myserver = require("./lib/server");


const server = http.createServer((req, res)=>{
	new myserver(req, res);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);