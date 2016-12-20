const http = require('http');
const fs = require('fs');

let counter = 0;
let documentRoot = 'public';
let alumnos = [];
let dbfile = 'data.json';

fs.readFile('./'+dbfile, (err, data)=>{
  if(!err && data.toString()!='') alumnos = JSON.parse(data.toString());
});


let saveDB = (data)=>{
  fs.writeFile('./'+dbfile, JSON.stringify(data), (err)=>{
      //do something
  });
}

let showHome = (DB, req, res)=>{
  let table= '';
  fs.readFile('./'+documentRoot+'/list.html',(err, data)=>{
    DB.forEach(alumno=>{
      table+='<tr>'+
        '<td>'+alumno.curp+'</td>'+
        '<td>'+alumno.fname+'</td>'+
        '<td>'+alumno.lname+'</td>'+
        '<td>'+alumno.dob+'</td>'+
        '<td>'+alumno.prom+'</td>'+
        '<td>'+alumno.added+'</td>'+
        '<td><a href="/delete?curp='+alumno.curp+'">Delete</a></td>'+
      '</tr>';
    });

    res.end(data.toString().replace('{{data}}', table));
  });

};

const endpoints  = {
  '/counter': (req, res)=> res.end('counter: '+counter++),
  '/datetime': (req, res)=> res.end(new Date().toString),
  '/index.html': (req, res)=> showHome(alumnos, req, res),
  '/save': (req, res)=>{
    req.query.added = new Date();
    alumnos.push(req.query);
    saveDB(alumnos);
    showHome(alumnos, req, res);
  },
  '/filter': (req, res)=>{
    showHome(alumnos.filter(a=> a.prom == req.query.prom), req, res)
  },
  '/delete': (req, res)=>{
    alumnos = alumnos.filter(a=> a.curp != req.query.curp);
    saveDB(alumnos);
    showHome(alumnos, req, res);
  }
};


const cleanURL = (req)=>{
  let file = req.url;
  let parts = file.split('?');
  req.query = {};
  file = parts[0];
  file = file == '/' ? '/index.html' : file;
  if(parts.length==2){
    parts = parts[1].split('&');
    parts.forEach(p => {
      let vars = p.split('=');
      req.query[vars[0]] = vars[1];
    });//end forEach
  }//end if
  return file;
}

const server = http.createServer((req, res)=>{
  let file = cleanURL(req);

  console.log('visitante: ', file, req.method);

  if(file in endpoints) endpoints[file](req, res);
  else{
    fs.readFile('./'+documentRoot+file, (err, data) => {
      if (err) res.end ('404');
      else res.end(data);
    });
  }
});

console.log('listen');
server.listen(5000);
