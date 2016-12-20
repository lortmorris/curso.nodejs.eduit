const mongojs = require('mongojs');
const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const server = http.createServer(app);
const db = mongojs('mongodb://localhost/cursonode2', ['persons']);


app.get('/persons/:name/:age', (req, res)=>{

	console.log(req.params);
	db.persons.find({name: req.params.name, age: parseInt(req.params.age)}, {}, (err, docs)=>{
		if(err) console.log('Error: ', err);
		else{
			res.json(docs);
		}
	});
});


app.post('/persons', (req, res)=>{

	db.persons.insert(req.body, (err, doc)=>{
		err? res.json({error: true}) :  res.json(doc);
	});

});

server.listen(5000);

