console.log("Servidor web 1.0, class2");

const http = require('http');
const mainServer = require("./lib/server");
const myserver = new mainServer();

myserver.get("/time", (req, res)=>{
	res.end(new Date().getTime().toString());
});


const server = http.createServer(myserver.Request);

server.listen(8000);