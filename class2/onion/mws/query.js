const urlParams = (req, res)=> {
  req.query = {};
  if(req.url.indexOf('?') === -1) return;
  let parts = req.url.split('?');
  req.url = parts[0];

  parts = parts[1].split('&')
    .map(v => v.split('='))
    .filter(p=> p.length===2)
    .map(p=> (req.query[p[0]] = p[1] ));

}

module.exports = urlParams;
