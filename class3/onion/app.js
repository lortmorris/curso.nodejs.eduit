const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
server.listen(5000);

app.use( express.static('./public') );

app.get('/echo', (req, res)=> res.end(JSON.stringify(req.query)));
