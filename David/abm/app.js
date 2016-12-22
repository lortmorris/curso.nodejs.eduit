const http = require('http');
const express = require('express');
const app = express();
const mongojs = require ('mongojs');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const db = mongojs('mongodb://127.0.0.1/cursodb', ['alumnos', 'logs']);

const server = http.createServer(app);

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'default'}));
app.set('view engine', '.hbs');

let alumnos = [];
app.use (express.static('./public'));
app.use (bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res, next)=>{
	db.alumnos
	.find()
	.limit(10)
	.toArray((err, docs) =>{
		console.log(err,docs);
		res.render("home", {alumnos: docs});
	});
	
});

app.get('/alumnos/:curp', (req, res)=>{
  db.alumnos.findOne( {curp: req.params.curp}, {}, (err, docs)=>{
    res.render('profile', {alumnos:  docs});
  });
});

/*app.get('/profile', (req, res)=>{

});*/

app.get('/add', (req, res)=> res.render("form"));

app.post('/save', (req, res, next)=>{
	db.alumnos.insert(req.body, (err, docs)=>{
		console.log(err,docs);
		res.redirect('/');
	});
	
});



server.listen(5000);