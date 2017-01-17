const http = require('http');
const fs = require('fs');

const show404 = (req, res)=> res.end('404');
const getFile =(req, res, cb)=>{
  fs.readFile('./public/'+req.file,cb);
}

let counter = 1;
const virtualRoutes ={
  'counter': (req, res)=>res.end('visitante numero: '+counter++),
  'echo': (req, res)=>res.end(JSON.stringify(req.query))
}
const mws=[
  (req,res)=>{
    const parts = req.url.split('?');
    req.query = {};
    req.url = parts[0];
    if(parts[1]){
      const parts2 = parts[1].split('&');
      parts2.forEach(p2=>{
        let p = p2.split('=');
        req.query[p[0]] =p[1];
      })
    }
  },
  (req, res)=> req.file = req.url === '/' ? 'index.html' : req.url.slice(1)
];

const App = (req, res)=>{
  mws.map(m=>m(req,res));
  getFile(req, res, (err, body)=>{
    if(err){
      if(req.file in virtualRoutes) virtualRoutes[req.file](req, res);
      else show404(req, res);
    }
    else{
      res.end(body.toString());
    }

  })
}

const server = http.createServer(App);
server.listen(5000, (err)=>{
  if(err) console.log('Error listen: ', err);
  else console.log('listen on *:5000');
});
