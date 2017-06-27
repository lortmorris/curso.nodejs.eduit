const http = require('http');
const express = require('express');
const mongojs = require('mongojs');
const exphbs  = require('express-handlebars');
const db = mongojs('mongodb://localhost:27017/sales', ['vendors', 'customers', 'sales']);
const app = express();

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

const server = http.createServer(app);
app.use( express.static('./public') );


app.get('/', (req, res)=>{
  const qtype = req.query.qtype || null;
  const query = {};
  if(qtype){
    switch(qtype){
      case 'vendor':
        query['$or'] = [{'vendor.fname' : req.query.param}, {'vendor.lname' : req.query.param}];
      break
      case 'passport':
        query['customer.passport'] = req.query.param;
      break;
    }
  }
  db.sales.find(query, {}).sort({_id: 1})
    .limit(50, (err, sales)=> res.render('home', {sales}) });

});


app.get('/vendors', (req, res)=>{
  const query = {};
  if(req.query.param){
        query['$or'] = [{'fname' : req.query.param}, {'lname' : req.query.param}];
    }

  db.vendors.find(query, {}, (err, vendors)=>{
    res.render('vendors', {vendors});
  });

});

server.listen(5000);
