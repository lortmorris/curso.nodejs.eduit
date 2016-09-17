const http = require("http");
const request = (host, path, port,cb)=>{
		let options = {
		  hostname: host,
		  port: port,
		  path: "/"+path,
		  method: 'GET',
		  headers:{
		  	Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			
			"Accept-Language":"es-ES,es;q=0.8",
			"Cache-Control":"max-age=0",
			"Connection":"keep-alive",
			"Host":host+":"+port,			
			"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
		  }
		};

		let req = http.request(options, (res) => {
		  let body = ""
		  res.setEncoding('utf8');
		  res.on('data', data => body+=data );
		  res.on('end', () => cb(null, body) );
		});

		req.on('error', (e) => cb(e,null) );
		req.end();
}

module.exports = request;

if (!module.parent) {
	let host = process.env.HOST || null;
	let path = process.env.URI || null;
	let port = process.env.PORT || 80;
	let limit = process.env.LIMIT || 5;
	if(!host || !path) process.exit(1);

	for(let x=0; x<limit; x++)
	    request(host, path, port, (err, res)=>{
	    	if(err) console.log(err);
	    	else console.log(res);
		});
}


