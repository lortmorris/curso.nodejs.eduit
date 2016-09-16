console.log("class3");

const express = require("express");
const app = express();
const mongojs = require('mongojs');
const bodyParser = require("body-parser");
const db = mongojs("test", ["films", "users", "test"]);
const exphbs  = require('express-handlebars');


app.use(bodyParser.urlencoded({ extended: false }))

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');



function mymws (req, res, next){
	res.set("auth" , "cesar");	
	next();
}

app.use(mymws);
app.use(express.static("./public"));

app.get("/", (req, res)=>{	

	let id  =  req.query.id ? req.query.id: null;
	let q = id ? {_id: db.ObjectId(req.query.id)} : {};

	db.test.find(q,{}, (err, docs)=>{
		if(err){
			console.log("err ", err);
		}else{
			let edit = id ? docs[0] : {};
			res.render("index", {persons: docs, id: id, act: (id ? "/update" : "/save"), edit:edit});
		}
	});

});

function toSave(req, res){

	let id = req.body.id ? req.body.id : null;

	let toSave = {
			name: req.body.name || "noname",
			age: req.body.age || 0,
			dni: req.body.dni || "nodni",
		};

	if(id && id!=""){
		db.test.update({_id: db.ObjectId(id)},{$set: toSave}, (err, doc)=>{
			res.redirect("/");
		});	
	}else{
		db.test.save(toSave, (err, doc)=>{
			res.redirect("/");
		});
	}
	
}

app.post("/save", toSave);
app.post("/update", toSave);






app.listen(3000);