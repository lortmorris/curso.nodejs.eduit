const http = require('http');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const mongojs = require('mongojs');
const bodyParser = require('body-parser')
const db = mongojs('mongodb://127.0.0.1/chat', ['users', 'history']);
const app = express();
const server = http.createServer(app);

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


app.get('/', (req, res) => {
  res.render('home', {
    error: req.query.error || null,
  });
});

app.post('/login', (req, res) => {
    db.users.findOne({ nickname: req.body.nickname, password: req.body.password}, {}, (err, doc) => {
        if (err || doc === null) {
          return res.redirect('/?error=1');
        }
        req.session.userData = doc;
        return res.redirect('/chat');
    });
});

server.listen(5000, () => console.info('ready *:5000'));
