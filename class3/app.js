console.log("class3");

const express = require("express");
const app = express();
const mongojs = require('mongojs');
const bodyParser = require("body-parser");
const db = mongojs("test", ["films", "users", "test"]);

app.use(bodyParser.urlencoded({ extended: false }))

function mymws (req, res, next){
	res.set("auth" , "cesar");	
	next();
}

app.use(mymws);
app.use(express.static("./public"));

app.get("/person", (req, res, next)=>{
	db.test.find({},{}, (err, docs)=>{
		if(err){
			console.log("err ", err);
		}else{
			res.json(docs);
		}
	});
});


app.get("/", (req, res)=>{
	console.log("alguien llego> ", req.ip);
	res.end("gracias x su visita");
});


app.post("/save", (req, res)=>{
	let toSave = {
		name: req.body.name || "noname",
		age: req.body.age || 0,
		dni: req.body.dni || "nodni",
	};

	db.test.save(toSave, (err, doc)=>{
		res.redirect("/");
	});
})






app.listen(3000);