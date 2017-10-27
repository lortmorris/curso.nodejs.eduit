const http = require('http');
const express = require('express');
const mongojs = require('mongojs');
const config = require('config');
const app = express();
const db = mongojs(`${config.get('db').host}/${config.get('db').db}`, config.get('db').collections);
const server = http.createServer(app);
server.listen(5000);

app.get('/about', (req, res)=> res.json({ about: 'me', version:1 }) );

app.get('/categories', (req, res)=> {
  db.categories.find({}, {}, (err, docs)=> res.json(docs));
});


app.get('/products', (req, res)=> {
  const query = {};

  if (req.query.search) query.title = new RegExp(req.query.search);
  if (req.query.category) {
    query['category.text'] = new RegExp(req.query.category, 'i');
  }

  if (req.query.categoryid) query['category._id'] = db.ObjectId(req.query.categoryid);

  console.info('q: ', query);
  db.products.find(query, {}, (err, docs)=> res.json(docs));
});

app.get('/clear', (req, res)=> db.products.remove({}))
