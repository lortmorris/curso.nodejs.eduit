const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require('body-parser')
const exphbs  = require('express-handlebars');
server.listen(5000);

let data = [];
app.use( express.static("./public") );
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('.hbs', exphbs({defaultLayout: 'default', 
							extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get("/", (req, res)=>{
	res.render("home", {
		hoy: new Date(),
		data: data.map( (e,i) => Object.assign({}, e, {i:i} ))
	});
});

app.get("/data", (req, res)=> res.json(data));

app.post("/save", (req, res, next)=>{
	if(req.body.action && req.body.user && req.body.points){
		data.push({
			action: req.body.action,
			user: req.body.user,
			points: req.body.points
		});
	}
	res.redirect("/");
});




