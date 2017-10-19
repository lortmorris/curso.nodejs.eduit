const debug = require('debug')('chat:mws:chat');
const chat = application => ({
  get: (req, res) => {
    debug('GET /chat :', req.session);
    if (!req.session.userData) return res.redirect('/');

    res.render('chat', {
      userData: req.session.userData,
    });
  },
});

module.exports = chat;
