const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/signatures', ['history']);
const app = express();

app.engine('.hbs', exphbs({
	defaultLayout: 'default',
	extname: '.hbs'}
	));

app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }))


app.post('/', (req, res)=>{
	db.history.insert({
		name: req.body.name || 'noName',
		msg: req.body.msg || 'noMsg'
	}, (err, doc)=>{
		res.redirect('/');
	});
});

app.get('/',  (req, res)=> {
	db.history.find({}, {}, (err, docs)=>{
		res.render('home', {
	    	signatures: docs	
	    });
	});
    
});

app.listen(3000);