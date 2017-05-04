let counter = 0;

const virtualDirs = {
  'GET/counter': (req, res)=> res.end('' + counter++),
  'GET/today': (req, res)=> res.end(new Date().toString()),
  'POST/counter': (req, res) => res.end(''+counter * 100),
  'GET/echo': (req, res)=> res.end(JSON.stringify(req.query))
};


module.exports = App =>{
  Object.assign(virtualDirs, require('./users')(App));
  return virtualDirs;
}
