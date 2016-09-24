const express = require("express");
const http = require("http");
const mongojs = require("mongojs");
const app = express();
const db = mongojs("mongodb://127.0.0.1/abm", ["alumnos"]);

app.use(express.static("./public"));

app.get("/save", (req, res)=>{
	db.alumnos.insert(req.query, (err, doc)=>{
		res.json(err ? {err:err} : doc);
	})
})

app.get("/get",(req, res)=>{
	db.alumnos.find({},{}, (err, docs)=> res.json(err? err: docs));
})

app.get("/remove",(req, res)=>{
	if(!req.query._id) return res.json({err: "need _id"});
	db.alumnos.remove({_id:db.ObjectId(req.query._id)},(err, docs)=> res.json(err? err: docs));
})

app.get("/update", (req, res)=>{
	let q={};
	if(_id in req.query) { 
		q._id = db.ObjectId(req.query._id); 
		delete req.query._id;
	}

	db.alumnos.update(q, {$set: req.query}, (err, doc)=> res.json(err?err:doc));


})
http.createServer(app).listen(process.env.PORT || 5000);