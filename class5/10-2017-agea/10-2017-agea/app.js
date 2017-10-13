const http = require('http');
const express = require('express');
const exphbs  = require('express-handlebars');
const mongojs = require('mongojs');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const server = http.createServer(app);
const io = require('socket.io')(server);
const db = mongojs('mongodb://127.0.0.1/chatme', ['users', 'history']);

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 },
  store: new (require('express-sessions'))({
        storage: 'mongodb',
        host: 'localhost', // optional
        port: 27017, // optional
        db: 'chatme', // optional
        collection: 'sessions', // optional
        expire: 86400 // optional
    })
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use( express.static('./public') );
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/chat', (req, res) => {
  if (!req.session.userData) return res.redirect('/');
  res.render('chat', { userData: req.session.userData });
})
app.post('/login', (req, res) => {
  const data = Object.assign({
    email: '',
    password: ''
  }, req.body);

  db.users.findOne({ email: data.email
    ,password: data.password }, (err, doc) => {
      if (err || doc === null) return res.redirect('/?error=1');
      req.session.userData = doc;
      res.redirect('/chat');
    });
});

app.post('/add', (req, res) => {
  const data = Object.assign({
    fname: '',
    lname: '',
    email: '',
    password: '',
  }, req.body);

  db.users.findOne({ email: data.email }, (err, user) => {
    if (user) return res.redirect('/register?error=1');
    return db.users.insert(data, (err, doc) => {
      res.redirect('/');
    });
  });

});

app.get('/register', (req, res) => {
  let msg = null;
  switch(req.query.error) {
    case '1':
      msg = 'Email already register';
      break;
  }
  res.render('register', {
    msg,
  });
});


io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

socket.on('chat message', (msg) => {
   io.emit('chat message', msg);
 });

});



server.listen(5000 , () => console.info('ready *:5000'));
