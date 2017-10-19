const debug = require('debug')('chat:mws:login');

const login = ({ db }) => ({
    post: (req, res) => {
      debug('POST /login: ', req.body);
        db.users.findOne({ nickname: req.body.nickname, password: req.body.password }, {}, (err, doc) => {
          debug('findOne result: ', doc);
            if (err || doc === null) {
              return res.redirect('/?error=1');
            }
            req.session.userData = doc;
            return res.redirect('/chat');
        });
    }
});

module.exports = login;
