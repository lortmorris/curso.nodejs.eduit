const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const mongojs = require('mongojs');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const db = mongojs('mongodb://localhost/mexico', ['alumnos']);

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'default'}) );
app.set('view engine', '.hbs');

app.use( express.static('./public') );
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res)=> {
  let filterNotes = [];
  let query = {};

  if(req.query.filterNote) query.prom = req.query.filterNote;

  db.alumnos.distinct('prom', {}, (err, proms)=>{
    db.alumnos.find(query, {}, (err, docs)=>{
      res.render('home', {alumnos: docs,
        filterNotes: proms
      });
    });
  });//end distinct
});

app.get('/alumno/:curp', (req, res)=>{
  db.alumnos.findOne( {curp: req.params.curp}, {}, (err, doc)=>{
    res.render('profile', {alumno:  doc});
  });
});

app.get('/add', (req, res)=>{
  res.render('add', {action:'save',
  btnlabel: 'Add+'});
});

app.post('/save', (req, res)=>{
  req.query.added = new Date();
  db.alumnos.insert(req.body, (err, doc)=>{
    res.redirect('/');
  });
});


io.on('connection', (socket)=>{
  socket.on('disconnect', ()=>{
    console.log('user disconnected: ', socket.id);
  });
  
  socket.on('delete', (id)=>{
    db.alumnos.remove({_id: db.ObjectId(id)}, (err, doc)=>{
      socket.emit('show nofication', 'Delete ok');
    });
  });
});

app.get('/edit/:_id', (req, res)=>{
  db.alumnos.findOne({_id: db.ObjectId(req.params._id)}, (err, doc)=>{
    console.log('alumno: ', doc)
    res.render('add', {alumno: doc,
      action:'update',
      btnlabel: 'Update'
    });
  })
});

app.post('/update/:_id', (req, res)=>{
  db.alumnos.update({_id: db.ObjectId(req.params._id)}, {$set:req.body}, (err, doc)=>{
    res.redirect('/');
  });
});

server.listen(5000, ()=>{
  console.log('listen on *:5000');
});
