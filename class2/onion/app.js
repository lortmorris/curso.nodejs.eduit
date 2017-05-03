const http = require('http');
const fs = require('fs');
const urlParams = require('./mws/query');
const controllers = require('./controllers');
const Application = {
  version: '0.1',
  controllers: controllers
};

const virtualDirs = require('./routes')(Application);

let counter = 0;

const getFile = (req, res, next)=>
fs.readFile('./public' + req.url, (err, data) =>
err ? next() : res.end(data.toString())
);

const isVirtualDir = (req, res, next) => {
  if(`${req.method}${req.url}` in virtualDirs) return virtualDirs[`${req.method}${req.url}`](req, res);
  return next(req, res);
}

const show404 = (req, res)=> res.end('404');


const server = http.createServer((req, res) => {
  urlParams(req, res);
  req.url = req.url === '/' ? '/index.html' : req.url;
  getFile(req, res, ()=> isVirtualDir(req, res, show404));
});

server.listen(5000);
console.log('final');
