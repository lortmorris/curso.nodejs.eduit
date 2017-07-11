const http = require('http');
const libs = require('./lib');
const controllers = require('./controllers');

const Application = {
  db: {dbname: 'mydb'},
  version: '1.0.0',
};

Application.libs = libs(Application);
Application.controllers = controllers(Application);

const server = http.createServer((req, res) => {
  console.info('url: ', req.url);

  if (req.url === '/ip') {
    return Application.controllers.ip.getCountry(req, res);
  }
  res.end('gracias x su visita');
});

server.listen(5000);
