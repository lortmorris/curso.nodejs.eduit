const http = require('http');
const express = require('express');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/institute', ['alumnos']);
const Alumnos = require('./lib/alumnos');
const alumnos = new Alumnos(db);

app.engine('.hbs', exphbs({defaultLayout: 'default', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use( express.static('./public') );

app.get('/', (req, res)=>{

  const params = {};
  alumnos.search()
  .then((data)=>{
    params.alumnos = data;
    return alumnos.count();
  })
  .then((total)=>{
    params.total = total;
    params.datetime= new Date().toString()
    return Promise.resolve();
  })
  .then(()=>{
    res.render('index',params);
  })
  .catch(()=> res.send('Error initialize'))

});

app.get('/form', (req, res)=>{ res.render('form')});
app.get('/delete/:id', (req, res)=>{
  db.alumnos.remove({_id: db.ObjectId(req.params.id)}, (err, doc)=> res.redirect('/'));
});

app.post('/save', (req, res)=>{
  alumnos.insert(req.body)
  .then(()=> res.redirect('/'))

});

app.listen(5000, (err)=>{
  err ? console.log('error') : console.log('listen on *:5000');
})
