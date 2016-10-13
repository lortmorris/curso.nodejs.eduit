const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const server = http.createServer(app);
const fs = require('fs');

const filename = './data.json';
app.engine('.hbs', exphbs({defaultLayout: 'default', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));

const saveData = (data)=> {
	return fs.writeFileSync(filename, JSON.stringify(data) + "\r\n", {encoding:'utf8', flag:'a'});
};

const getData = ()=> {
	try {
		let data = fs.readFileSync(filename).toString();
		let registers = data.split("\r\n");
		registers.pop();
		return registers.map(reg=>{
			let p = JSON.parse(reg);
			p.message = p.message.replace('//alegria', '<img src="img/alegria.jpg" />');
			return p;
		});
	} catch (e) {
		return [];
	}
};

app.get('/', (req, res, next)=> {
	res.render('home', {signatures: getData(), now: new Date()});
});

app.post('/save', (req, res, next)=> {

	let props = ['name', 'email', 'message'];
	let complete = true;
	let obj = {};

	props.forEach(p=> {
		obj[p] = req.body[p];
		if (!req.body[p]) complete = false;
	});

	if (complete) {
		saveData(obj);
		return res.redirect('/');
	}

	res.send('Sin data para guardar');

});


app.get('/form', (req, res, next)=> {
	res.render('form', {});
});


server.listen(5000);