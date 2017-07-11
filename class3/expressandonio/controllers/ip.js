
module.exports  = ({ libs }) => ({
  getCountry: (req, res) => {
    res.end( libs.ip.getCountry(req.ip) );
  }
});
