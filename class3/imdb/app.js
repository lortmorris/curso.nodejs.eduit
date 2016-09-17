console.log("imdb test app - class3");

const express = require("express");
const http = require("http");
const app = express();
const request = require("./tools/request");

var counter = 0;

function r(q){
	return new Promise((resolve, reject)=>{
		console.log("buscando ", q);
		request("www.omdbapi.com", "?t="+q, 80, (err, data)=>{
			if(err) reject(err);
			else resolve(data);			
		});
	});	
}	


app.use( express.static("./public"));

app.get("/search", (req, res)=>{
	let q = req.query.t.split(",");
	let promises = [];

	q.forEach(i=>promises.push(r(i)));

	Promise.all(promises)
	.then((data)=>{
		res.json({err:null, data:data});
	})
	.catch(e=> res.json({err:e, data:null}));


});

app.get("/counter", (req, res)=>{
	res.end(""+counter++);
	console.log(req.headers);
});


http.createServer(app)
.listen( parseInt(process.env.PORT || 3000)) ;






