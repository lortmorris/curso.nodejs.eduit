const fs = require("fs");

const publicDirectory = process.cwd()+"/public";

function server(req, res){

	this.req = req;
	this.res = res;
 	console.log(req.url);
  
  if(!this.staticFile()){
  	if(!this.dinamicFile()){
  		this.notFound();
  	}
  }

}


server.prototype.staticFile = function(){
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

server.prototype.dinamicFile = function(){
	console.log("is dinamic?");
	return null;
}

server.prototype.notFound = function(){
	console.log("404");
	this.res.end(fs.readFileSync(publicDirectory+"/404.html"));
}
module.exports = server;