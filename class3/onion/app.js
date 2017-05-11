const http = require('http');
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression')
const fs = require('fs');
const app = express();
const server = http.createServer(app);
let users  = [];
let counter = 0;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( express.static('./public') );
app.use( compression() );
fs.readFile('./users.json', (err, data)=>{
    try{
      users = JSON.parse(data.toString())
    }catch(e){
      users = [];
    }
    server.listen(5000);
});


app.get('/', (req, res)=>{
  res.render('list', {
    users: users
  });
});

app.get('/api/users', (req, res)=> res.json(users));
app.get('/add', (req, res)=> res.render('form') );

const addUser = (req, res) => {
  users.push(req.body);
  fs.writeFile('./users.json', JSON.stringify(users), (err)=>{
    res.redirect('/');
  });
}

app.get('/echo', (req, res)=> res.end(JSON.stringify(req.query)));
app.get('/today', (req, res)=> res.end(new Date().toString()));
app.get('/counter', (req, res)=> res.end(''+counter++));
app.post('/counter', (req, res)=> res.end(''+counter * 100));
app.post('/users/save', addUser);
