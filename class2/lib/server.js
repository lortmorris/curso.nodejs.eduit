const fs = require("fs");

const publicDirectory = process.cwd()+"/public";

function server(req, res){

	this.req = req;
	this.res = res;
 console.log(req.url);
  let file="";
  var content="";
  if(req.url=="/") file="/index.html";
  try{
  	content = fs.readFileSync(publicDirectory+file);
  }catch(e){
  	content = fs.readFileSync(publicDirectory+"/404.html");
  }
  
  res.end(content);

}

module.exports = server;