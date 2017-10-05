const http = require('http');
const fs = require('fs');
const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const server = http.createServer(app);
let users = [];
const filedb = './data.json';

const writeFile = () => fs.writeFile(filedb, JSON.stringify(users), (err) => {
  if (err) return console.error('Error saving db');
});

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use( express.static('./static') );

app.get('/save', (req, res) => {
  if (req.query.act && req.query.act === 'edit') {
    users = users.map(u => {
        if (u.dni === req.query.olddni) u = req.query;
        return u;
    });
  } else {
    users.push(req.query);
  }

  writeFile();
  res.redirect('/');
});

app.get('/delete', (req, res) => {
    users = users.filter(u => u.dni !== req.query.dni);
    writeFile();
    res.redirect('/');
});

app.get('/form', (req, res) => res.render('form'));
app.get('/edit', (req, res) => {
  const user = [...users].filter( u => u.dni === req.query.dni).pop();
  res.render('form', {
    user,
    edit: true,
  });
});

app.get('/', (req, res) => {
  let data = [...users];
  if (req.query.q) {
    data = data.filter( u => `${u.fname} ${u.lname} ${u.dni}`.toLowerCase().indexOf(req.query.q.toLowerCase()) > -1);
  }
  res.render('home', {
    users: data,
  });
});

fs.readFile(filedb, (err, data) => {
  if (err) console.error('err: ', err);
  else {
    try {
      users = JSON.parse(data.toString());
    } catch(er) {
      console.error('err parse: ', er);
    } //end catch
  }// end else

  server.listen(5000, () => console.info('ready *:5000'));
});
