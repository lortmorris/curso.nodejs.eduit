"use strict";

const http = require("http");
const fs = require("fs");


console.log("iniciando servidor");
var Routers = {};
var counter = 0;
const publicRoot = "./public";
const getFile = (file)=>{
    file = file== "/" ? "/index.html" : file;
    try{
        return fs.readFileSync(publicRoot+file);
    }catch(e){
        return null;
    }
}

const addRouter = (method, path, cb)=>{
    if(typeof Routers[method] =="undefined") Routers[method]={};
    Routers[method][path] = cb;
}

const isDina = (req, res)=>{
    //console.log(req.method, req.url);

    if(Routers[req.method][req.url]){
        Routers[req.method][req.url](req, res);
    }else return null;
}

addRouter("GET", "/counter", (req, res)=>{
 //   console.log("es counter");
    res.end("Total: "+counter++);
});

http.createServer((req, res)=>{
    var  f = getFile(req.url);
    if(f) return res.end(f);

    if(isDina(req, res)==null){
        f = getFile("/404.html");
        if(f) return res.end(f);
        else res.end("404");
    }


}).listen(5000);
