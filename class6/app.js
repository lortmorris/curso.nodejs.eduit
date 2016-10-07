const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/signatures', ['history']);
const app = express();
const screenshot = require('./lib/screenshot');
const Sites = require('./lib/site')(db);
const sites = new Sites();

app.engine('.hbs', exphbs({
	defaultLayout: 'default',
	extname: '.hbs'}
	));

app.use(express.static('./screenshots'));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }))


app.post('/', (req, res)=>{

	screenshot(req.body.url)
	.then((filename)=>{
		return sites.add({
			url: req.body.url,
			name: req.body.name,
			filename: filename.split('/').pop()
		});
	})
	.then(()=> res.redirect("/"))
	.catch((err)=> {
		console.log(err);
		res.send(err);
	});
});

app.get('/',  (req, res)=> {
	
	sites.search({})
	.then((sites)=>{
		res.render('home', {
	    	sites: sites	
	    });
	})
	.catch((err)=> res.send(err));
    
});

app.listen(3000);