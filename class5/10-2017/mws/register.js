const debug = require('debug')('chat:mws:register');

const register = ({ db }) => ({
  get: (req, res) => {
    debug('GET /register');
    res.render('register', {
      error: req.query.error || null,
    });
  },
  post: (req, res) => {
    debug('POST /register: ', req.body);
    const data = Object.assign({
      fname: '',
      lname: '',
      nickname: '',
      password: '',
      email: '',
    }, req.body);

    const query = {};
    query.$or = [
      { email: data.email },
      { nickname: data.nickname }
    ];

    db.users.findOne(query, {}, (err, doc) => {
      if (err || doc !== null) return res.redirect('/register?error=1');
      db.users.insert(data);
      return res.redirect('/');
    });
  }
});

module.exports = register;
