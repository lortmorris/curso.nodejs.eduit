const http = require('http');
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/cursodb', ['alumnos']);

let totalMatch=0;
const server = http.createServer((req, res)=>{
	db.alumnos.findOne({dni: Math.floor(Math.random()*20000000)+2000},{}, (err, doc)=>{
		if(doc!==null) totalMatch++;
		res.end('total: '+totalMatch);
	});
});

server.listen(5000);