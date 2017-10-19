const debug = require('debug')('chat:mws:home');

const home = application => ({
  get: (req, res) => {
    debug('called GET /');
    res.render('home', {
      error: req.query.error || null,
    });
  }
});

module.exports = home;
