const http = require('http');
const fs = require('fs');

const documentRoot = './public';
let counter = 0;
const stats = {
  total: 0,
};

const makeStats = (req, res) => {

  const key = Object.keys(req.query);
  stats.total++;

  key.forEach((k) => {
    if (typeof stats[k] === 'undefined') stats[k] = {};
    if (typeof stats[k][ req.query[k] ] === 'undefined') stats[k][ req.query[k] ] = 0;
    stats[k][req.query[k]]++;
  })
  res.end('ok');
};

const isStatic = (req, res, next) => {
  fs.readFile(documentRoot + req.url, (err, data) => {
    if (err) return next();
    return res.end(data.toString());
  });
};

const virtualDirs = {
  '/counter': (req, res) => res.end(''+counter++),
  '/datetime': (req, res) => res.end(new Date().toString()),
  '/echo': (req, res) => res.end( JSON.stringify(req.query) ),
  '/stats': (req, res) => makeStats(req, res),
  '/getstats': (req, res) => res.end( JSON.stringify(stats)),
};

const isVirtual = (req, res, next) => {
 if(req.url in virtualDirs) return virtualDirs[req.url](req, res);
 return next();
};

const show404 = (req, res) => {
  res.end('404 ');
}

const querystring = (req) => {
  req.query = {};
  const parts = req.url.split('?');
  req.url = parts[0];
  if (parts.length > 1) {
    const subparts = parts[1].split('&');
    subparts.forEach( c => {
      const v = c.split('=');
      req.query[v[0]] = v[1];
    });
  }
};

const server = http.createServer((req, res) => {
  console.info(req.url);
  querystring(req);
  isStatic(req, res, () => {
    isVirtual(req, res, () => show404(req, res));
  });
});

server.listen(5000, () => console.info('listen *:5000'));
