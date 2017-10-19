const http = require('http');
const express = require('express');
const debug = require('debug')('chat:app');
const session = require('express-session');
const exphbs = require('express-handlebars');
const mongojs = require('mongojs');
const bodyParser = require('body-parser')
const db = mongojs('mongodb://127.0.0.1/chat', ['users', 'history']);
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const MWS = require('./mws');
app.set('trust proxy', 1);

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'asldkjlaksjdo3dijijasdjioasjdlaidj83n',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV ? true : false }
}));

const Application  = {
  app,
  db,
};

const mws = MWS(Application);
Application.mws = mws;

app.get('/', mws.home.get);
app.get('/register', mws.register.get);
app.post('/register', mws.register.post);
app.get('/chat', mws.chat.get);
app.post('/login', mws.login.post);

server.listen(5000, () => console.info('ready *:5000'));


io.on('connection', (socket) => {
  console.log('a user connected: ', socket);
  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

});
