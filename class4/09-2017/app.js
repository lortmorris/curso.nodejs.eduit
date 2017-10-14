const http = require('http');
const fs = require('fs');
const express = require('express');
const exphbs  = require('express-handlebars');
const mongojs = require('mongojs');
const app = express();
const db = mongojs('mongodb://127.0.0.1/test', ['users']);
const server = http.createServer(app);

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use( express.static('./static') );

app.get('/save', (req, res) => {

  const data = Object.assign({
    dni: '',
    fname: '',
    lname: '',
  }, req.query);

  const cb = () => res.redirect('/');
  if (req.query.act && req.query.act === 'edit') {
    delete data._id;
    data.updated = new Date();
    return db.users.update({ _id: db.ObjectId(req.query._id) }, {
      $set: data,
    }, cb);
  }
  data.added = new Date();
  data.criterial = `${req.query.fname} ${req.query.lname} ${req.query.dni}`;
  db.users.insert(data, cb);

});

app.get('/delete', (req, res) => {
  db.users.remove({ _id: db.ObjectId(req.query._id )}, (err, doc) =>{
    res.redirect('/');
  });
});

app.get('/form', (req, res) => res.render('form'));
app.get('/edit', (req, res) => {
  db.users.findOne({ _id: db.ObjectId(req.query._id) }, (err, doc) => {
    res.render('form', {
      user: doc,
      edit: true,
    });
  });
});

app.get('/', (req, res) => {
  const query = {};
   if (req.query.q) query.criterial = RegExp(req.query.q, 'i');

  db.users.find(query, {}, (err, docs) => {
    res.render('home', {
      users: docs,
    });
  });

});


server.listen(5000, () => console.info('ready *:5000'));
