const http = require('http');
const express = require('express');
const fs = require('fs');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const libs = require('./lib');
const controllers = require('./controllers');

const fileData = './data.json';
const app = express();
const Application = {
  db: {dbname: 'mydb'},
  version: '1.0.0',
};
const server = http.createServer(app);
let users = [];

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use( express.static('./public') );

app.get('/', (req, res) => {
  res.render('home', {
    usersData: users,
  });
});

app.post('/save', (req, res) => {
    users.push({
      fname: req.body.fname || '',
      age: req.body.age || 0,
      dni: req.body.dni || 'xxx',
    });

    fs.writeFile(fileData, JSON.stringify(users), () => {});

    res.redirect('/');
});

app.get('/add', (req, res) => {
  res.render('form');
});

Application.libs = libs(Application);
Application.controllers = controllers(Application);

app.get('/ip', Application.controllers.ip.getCountry);

fs.readFile(fileData, (err, content) => {
  if (err) {}
  else {
    users = JSON.parse(content.toString());
  }

  server.listen(5000, ()=> console.info('running'));
})
