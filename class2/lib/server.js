const fs = require("fs");
const publicDirectory = process.cwd()+"/public";

var dinamicRoutes={};

function Request(req, res){
	this.req = req;
	this.res = res;
 	console.log(req.url);
  
  if(!this.staticFile()){
  	if(!this.dinamicFile()){
  		this.notFound();
  	}
  }
}
Request.prototype.staticFile = function(){
	console.log("is static?");
	var _this = this;
	let file="";
  var content="";
  if(_this.req.url=="/") file="/index.html";
  try{
  	content = fs.readFileSync(publicDirectory+file);
  	return _this.res.end(content);
  }catch(e){
  	return null;
  }
 
}

Request.prototype.dinamicFile = function(){
	var _this = this;
	console.log("is dinamic?");

	if(typeof dinamicRoutes[_this.req.url]!="undefined"){
		return dinamicRoutes[_this.req.url](_this.req, _this.res)
	}else return null; //lortmorris
}

Request.prototype.notFound = function(){
	console.log("404");
	this.res.end(fs.readFileSync(publicDirectory+"/404.html"));
}

function server(){

	console.log("new server");
	this.Request = function(req, res){
		console.log("new request");
		new Request(req, res);
	}
}

server.prototype.get = function(path, cb){
	dinamicRoutes[path]=cb;
}
module.exports = server;