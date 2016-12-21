const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const mongojs = require('mongojs');
const app = express();
const server = http.createServer(app);
const fs = require('fs');
const db = mongojs('mongodb://localhost/mexico', ['alumnos']);

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'default'}) );
app.set('view engine', '.hbs');


let counter = 0;
let documentRoot = 'public';
let alumnos = [];
let dbfile = 'data.json';

app.use( express.static('./public') );
app.use(bodyParser.urlencoded({ extended: false }));

fs.readFile('./'+dbfile, (err, data)=>{
  if(!err && data.toString()!='') alumnos = JSON.parse(data.toString());
});


let showHome = (DB, req, res)=>{
  let table= '';
  res.render('home', {alumnos: DB});
};


app.get('/counter', (req, res)=> res.end('counter: '+counter++));
app.get('/datetime', (req, res)=> res.end(new Date().toString));
app.get('/', (req, res)=> showHome(alumnos, req, res));
app.get('/alumno/:curp', (req, res)=>{
  let alumno = alumnos.filter(a=> a.curp == req.params.curp);
  if(alumno.length==0) return res.redirect('/');

  res.render('profile', {alumno:  alumno[0]});

})
app.get('/add', (req, res)=>{
  res.render('add');
});

app.post('/save', (req, res)=>{
  req.query.added = new Date();

  db.alumnos.insert(req.body, (err, doc)=>{
    if(err) console.log(err);
    else console.log(doc);
  });
  showHome(alumnos, req, res);
});

app.get('/filter', (req, res)=>{
  showHome(alumnos.filter(a=> a.prom == req.query.prom), req, res)
});

app.get('/delete', (req, res)=>{
  alumnos = alumnos.filter(a=> a.curp != req.query.curp);
  saveDB(alumnos);
  showHome(alumnos, req, res);
})

console.log('listen');
server.listen(5000);
